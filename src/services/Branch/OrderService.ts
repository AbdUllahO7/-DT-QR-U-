import { BranchOrder, ConfirmOrderDto, CreateSessionOrderDto, Order, OrderItem, OrderStatus, OrderTrackingInfo, PendingOrder, QRTrackingInfo, RejectOrderDto, SmartCreateOrderDto, TableBasketSummary, UpdateOrderStatusDto } from '../../types/Orders/type';
import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import { OrderType, orderTypeService } from './BranchOrderTypeService';

// Updated Order interfaces


export const orderStatusTranslations: Record<string, Record<OrderStatus, string>> = {
  en: {
    [OrderStatus.Pending]: 'Pending',
    [OrderStatus.Confirmed]: 'Confirmed',
    [OrderStatus.Preparing]: 'Preparing',
    [OrderStatus.Ready]: 'Ready',
    [OrderStatus.Completed]: 'Completed',
    [OrderStatus.Cancelled]: 'Cancelled',
    [OrderStatus.Rejected]: 'Rejected',
    [OrderStatus.Delivered]: 'Delivered',
  },
  tr: {
    [OrderStatus.Pending]: 'Bekliyor',
    [OrderStatus.Confirmed]: 'Onaylandı',
    [OrderStatus.Preparing]: 'Hazırlanıyor',
    [OrderStatus.Ready]: 'Hazır',
    [OrderStatus.Completed]: 'Tamamlandı',
    [OrderStatus.Cancelled]: 'İptal Edildi',
    [OrderStatus.Rejected]: 'Reddedildi',
    [OrderStatus.Delivered]: 'Teslim Edildi',
  },
  ar: {
    [OrderStatus.Pending]: 'معلق',
    [OrderStatus.Confirmed]: 'مؤكد',
    [OrderStatus.Preparing]: 'يتم التحضير',
    [OrderStatus.Ready]: 'جاهز',
    [OrderStatus.Completed]: 'مكتمل',
    [OrderStatus.Cancelled]: 'ملغى',
    [OrderStatus.Rejected]: 'مرفوض',
    [OrderStatus.Delivered]: 'تم التوصيل',
  },
};
class OrderService {
  private baseUrl = '/api/Order';
  private orderTypesCache: OrderType[] = [];
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async createSessionOrder(data: CreateSessionOrderDto): Promise<Order> {
    try {
      logger.info('Session order oluşturma isteği gönderiliyor', { data }, { prefix: 'OrderService' });
      const url = `${this.baseUrl}/from-session`;
      const response = await httpClient.post<Order>(url, data);
      logger.info('Session order başarıyla oluşturuldu', { 
        orderId: response.data 
      }, { prefix: 'OrderService' });
      return response.data;
    } catch (error: any) {
      logger.error('Session order oluşturma hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Session order oluşturulurken hata oluştu');
    }
  }

  async getPendingOrders(): Promise<PendingOrder[]> {
    try {
      logger.info('Pending orders getirme isteği gönderiliyor', {}, { prefix: 'OrderService' });
      const url = `${this.baseUrl}/pending`;
      const response = await httpClient.get<PendingOrder[]>(url);
      const orders = Array.isArray(response.data) ? response.data : [];
      logger.info('Pending orders başarıyla alındı', { 
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      console.log('Pending Orders:', orders);
      return orders;
    } catch (error: any) {
      logger.error('Pending orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Pending orders getirilirken hata oluştu');
    }
  }

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

  async getBranchOrders(): Promise<BranchOrder[]> {
    try {
      logger.info('Branch orders getirme isteği gönderiliyor', {}, { prefix: 'OrderServicke' });
      const url = `${this.baseUrl}/branch?includeItems=true`;
      const response = await httpClient.get<BranchOrder[]>(url);
      const orders = Array.isArray(response.data) ? response.data : [];
      logger.info('Branch orders başarıyla alındı', { 
        ordersCount: orders.length 
      }, { prefix: 'OrderService' });
      console.log('Branch Orders:', orders);
      return orders;
    } catch (error: any) {
      logger.error('Branch orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Branch orders getirilirken hata oluştu');
    }
  }

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

  private async refreshOrderTypesCache(): Promise<void> {
    try {
      this.orderTypesCache = await orderTypeService.getOrderTypes();
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      logger.info('Order types cache güncellendi', { 
        orderTypesCount: this.orderTypesCache.length 
      }, { prefix: 'OrderService' });
    } catch (error) {
      logger.error('Order types cache güncelleme hatası', error, { prefix: 'OrderService' });
    }
  }

  private async getOrderTypesFromCache(): Promise<OrderType[]> {
    if (!this.orderTypesCache.length || Date.now() > this.cacheExpiry) {
      await this.refreshOrderTypesCache();
    }
    return this.orderTypesCache;
  }

  getOrderStatusText(status: OrderStatus | string, lang: string = 'en'): string {
    const langCode = lang.split('-')[0].toLowerCase();
    const translations = orderStatusTranslations[langCode] || orderStatusTranslations['en'];
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return translations[enumStatus] || translations[OrderStatus.Pending];
    }
    return translations[status] || translations[OrderStatus.Pending];
  }

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

  canModifyOrder(status: OrderStatus | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatus.Pending || enumStatus === OrderStatus.Confirmed;
    }
    return status === OrderStatus.Pending || status === OrderStatus.Confirmed;
  }

  canCancelOrder(status: OrderStatus | string): boolean {
    if (typeof status === 'string') {
      const enumStatus = this.parseOrderStatus(status);
      return enumStatus === OrderStatus.Pending || enumStatus === OrderStatus.Confirmed || enumStatus === OrderStatus.Preparing;
    }
    return status === OrderStatus.Pending || status === OrderStatus.Confirmed || status === OrderStatus.Preparing;
  }

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

  async refreshOrderTypes(): Promise<void> {
    await this.refreshOrderTypesCache();
  }

  clearOrderTypesCache(): void {
    this.orderTypesCache = [];
    this.cacheExpiry = 0;
    logger.info('Order types cache temizlendi', {}, { prefix: 'OrderService' });
  }

  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
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
      const originalMessage = error?.response?.data?.message || '';
      if (originalMessage.toLowerCase().includes('unconfirmed price changes') || 
          originalMessage.toLowerCase().includes('price changes')) {
        throw error;
      }
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