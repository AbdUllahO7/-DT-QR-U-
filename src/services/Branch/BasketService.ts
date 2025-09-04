import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// Basket item interface for POST request
export interface BasketItemDto {
  branchProductId: number;
  quantity: number;
  parentBasketItemId?: number;
}

// Update basket item interface
export interface UpdateBasketItemDto {
  quantity: number;
}

// Basket item update interface for generic basket operations
export interface BasketItemUpdateDto {
  quantity: number;
}

// Full basket item details interface
export interface BasketItem {
  id: number;
  branchProductId: number;
  productName: string;
  productDescription?: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  parentBasketItemId?: number;
  addons?: BasketItem[];
  createdDate: string;
  modifiedDate?: string;
}

// Full basket interface
export interface Basket {
  id: number;
  userId: number;
  items: BasketItem[];
  totalItems: number;
  totalAmount: number;
  createdDate: string;
  modifiedDate?: string;
}

// WebSocket message types
export enum WebSocketMessageType {
  BASKET_UPDATED = 'BASKET_UPDATED',
  BASKET_CLEARED = 'BASKET_CLEARED',
  ITEM_ADDED = 'ITEM_ADDED',
  ITEM_REMOVED = 'ITEM_REMOVED',
  ITEM_UPDATED = 'ITEM_UPDATED',
  CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
  ERROR = 'ERROR'
}

// WebSocket message interface
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data?: any;
  timestamp: string;
  userId?: number;
}

// WebSocket event callback type
export type BasketWebSocketCallback = (message: WebSocketMessage) => void;

class BasketService {
  private baseUrl = '/api/Basket';
  private webSocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private callbacks: Map<string, BasketWebSocketCallback[]> = new Map();
  private isConnecting = false;
  private heartbeatInterval: number | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  // WebSocket Management
  private initializeWebSocket(): void {
    if (this.isConnecting || this.webSocket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      this.isConnecting = true;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws/basket`;
      
      logger.info('WebSocket bağlantısı kuruluyor', { wsUrl }, { prefix: 'BasketService' });
      
      this.webSocket = new WebSocket(wsUrl);
      
      this.webSocket.onopen = this.onWebSocketOpen.bind(this);
      this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
      this.webSocket.onclose = this.onWebSocketClose.bind(this);
      this.webSocket.onerror = this.onWebSocketError.bind(this);
      
    } catch (error) {
      logger.error('WebSocket bağlantı hatası', error, { prefix: 'BasketService' });
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private onWebSocketOpen(event: Event): void {
    logger.info('WebSocket bağlantısı başarıyla kuruldu', {}, { prefix: 'BasketService' });
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Notify subscribers
    this.notifyCallbacks(WebSocketMessageType.CONNECTION_ESTABLISHED, {
      type: WebSocketMessageType.CONNECTION_ESTABLISHED,
      data: { connected: true },
      timestamp: new Date().toISOString()
    });
  }

  private onWebSocketMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      logger.info('WebSocket mesajı alındı', { messageType: message.type }, { prefix: 'BasketService' });
      
      this.notifyCallbacks(message.type, message);
    } catch (error) {
      logger.error('WebSocket mesaj parsing hatası', error, { prefix: 'BasketService' });
    }
  }

  private onWebSocketClose(event: CloseEvent): void {
    logger.warn('WebSocket bağlantısı kapandı', { 
      code: event.code, 
      reason: event.reason 
    }, { prefix: 'BasketService' });
    
    this.webSocket = null;
    this.isConnecting = false;
    this.stopHeartbeat();
    
    // Attempt reconnection if not a normal close
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private onWebSocketError(event: Event): void {
    logger.error('WebSocket hatası', event, { prefix: 'BasketService' });
    this.isConnecting = false;
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('WebSocket maksimum yeniden bağlanma deneme sayısına ulaşıldı', {}, { prefix: 'BasketService' });
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    
    logger.info('WebSocket yeniden bağlanma planlanıyor', { 
      attempt: this.reconnectAttempts, 
      delay 
    }, { prefix: 'BasketService' });
    
    setTimeout(() => {
      this.initializeWebSocket();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private notifyCallbacks(messageType: WebSocketMessageType, message: WebSocketMessage): void {
    const typeCallbacks = this.callbacks.get(messageType) || [];
    const allCallbacks = this.callbacks.get('*') || [];
    
    [...typeCallbacks, ...allCallbacks].forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        logger.error('WebSocket callback hatası', error, { prefix: 'BasketService' });
      }
    });
  }

  // WebSocket Event Subscription Methods
  public onBasketUpdated(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.BASKET_UPDATED, callback);
  }

  public onBasketCleared(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.BASKET_CLEARED, callback);
  }

  public onItemAdded(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.ITEM_ADDED, callback);
  }

  public onItemRemoved(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.ITEM_REMOVED, callback);
  }

  public onItemUpdated(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.ITEM_UPDATED, callback);
  }

  public onConnectionEstablished(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.CONNECTION_ESTABLISHED, callback);
  }

  public onError(callback: BasketWebSocketCallback): () => void {
    return this.subscribe(WebSocketMessageType.ERROR, callback);
  }

  public onAnyMessage(callback: BasketWebSocketCallback): () => void {
    return this.subscribe('*', callback);
  }

  private subscribe(messageType: WebSocketMessageType | '*', callback: BasketWebSocketCallback): () => void {
    const callbacks = this.callbacks.get(messageType) || [];
    callbacks.push(callback);
    this.callbacks.set(messageType, callbacks);

    // Return unsubscribe function
    return () => {
      const currentCallbacks = this.callbacks.get(messageType) || [];
      const filteredCallbacks = currentCallbacks.filter(cb => cb !== callback);
      this.callbacks.set(messageType, filteredCallbacks);
    };
  }

  // WebSocket Connection Status
  public isConnected(): boolean {
    return this.webSocket?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): string {
    if (!this.webSocket) return 'DISCONNECTED';
    
    switch (this.webSocket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }

  // Manual WebSocket management
  public disconnect(): void {
    this.stopHeartbeat();
    if (this.webSocket) {
      this.webSocket.close(1000, 'Manual disconnect');
      this.webSocket = null;
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    setTimeout(() => {
      this.initializeWebSocket();
    }, 1000);
  }

  // HTTP API Methods
  
  // GET /api/Basket/my-basket
  async getMyBasket(): Promise<Basket | null> {
    try {
      logger.info('Sepet bilgileri getirme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket`;
      const response = await httpClient.get<Basket>(url);
      
      logger.info('Sepet bilgileri başarıyla alındı', { 
        basketId: response.data?.id,
        totalItems: response.data?.totalItems,
        totalAmount: response.data?.totalAmount
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      // If basket is empty (404), return null instead of throwing
      if (error?.response?.status === 404) {
        logger.info('Sepet boş', {}, { prefix: 'BasketService' });
        return null;
      }
      
      logger.error('Sepet bilgileri getirme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet bilgileri getirilirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket
  async clearMyBasket(): Promise<void> {
    try {
      logger.info('Sepet temizleme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket`;
      await httpClient.delete(url);
      
      logger.info('Sepet başarıyla temizlendi', {}, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Sepet temizleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet temizlenirken hata oluştu');
    }
  }

  // POST /api/Basket/my-basket/items/batch
  async addItemsToBasket(items: BasketItemDto[]): Promise<Basket> {
    try {
      logger.info('Sepete ürün ekleme isteği gönderiliyor', { 
        itemsCount: items.length,
        items: items.map(item => ({
          branchProductId: item.branchProductId,
          quantity: item.quantity,
          parentBasketItemId: item.parentBasketItemId
        }))
      }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/items/batch`;
      const response = await httpClient.post<Basket>(url, items);
      
      logger.info('Ürünler başarıyla sepete eklendi', { 
        basketId: response.data.id,
        totalItems: response.data.totalItems,
        totalAmount: response.data.totalAmount
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Sepete ürün ekleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Ürünler sepete eklenirken hata oluştu');
    }
  }

  // Convenience method for adding a single item
  async addItemToBasket(item: BasketItemDto): Promise<Basket> {
    return this.addItemsToBasket([item]);
  }

  // PUT /api/Basket/my-basket/items/{basketItemId}
  async updateMyBasketItem(basketItemId: number, updateData: UpdateBasketItemDto): Promise<BasketItem> {
    try {
      logger.info('Sepet ürünü güncelleme isteği gönderiliyor', { 
        basketItemId,
        updateData 
      }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/items/${basketItemId}`;
      const response = await httpClient.put<BasketItem>(url, updateData);
      
      logger.info('Sepet ürünü başarıyla güncellendi', { 
        basketItemId,
        newQuantity: updateData.quantity 
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Sepet ürünü güncelleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet ürünü güncellenirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/items/{basketItemId}
  async removeMyBasketItem(basketItemId: number): Promise<void> {
    try {
      logger.info('Sepet ürünü silme isteği gönderiliyor', { basketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/items/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet ürünü başarıyla silindi', { basketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Sepet ürünü silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet ürünü silinirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/products/{basketItemId}
  async removeMyBasketProduct(basketItemId: number): Promise<void> {
    try {
      logger.info('Sepet ürünü ve tüm addon\'ları silme isteği gönderiliyor', { basketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/products/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet ürünü ve addon\'ları başarıyla silindi', { basketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Sepet ürünü ve addon\'ları silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet ürünü ve addon\'ları silinirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/addons/{addonBasketItemId}
  async removeMyBasketAddon(addonBasketItemId: number): Promise<void> {
    try {
      logger.info('Sepet addon\'ı silme isteği gönderiliyor', { addonBasketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/addons/${addonBasketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet addon\'ı başarıyla silindi', { addonBasketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Sepet addon\'ı silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Sepet addon\'ı silinirken hata oluştu');
    }
  }

  // PUT /api/Basket/{basketId}/items/{itemId}
  async updateBasketItem(basketId: string, itemId: number, updateData: BasketItemUpdateDto): Promise<BasketItem> {
    try {
      logger.info('Belirli sepet ürünü güncelleme isteği gönderiliyor', { 
        basketId,
        itemId,
        updateData 
      }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/${basketId}/items/${itemId}`;
      const response = await httpClient.put<BasketItem>(url, updateData);
      
      logger.info('Belirli sepet ürünü başarıyla güncellendi', { 
        basketId,
        itemId,
        newQuantity: updateData.quantity 
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Belirli sepet ürünü güncelleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Belirli sepet ürünü güncellenirken hata oluştu');
    }
  }

  // DELETE /api/Basket/{basketId}/items/{itemId}
  async removeBasketItem(basketId: string, itemId: number): Promise<void> {
    try {
      logger.info('Belirli sepet ürünü silme isteği gönderiliyor', { basketId, itemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/${basketId}/items/${itemId}`;
      await httpClient.delete(url);
      
      logger.info('Belirli sepet ürünü başarıyla silindi', { basketId, itemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Belirli sepet ürünü silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Belirli sepet ürünü silinirken hata oluştu');
    }
  }

  // Enhanced error handling helper
  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        // Validation error'ları göster
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else {
        throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
      }
    } else if (error?.response?.status === 401) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    } else if (error?.response?.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    } else if (error?.response?.status === 404) {
      throw new Error('Sepet bulunamadı.');
    } else if (error?.response?.status === 409) {
      throw new Error('Bu ürün zaten sepetinizde mevcut.');
    } else if (error?.response?.status === 422) {
      throw new Error('Stok yetersiz veya ürün mevcut değil.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }

  // Cleanup method for when service is destroyed
  public destroy(): void {
    logger.info('BasketService kapatılıyor', {}, { prefix: 'BasketService' });
    
    this.disconnect();
    this.callbacks.clear();
  }
}

// Create and export singleton instance
export const basketService = new BasketService();

// Auto cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    basketService.destroy();
  });
}