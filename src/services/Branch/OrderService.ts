import { BranchOrder, ConfirmOrderDto, CreateSessionOrderDto, Order, OrderItem, OrderTrackingInfo, PendingOrder, QRTrackingInfo, RejectOrderDto, SmartCreateOrderDto, TableBasketSummary, UpdateOrderStatusDto, OrderStatus } from '../../types/BranchManagement/type';
import { CancelOrderDto, OrderStatusEnums, UpdatableOrder, UpdatePendingOrderDto } from '../../types/Orders/type';
import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import { OrderType, orderTypeService } from './BranchOrderTypeService';

export const orderStatusTranslations: Record<string, Record<OrderStatusEnums, string>> = {
  en: {
    [OrderStatusEnums.Pending]: 'Pending',
    [OrderStatusEnums.Confirmed]: 'Confirmed',
    [OrderStatusEnums.Preparing]: 'Preparing',
    [OrderStatusEnums.Ready]: 'Ready',
    [OrderStatusEnums.Completed]: 'Completed',
    [OrderStatusEnums.Cancelled]: 'Cancelled',
    [OrderStatusEnums.Rejected]: 'Rejected',
    [OrderStatusEnums.Delivered]: 'Delivered',
  },
  tr: {
    [OrderStatusEnums.Pending]: 'Bekliyor',
    [OrderStatusEnums.Confirmed]: 'Onaylandı',
    [OrderStatusEnums.Preparing]: 'Hazırlanıyor',
    [OrderStatusEnums.Ready]: 'Hazır',
    [OrderStatusEnums.Completed]: 'Tamamlandı',
    [OrderStatusEnums.Cancelled]: 'İptal Edildi',
    [OrderStatusEnums.Rejected]: 'Reddedildi',
    [OrderStatusEnums.Delivered]: 'Teslim Edildi',
  },
  ar: {
    [OrderStatusEnums.Pending]: 'معلق',
    [OrderStatusEnums.Confirmed]: 'مؤكد',
    [OrderStatusEnums.Preparing]: 'يتم التحضير',
    [OrderStatusEnums.Ready]: 'جاهز',
    [OrderStatusEnums.Completed]: 'مكتمل',
    [OrderStatusEnums.Cancelled]: 'ملغى',
    [OrderStatusEnums.Rejected]: 'مرفوض',
    [OrderStatusEnums.Delivered]: 'تم التوصيل',
  },
};

class OrderService {
  private baseUrl = '/api/Order';
  private orderTypesCache: OrderType[] = [];
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; 
  private activeRequests = new Map<string, Promise<any>>();
  private pendingConfigs = new Set<string>(); 

  async createSessionOrder(data: CreateSessionOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Session order oluşturma isteği gönderiliyor', { data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/from-session?branchId=${branchId}`
        : `${this.baseUrl}/from-session`;
        
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Session order başarıyla oluşturuldu', { 
        orderId: response.data,
        branchId
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Session order oluşturulurken hata oluştu');
    }
  }

  async getBranchOrders(
    branchId?: number, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<{ orders: BranchOrder[], totalItems: number, totalPages: number }> {
    // ✅ Add validation to prevent pageSize = 0
    const validPageSize = pageSize > 0 ? pageSize : 10;
    const validPage = page > 0 ? page : 1;
    
    const requestKey = `branch-${branchId}-${validPage}-${validPageSize}`;
    
    if (this.pendingConfigs.has(requestKey)) {
      return { orders: [], totalItems: 0, totalPages: 0 };
    }
    
    if (this.activeRequests.has(requestKey)) {
      return this.activeRequests.get(requestKey)!;
    }

    try {
      this.pendingConfigs.add(requestKey);
      
      logger.info('Branch orders getirme isteği başlatılıyor', { 
        branchId, 
        page: validPage, 
        pageSize: validPageSize 
      }, { prefix: 'OrderService' });
      
      const params: any = {
        page: validPage,
        pageSize: validPageSize,
        includeItems: true
      };
      
      if (branchId) {
        params.branchId = branchId;
      }
      
      
      const requestPromise = httpClient.get(`${this.baseUrl}/branch`, { params })
        .then(response => {
          const responseData = response.data;
          let orders: BranchOrder[] = [];
          let totalItems = 0;
          let totalPages = 1;
          
          if (responseData && typeof responseData === 'object' && 'items' in responseData) {
            orders = Array.isArray(responseData.items) ? responseData.items : [];
            totalPages = responseData.totalPages || 1;
            totalItems = responseData.totalCount || responseData.totalItems || 0;
          }
          
     
          return {
            orders,
            totalItems,
            totalPages
          };
        })
        .finally(() => {
          this.activeRequests.delete(requestKey);
          this.pendingConfigs.delete(requestKey);
        });
      
      this.activeRequests.set(requestKey, requestPromise);
      return await requestPromise;
      
    } catch (error: any) {
      this.activeRequests.delete(requestKey);
      this.pendingConfigs.delete(requestKey);
      logger.error('Branch orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Branch orders getirilirken hata oluştu');
      return { orders: [], totalItems: 0, totalPages: 0 };
    }
  }

  // Similar pattern for getPendingOrders
  async getPendingOrders(branchId?: number): Promise<PendingOrder[]> {
    const requestKey = `pending-${branchId}`;
    
    if (this.activeRequests.has(requestKey)) {
      return this.activeRequests.get(requestKey)!;
    }

    try {
      const url = branchId 
        ? `${this.baseUrl}/pending?branchId=${branchId}` 
        : `${this.baseUrl}/pending`;
        
      logger.info('Pending orders getirme isteği gönderiliyor', { branchId }, { prefix: 'OrderService' });
      
      const requestPromise = httpClient.get<PendingOrder[]>(url)
        .then(response => {
          const orders = Array.isArray(response.data) ? response.data : [];
          logger.info('Pending orders başarıyla alındı', { 
            branchId,
            ordersCount: orders.length 
          }, { prefix: 'OrderService' });
          return orders;
        })
        .finally(() => {
          this.activeRequests.delete(requestKey);
          this.pendingConfigs.delete(requestKey);
        });
      
      this.activeRequests.set(requestKey, requestPromise);
      return await requestPromise;
      
    } catch (error: any) {
      this.activeRequests.delete(requestKey);
       this.pendingConfigs.delete(requestKey);
      this.handleError(error, 'Pending orders getirilirken hata oluştu');
    }
  }

  async getTableOrders(tableId: number, branchId?: number): Promise<Order[]> {
    try {
      logger.info('Table orders getirme isteği gönderiliyor', { tableId, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/table/${tableId}?branchId=${branchId}`
        : `${this.baseUrl}/table/${tableId}`;
        
      const response = await httpClient.get<Order[]>(url);
      const orders = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Table orders başarıyla alındı', { 
        tableId,
        branchId,
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      
      return orders;
    } catch (error: any) {
      logger.error('Table orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Table orders getirilirken hata oluştu');
    }
  }

  async getOrder(orderId: string, branchId?: number): Promise<Order> {
    try {
      logger.info('Order getirme isteği gönderiliyor', { orderId, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/${orderId}?branchId=${branchId}`
        : `${this.baseUrl}/${orderId}`;
        
      const response = await httpClient.get<Order>(url);
      
      logger.info('Order başarıyla alındı', { 
        orderId,
        branchId,
        customerName: response.data.customerName,
        status: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order getirilirken hata oluştu');
    }
  }

  async confirmOrder(orderId: string, data: ConfirmOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Order onaylama isteği gönderiliyor', { orderId, data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/${orderId}/confirm?branchId=${branchId}`
        : `${this.baseUrl}/${orderId}/confirm`;
        
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Order başarıyla onaylandı', { 
        orderId,
        branchId,
        newStatus: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order onaylama hatası', error, { prefix: 'OrderService' });
      this.handleError(error,error.message);
    }
  }

  async rejectOrder(orderId: string, data: RejectOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Order reddetme isteği gönderiliyor', { orderId, data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/${orderId}/reject?branchId=${branchId}`
        : `${this.baseUrl}/${orderId}/reject`;
        
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Order başarıyla reddedildi', { 
        orderId,
        branchId,
        rejectionReason: data.rejectionReason
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order reddetme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order reddedilirken hata oluştu');
    }
  }

  async cancelOrder(data: CancelOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Order iptal etme isteği gönderiliyor', { orderId: data.orderId, data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/cancel?branchId=${branchId}`
        : `${this.baseUrl}/cancel`;
        
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Order başarıyla iptal edildi', { 
        orderId: data.orderId,
        branchId,
        cancellationReason: data.cancellationReason
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order iptal etme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order iptal edilirken hata oluştu');
    }
  }

  async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Order status güncelleme isteği gönderiliyor', { orderId, data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/${orderId}/status?branchId=${branchId}`
        : `${this.baseUrl}/${orderId}/status`;
        
      const response = await httpClient.put<Order>(url, data);
      
      logger.info('Order status başarıyla güncellendi', { 
        orderId,
        branchId,
        oldStatus: data.newStatus,
        newStatus: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Order status güncelleme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order status güncellenirken hata oluştu');
    }
  }

  async trackOrder(orderTag: string): Promise<OrderTrackingInfo> {
    try {
      logger.info('Order tracking getirme isteği gönderiliyor', { orderTag }, { prefix: 'OrderService' });
      const url = `${this.baseUrl}/track/${orderTag}`;
      const response = await httpClient.get<OrderTrackingInfo>(url);
      logger.info('Order tracking başarıyla alındı', { 
        orderTag,
        OrderStatusEnums: response.data.orderStatus,
        statusCode: response.data.statusCode
      }, { prefix: 'OrderService' });
      return response.data;
    } catch (error: any) {
      logger.error('Order tracking getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Order tracking getirilirken hata oluştu');
    }
  }

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

  /* async smartCreateOrder(data: SmartCreateOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Smart order oluşturma isteği gönderiliyor', { data, branchId }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/smart-create?branchId=${branchId}`
        : `${this.baseUrl}/smart-create`;
        
      const response = await httpClient.post<Order>(url, data);
      
      logger.info('Smart order başarıyla oluşturuldu', { 
        orderId: response.data.orderId,
        customerName: data.customerName,
        includeAllTableBaskets: data.includeAllTableBaskets,
        branchId
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Smart order oluşturma hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Smart order oluşturulurken hata oluştu');
    }
  } */

  async getTableBasketSummary(branchId?: number): Promise<TableBasketSummary[]> {
    try {
      const url = branchId 
        ? `${this.baseUrl}/table-basket-summary?branchId=${branchId}` 
        : `${this.baseUrl}/table-basket-summary`;
        
      logger.info('Table basket summary getirme isteği gönderiliyor', { branchId }, { prefix: 'OrderService' });
      const response = await httpClient.get<TableBasketSummary[]>(url);
      const summaries = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Table basket summary başarıyla alındı', { 
        branchId,
        tablesCount: summaries.length,
        activeBaskets: summaries.filter(s => s.hasActiveBasket).length
      }, { prefix: 'OrderService' });
      
      return summaries;
    } catch (error: any) {
      logger.error('Table basket summary getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Table basket summary getirilirken hata oluştu');
    }
  }

  // Cache management methods with branch support
  private async refreshOrderTypesCache(branchId?: number): Promise<void> {
    try {
      // Use the updated orderTypeService.getOrderTypes method that accepts branchId
      this.orderTypesCache = await orderTypeService.getOrderTypes(branchId);
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      logger.info('Order types cache güncellendi', { 
        branchId,
        orderTypesCount: this.orderTypesCache.length 
      }, { prefix: 'OrderService' });
    } catch (error) {
      logger.error('Order types cache güncelleme hatası', error, { prefix: 'OrderService' });
    }
  }

  private async getOrderTypesFromCache(branchId?: number): Promise<OrderType[]> {
    // Always refresh cache when branchId changes or cache is expired
    if (!this.orderTypesCache.length || Date.now() > this.cacheExpiry) {
      await this.refreshOrderTypesCache(branchId);
    }
    return this.orderTypesCache;
  }

  // Status handling methods
  getOrderStatusText(status: OrderStatusEnums | string, lang: string = 'en'): string {
    const langCode = lang.split('-')[0].toLowerCase();
    const translations = orderStatusTranslations[langCode] || orderStatusTranslations['en'];
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return translations[enumStatus] || translations[OrderStatusEnums.Pending];
    }
    return translations[status] || translations[OrderStatusEnums.Pending];
  }

  parseOrderStatus(status: string): OrderStatusEnums {
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatusEnums.Pending;
      case 'confirmed':
        return OrderStatusEnums.Confirmed;
      case 'preparing':
        return OrderStatusEnums.Preparing;
      case 'ready':
        return OrderStatusEnums.Ready;
      case 'completed':
        return OrderStatusEnums.Completed;
      case 'cancelled':
        return OrderStatusEnums.Cancelled;
      case 'rejected':
        return OrderStatusEnums.Rejected;
      case 'delivered':
        return OrderStatusEnums.Delivered;
      default:
        return OrderStatusEnums.Pending;
    }
  }

  // Order type methods with branch support
  async getOrderTypeText(orderTypeId: number, branchId?: number): Promise<string> {
    try {
      const orderTypes = await this.getOrderTypesFromCache(branchId);
      const orderType = orderTypes.find(ot => ot.id === orderTypeId);
      return orderType?.name || 'Bilinmeyen Sipariş Türü';
    } catch (error) {
      logger.error('Order type text getirme hatası', error, { prefix: 'OrderService' });
      return 'Bilinmeyen Sipariş Türü';
    }
  }

  async getOrderType(orderTypeId: number, branchId?: number): Promise<OrderType | undefined> {
    try {
      const orderTypes = await this.getOrderTypesFromCache(branchId);
      return orderTypes.find(ot => ot.id === orderTypeId);
    } catch (error) {
      logger.error('Order type getirme hatası', error, { prefix: 'OrderService' });
      return undefined;
    }
  }

  async getActiveOrderTypes(branchId?: number): Promise<OrderType[]> {
    try {
      const orderTypes = await this.getOrderTypesFromCache(branchId);
      return orderTypes.filter(ot => ot.isActive);
    } catch (error) {
      logger.error('Active order types getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  async getAllOrderTypes(branchId?: number): Promise<OrderType[]> {
    try {
      return await this.getOrderTypesFromCache(branchId);
    } catch (error) {
      logger.error('All order types getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  async calculateOrderTotal(orderTypeId: number, baseAmount: number, branchId?: number): Promise<{
    baseAmount: number;
    serviceCharge: number;
    totalAmount: number;
  }> {
    try {
      const orderType = await this.getOrderType(orderTypeId, branchId);
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

  async getEstimatedTime(orderTypeId: number, branchId?: number): Promise<number> {
    try {
      const orderType = await this.getOrderType(orderTypeId, branchId);
      return orderType?.estimatedMinutes || 0;
    } catch (error) {
      logger.error('Estimated time getirme hatası', error, { prefix: 'OrderService' });
      return 0;
    }
  }

  async getOrderTypeByCode(code: string, branchId?: number): Promise<OrderType | undefined> {
    try {
      const orderTypes = await this.getOrderTypesFromCache(branchId);
      return orderTypes.find(ot => ot.code.toLowerCase() === code.toLowerCase());
    } catch (error) {
      logger.error('Order type by code getirme hatası', error, { prefix: 'OrderService' });
      return undefined;
    }
  }

  async getOrderTypesForDisplay(branchId?: number): Promise<OrderType[]> {
    try {
      const orderTypes = await this.getActiveOrderTypes(branchId);
      return orderTypes.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      logger.error('Order types for display getirme hatası', error, { prefix: 'OrderService' });
      return [];
    }
  }

  // Order validation methods
  canModifyOrder(status: OrderStatusEnums | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatusEnums.Pending || enumStatus === OrderStatusEnums.Confirmed;
    }
    return status === OrderStatusEnums.Pending || status === OrderStatusEnums.Confirmed;
  }

  canCancelOrder(status: OrderStatusEnums | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatusEnums.Pending || enumStatus === OrderStatusEnums.Confirmed || enumStatus === OrderStatusEnums.Preparing;
    }
    return status === OrderStatusEnums.Pending || status === OrderStatusEnums.Confirmed || status === OrderStatusEnums.Preparing;
  }

  // Order item utility methods
  getItemQuantity(item: OrderItem): number {
    return item.count ?? item.quantity ?? 0;
  }

  getItemNotes(item: OrderItem): string {
    return item.note ?? item.notes ?? '';
  }

  calculateAddonTotal(item: OrderItem): number {
    if (!item.addonItems || item.addonItems.length === 0) {
      return 0;
    }
    return item.addonItems.reduce((total, addon) => {
      return total + addon.totalPrice;
    }, 0);
  }

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

  // Cache management methods
  async refreshOrderTypes(branchId?: number): Promise<void> {
    await this.refreshOrderTypesCache(branchId);
  }

  clearOrderTypesCache(): void {
    this.orderTypesCache = [];
    this.cacheExpiry = 0;
    logger.info('Order types cache temizlendi', {}, { prefix: 'OrderService' });
  }



  // <<< NEW METHOD ADDED HERE >>>
  async updatePendingOrder(data: UpdatePendingOrderDto, branchId?: number): Promise<Order> {
    try {
      logger.info('Pending order güncelleme isteği gönderiliyor', { 
        orderId: data.orderId, 
        branchId 
      }, { prefix: 'OrderService' });
      
      const url = branchId 
        ? `${this.baseUrl}/updatepending?branchId=${branchId}`
        : `${this.baseUrl}/updatepending`;
      const response = await httpClient.put<Order>(url, data);
      
      logger.info('Pending order başarıyla güncellendi', { 
        orderId: response.data.orderId,
        branchId,
        newStatus: response.data.status
      }, { prefix: 'OrderService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Pending order güncelleme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Pending order güncellenirken hata oluştu');
    }
  }

  // <<< UPDATED METHOD HERE >>>
  async getUpdatableOrders(branchId?: number): Promise<UpdatableOrder[]> {
    try {
      const params: any = {
        includeItems: true // <-- ADDED PARAM
      };
      if (branchId) {
        params.branchId = branchId;
      }
        
      logger.info('Updatable orders getirme isteği gönderiliyor', { branchId, params }, { prefix: 'OrderService' });
      
      // Updated to use params object
      const response = await httpClient.get<UpdatableOrder[]>(`${this.baseUrl}/updatable`, {
         params 
      });
      
      const orders = Array.isArray(response.data) ? response.data : [];

      logger.info('Updatable orders başarıyla alındı', { 
        branchId,
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });

      return orders;
    } catch (error: any) {
      this.handleError(error, 'Updatable orders getirilirken hata oluştu');
    }
  }


  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else {
        throw new Error(error.message);
      }
    } else if (error?.response?.status === 401) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    } else if (error?.response?.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    } else if (error?.response?.status === 404) {
      throw new Error('Sipariş bulunamadı.');
    } else if (error?.response?.status === 409) {
      const originalMessage = error?.response?.data?.message || '';
      if (originalMessage.toLowerCase().includes('unconfirmed price changes') || 
          originalMessage.toLowerCase().includes('price changes')) {
        throw error; // Re-throw the original error for price changes
      }
      // Add fallback for other 409 errors
      throw new Error('Çakışma hatası: İşlem tamamlanamadı.');
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

