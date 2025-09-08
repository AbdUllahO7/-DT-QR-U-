import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";
import { OrderType, orderTypeService } from "./BranchOrderTypeService";

// Updated Order interfaces
export interface Order {
  orderId: string;
  customerName: string;
  notes?: string;
  orderTypeId: number;
  status: OrderStatus;
  totalAmount: number;
  totalQuantity: number;
  createdDate: string;
  modifiedDate?: string;
  tableId?: number;
  sessionId?: string;
  orderTag?: string;
  rowVersion: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderItemId?: number; // Made optional since new API doesn't always include this
  branchProductId: number;
  productName: string;
  categoryName?: string | null; // Made optional
  price: number;
  quantity?: number; // Made optional, new API uses 'count'
  count?: number; // Added for new API
  totalPrice: number;
  imageUrl?: string | null; // Made optional
  description?: string | null; // Made optional
  notes?: string;
  note?: string; // Added for new API
  // New fields from updated API
  isAddon: boolean;
  parentOrderItemId?: number | null;
  addonItems: OrderItem[];
  addonPrice?: number | null;
  addonNote?: string | null;
}

// Updated PendingOrder interface based on new API response
export interface PendingOrder {
  id: number; // Changed from orderId string to id number
  orderTag: string;
  totalPrice: number; // Changed from totalAmount
  itemCount: number; // Changed from totalQuantity
  createdAt: string; // Changed from createdDate
  tableId?: number;
  tableName?: string; // Added
  customerName: string;
  sessionId?: string; // Added
  items: OrderItem[]; // Added
  rowVersion: string;
}

// Updated BranchOrder interface for /api/Order/branch endpoint
export interface BranchOrder {
  id: number;
  orderTag: string;
  totalPrice: number;
  status: string; // Status as string in new API
  createdAt: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
  tableId?: number;
  tableName?: string;
  customerName: string;
  itemCount: number;
  rowVersion: string;
}

export interface TableBasketSummary {
  tableId: number;
  tableName: string;
  totalAmount: number;
  totalQuantity: number;
  itemsCount: number;
  hasActiveBasket: boolean;
}

// Updated OrderTrackingInfo interface based on new API response
export interface OrderTrackingInfo {
  orderId: number; // Changed from string to number
  orderTag: string;
  totalPrice: number; // Changed from totalAmount
  orderStatus: string; // Changed from status
  statusCode: number; // Added
  orderDate: string; // Changed from createdDate
  createdAt: string; // Added
  confirmedAt?: string | null; // Added
  deliveredAt?: string | null; // Added
  completedAt?: string | null; // Added
  rejectionReason?: string | null; // Added
  cancellationReason?: string | null; // Added
  customerName: string;
  confirmedByUserId?: number | null; // Added
  notes?: string;
  sessionId?: string | null; // Added
  branchId: number; // Added
  tableId?: number | null;
  tableName?: string; // Added
  items: OrderItem[];
  // Status boolean flags
  isConfirmed: boolean; // Added
  isReady: boolean; // Added
  isDelivered: boolean; // Added
  isCancelled: boolean; // Added
  rowVersion: string;
}

export interface QRTrackingInfo {
  qrCode: string;
  trackingUrl: string;
  orderTag: string;
}

// Enums
export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  Completed = 4,
  Cancelled = 5,
  Rejected = 6,
  Delivered = 7
}

export enum OrderTypeEnum {
  DineIn = 1,
  Takeaway = 2,
  Delivery = 3
}

// Request DTOs
export interface CreateSessionOrderDto {
  customerName: string;
  notes?: string;
  orderTypeId: number;
}

export interface ConfirmOrderDto {
  rowVersion: string;
}

export interface RejectOrderDto {
  rejectionReason: string;
  rowVersion: string;
}

export interface UpdateOrderStatusDto {
  newStatus: OrderStatus;
  notes?: string;
  rowVersion: string;
}

export interface SmartCreateOrderDto {
  includeAllTableBaskets: boolean;
  customerName: string;
  notes?: string;
  orderTypeId: number;
}

class OrderService {
  private baseUrl = '/api/Order';
  private orderTypesCache: OrderType[] = [];
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // POST /api/Order/session/{sessionId}
  async createSessionOrder(sessionId: string, data: CreateSessionOrderDto): Promise<Order> {
    try {
      logger.info('Session order oluşturma isteği gönderiliyor', { sessionId, data }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/session/${sessionId}`;
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Session order başarıyla oluşturuldu', { 
        sessionId, 
        orderId: response.data.orderId 
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Session order oluşturma hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Session order oluşturulurken hata oluştu');
    }
  }

  // GET /api/Order/pending - Updated to return new PendingOrder format
  async getPendingOrders(): Promise<PendingOrder[]> {
    try {
      logger.info('Pending orders getirme isteği gönderiliyor', {}, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/pending`;
      const response = await httpClient.get<PendingOrder[]>(url);
      
      const orders = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Pending orders başarıyla alındı', { 
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      
      return orders;
    } catch (error: any) {
      logger.error('Pending orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Pending orders getirilirken hata oluştu');
    }
  }

  // GET /api/Order/table/{tableId}
  async getTableOrders(tableId: number): Promise<Order[]> {
    try {
      logger.info('Table orders getirme isteği gönderiliyor', { tableId }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/table/${tableId}`;
      const response = await httpClient.get<Order[]>(url);
      
      const orders = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Table orders başarıyla alındı', { 
        tableId,
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      
      return orders;
    } catch (error: any) {
      logger.error('Table orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Table orders getirilirken hata oluştu');
    }
  }

  // GET /api/Order/{orderId}
  async getOrder(orderId: string): Promise<Order> {
    try {
      logger.info('Order getirme isteği gönderiliyor', { orderId }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/${orderId}`;
      const response = await httpClient.get<Order>(url);
      
      logger.info('Order başarıyla alındı', { 
        orderId,
        customerName: response.data.customerName,
        status: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order getirilirken hata oluştu');
    }
  }

  // GET /api/Order/branch - Updated to return new BranchOrder format
  async getBranchOrders(): Promise<BranchOrder[]> {
    try {
      logger.info('Branch orders getirme isteği gönderiliyor', {}, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/branch`;
      const response = await httpClient.get<BranchOrder[]>(url);
      
      const orders = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Branch orders başarıyla alındı', { 
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      
      return orders;
    } catch (error: any) {
      logger.error('Branch orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Branch orders getirilirken hata oluştu');
    }
  }

  // POST /api/Order/{orderId}/confirm
  async confirmOrder(orderId: string, data: ConfirmOrderDto): Promise<Order> {
    try {
      logger.info('Order onaylama isteği gönderiliyor', { orderId, data }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/${orderId}/confirm`;
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Order başarıyla onaylandı', { 
        orderId,
        newStatus: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order onaylama hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order onaylanırken hata oluştu');
    }
  }

  // POST /api/Order/{orderId}/reject
  async rejectOrder(orderId: string, data: RejectOrderDto): Promise<Order> {
    try {
      logger.info('Order reddetme isteği gönderiliyor', { orderId, data }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/${orderId}/reject`;
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Order başarıyla reddedildi', { 
        orderId,
        rejectionReason: data.rejectionReason
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order reddetme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order reddedilirken hata oluştu');
    }
  }

  // PUT /api/Order/{orderId}/status
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto): Promise<Order> {
    try {
      logger.info('Order status güncelleme isteği gönderiliyor', { orderId, data }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/${orderId}/status`;
      const response = await httpClient.put<Order>(url, data);
      
      logger.info('Order status başarıyla güncellendi', { 
        orderId,
        oldStatus: data.newStatus,
        newStatus: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order status güncelleme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order status güncellenirken hata oluştu');
    }
  }

  // GET /api/Order/track/{orderTag} - Updated to return new OrderTrackingInfo format
  async trackOrder(orderTag: string): Promise<OrderTrackingInfo> {
    try {
      logger.info('Order tracking getirme isteği gönderiliyor', { orderTag }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/track/${orderTag}`;
      const response = await httpClient.get<OrderTrackingInfo>(url);
      
      logger.info('Order tracking başarıyla alındı', { 
        orderTag,
        orderStatus: response.data.orderStatus,
        statusCode: response.data.statusCode
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order tracking getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order tracking getirilirken hata oluştu');
    }
  }

  // GET /api/Order/track/{orderTag}/qr
  async getOrderTrackingQR(orderTag: string): Promise<QRTrackingInfo> {
    try {
      logger.info('Order tracking QR getirme isteği gönderiliyor', { orderTag }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/track/${orderTag}/qr`;
      const response = await httpClient.get<QRTrackingInfo>(url);
      
      logger.info('Order tracking QR başarıyla alındı', { 
        orderTag,
        trackingUrl: response.data.trackingUrl
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order tracking QR getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order tracking QR getirilirken hata oluştu');
    }
  }

  // POST /api/Order/smart-create
  async smartCreateOrder(data: SmartCreateOrderDto): Promise<Order> {
    try {
      logger.info('Smart order oluşturma isteği gönderiliyor', { data }, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/smart-create`;
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Smart order başarıyla oluşturuldu', { 
        orderId: response.data.orderId,
        customerName: data.customerName,
        includeAllTableBaskets: data.includeAllTableBaskets
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Smart order oluşturma hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Smart order oluşturulurken hata oluştu');
    }
  }

  // GET /api/Order/table-basket-summary
  async getTableBasketSummary(): Promise<TableBasketSummary[]> {
    try {
      logger.info('Table basket summary getirme isteği gönderiliyor', {}, { prefix: 'OrderService' });
      
      const url = `${this.baseUrl}/table-basket-summary`;
      const response = await httpClient.get<TableBasketSummary[]>(url);
      
      const summaries = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Table basket summary başarıyla alındı', { 
        tablesCount: summaries.length,
        activeBaskets: summaries.filter(s => s.hasActiveBasket).length
      }, { prefix: 'OrderService' });
      
      return summaries;
    } catch (error: any) {
      logger.error('Table basket summary getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Table basket summary getirilirken hata oluştu');
    }
  }

  // Cache management for order types
  private async refreshOrderTypesCache(): Promise<void> {
    try {
      this.orderTypesCache = await orderTypeService.getOrderTypes();
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      logger.info('Order types cache güncellendi', { 
        orderTypesCount: this.orderTypesCache.length 
      }, { prefix: 'OrderService' });
    } catch (error) {
      logger.error('Order types cache güncelleme hatası', error, { prefix: 'OrderService' });
      // Keep existing cache if refresh fails
    }
  }

  private async getOrderTypesFromCache(): Promise<OrderType[]> {
    // Check if cache is expired or empty
    if (!this.orderTypesCache.length || Date.now() > this.cacheExpiry) {
      await this.refreshOrderTypesCache();
    }
    
    return this.orderTypesCache;
  }

  // Helper methods for status management - Updated for new API format
getOrderStatusText(status: OrderStatus | string): string {
    if (typeof status === 'string') {
      // Handle string status from new API
      switch (status.toLowerCase()) {
        case 'pending':
          return 'Bekliyor';
        case 'confirmed':
          return 'Onaylandı';
        case 'preparing':
          return 'Hazırlanıyor';
        case 'ready':
          return 'Hazır';
        case 'completed':
          return 'Tamamlandı';
        case 'delivered':
          return 'Teslim Edildi';
        case 'cancelled':
          return 'İptal Edildi';
        case 'rejected':
          return 'Reddedildi';
        default:
          return 'Bilinmeyen';
      }
    }
    
    // Handle numeric enum status
    switch (status) {
      case OrderStatus.Pending:
        return 'Bekliyor';
      case OrderStatus.Confirmed:
        return 'Onaylandı';
      case OrderStatus.Preparing:
        return 'Hazırlanıyor';
      case OrderStatus.Ready:
        return 'Hazır';
      case OrderStatus.Completed:
        return 'Tamamlandı';
      case OrderStatus.Cancelled:
        return 'İptal Edildi';
      case OrderStatus.Rejected:
        return 'Reddedildi';
      case OrderStatus.Delivered:
        return 'Teslim Edildi';
      default:
        return 'Bilinmeyen';
    }
  }

  // Convert string status to OrderStatus enum
 parseOrderStatus(status: string): OrderStatus {
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatus.Pending;
      case 'confirmed':
        return OrderStatus.Confirmed;
      case 'preparing':
        return OrderStatus.Preparing;
      case 'ready':
        return OrderStatus.Ready;
      case 'completed':
        return OrderStatus.Completed;
      case 'cancelled':
        return OrderStatus.Cancelled;
      case 'rejected':
        return OrderStatus.Rejected;
      case 'delivered':
        return OrderStatus.Delivered;
      default:
        return OrderStatus.Pending;
    }
  }

  // Helper methods for order types using OrderTypeService
  async getOrderTypeText(orderTypeId: number): Promise<string> {
    try {
      const orderTypes = await this.getOrderTypesFromCache();
      const orderType = orderTypes.find(ot => ot.id === orderTypeId);
      
      return orderType?.name || 'Bilinmeyen Sipariş Türü';
    } catch (error) {
      logger.error('Order type text getirme hatası', error, { prefix: 'OrderService' });
      return 'Bilinmeyen Sipariş Türü';
    }
  }

  async getOrderType(orderTypeId: number): Promise<OrderType | undefined> {
    try {
      const orderTypes = await this.getOrderTypesFromCache();
      return orderTypes.find(ot => ot.id === orderTypeId);
    } catch (error) {
      logger.error('Order type getirme hatası', error, { prefix: 'OrderService' });
      return undefined;
    }
  }

  async getActiveOrderTypes(): Promise<OrderType[]> {
    try {
      const orderTypes = await this.getOrderTypesFromCache();
      return orderTypes.filter(ot => ot.isActive);
    } catch (error) {
      logger.error('Active order types getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  async getAllOrderTypes(): Promise<OrderType[]> {
    try {
      return await this.getOrderTypesFromCache();
    } catch (error) {
      logger.error('All order types getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  async calculateOrderTotal(orderTypeId: number, baseAmount: number): Promise<{
    baseAmount: number;
    serviceCharge: number;
    totalAmount: number;
  }> {
    try {
      const orderType = await this.getOrderType(orderTypeId);
      
      if (!orderType) {
        return {
          baseAmount,
          serviceCharge: 0,
          totalAmount: baseAmount
        };
      }

      const serviceCharge = (baseAmount * orderType.serviceCharge) / 100;
      const totalAmount = baseAmount + serviceCharge;

      return {
        baseAmount,
        serviceCharge,
        totalAmount
      };
    } catch (error) {
      logger.error('Order total calculation hatası', error, { prefix: 'OrderService' });
      return {
        baseAmount,
        serviceCharge: 0,
        totalAmount: baseAmount
      };
    }
  }

  async getEstimatedTime(orderTypeId: number): Promise<number> {
    try {
      const orderType = await this.getOrderType(orderTypeId);
      return orderType?.estimatedMinutes || 0;
    } catch (error) {
      logger.error('Estimated time getirme hatası', error, { prefix: 'OrderService' });
      return 0;
    }
  }

  async getOrderTypeByCode(code: string): Promise<OrderType | undefined> {
    try {
      const orderTypes = await this.getOrderTypesFromCache();
      return orderTypes.find(ot => ot.code.toLowerCase() === code.toLowerCase());
    } catch (error) {
      logger.error('Order type by code getirme hatası', error, { prefix: 'OrderService' });
      return undefined;
    }
  }

  async getOrderTypesForDisplay(): Promise<OrderType[]> {
    try {
      const orderTypes = await this.getActiveOrderTypes();
      return orderTypes.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      logger.error('Order types for display getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  // Check if order can be modified - Updated to handle both enum and string status
  canModifyOrder(status: OrderStatus | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatus.Pending || enumStatus === OrderStatus.Confirmed;
    }
    return status === OrderStatus.Pending || status === OrderStatus.Confirmed;
  }

  // Check if order can be cancelled - Updated to handle both enum and string status
  canCancelOrder(status: OrderStatus | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatus.Pending || enumStatus === OrderStatus.Confirmed || enumStatus === OrderStatus.Preparing;
    }
    return status === OrderStatus.Pending || status === OrderStatus.Confirmed || status === OrderStatus.Preparing;
  }

  // Helper method to get item quantity (handles both 'quantity' and 'count' fields)
  getItemQuantity(item: OrderItem): number {
    return item.count ?? item.quantity ?? 0;
  }

  // Helper method to get item notes (handles both 'notes' and 'note' fields)
  getItemNotes(item: OrderItem): string {
    return item.note ?? item.notes ?? '';
  }

  // Helper method to calculate total addon price for an item
  calculateAddonTotal(item: OrderItem): number {
    if (!item.addonItems || item.addonItems.length === 0) {
      return 0;
    }
    
    return item.addonItems.reduce((total, addon) => {
      return total + addon.totalPrice;
    }, 0);
  }

  // Helper method to get flat list of all items including addons
  getFlatItemList(items: OrderItem[]): OrderItem[] {
    const flatList: OrderItem[] = [];
    
    items.forEach(item => {
      flatList.push(item);
      if (item.addonItems && item.addonItems.length > 0) {
        flatList.push(...this.getFlatItemList(item.addonItems));
      }
    });
    
    return flatList;
  }

  // Force refresh order types cache
  async refreshOrderTypes(): Promise<void> {
    await this.refreshOrderTypesCache();
  }

  // Clear order types cache
  clearOrderTypesCache(): void {
    this.orderTypesCache = [];
    this.cacheExpiry = 0;
    logger.info('Order types cache temizlendi', {}, { prefix: 'OrderService' });
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
      throw new Error('Sipariş bulunamadı.');
    } else if (error?.response?.status === 409) {
      throw new Error('Bu sipariş zaten işlemde.');
    } else if (error?.response?.status === 422) {
      throw new Error('Sipariş durumu bu işleme uygun değil.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }
}

export const orderService = new OrderService();