import { BranchOrder, ConfirmOrderDto, CreateSessionOrderDto, Order, OrderItem, OrderTrackingInfo, PendingOrder, QRTrackingInfo, RejectOrderDto, SmartCreateOrderDto, TableBasketSummary, UpdateOrderStatusDto, OrderStatus } from '../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../types/Orders/type';
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
      this.handleError(error, 'Session order oluşturulurken hata oluştu');
    }
  }

  async getPendingOrders(): Promise<PendingOrder[]> {
    try {
      const url = `${this.baseUrl}/pending`;
      const response = await httpClient.get<PendingOrder[]>(url);
      const orders = Array.isArray(response.data) ? response.data : [];

      return orders;
    } catch (error: any) {
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
      
      const allOrders: BranchOrder[] = [];
      let currentPage = 1;
      const pageSize = 20;
      let totalPages = 1; // Will be updated from API response
      
      while (currentPage <= totalPages) {
        try {
          const response = await httpClient.get(`${this.baseUrl}/branch`, {
            params: {
              page: currentPage,
              pageSize: pageSize,
              includeItems: true
            }
          });
          
          // Extract pagination info from response - Fixed for direct structure
          const responseData = response.data;
          let pageOrders: BranchOrder[] = [];
          
          
          // Check for direct structure with items array
          if (responseData && typeof responseData === 'object' && 'items' in responseData) {
            // Direct structure: response.data.items
            pageOrders = Array.isArray(responseData.items) ? responseData.items : [];
            totalPages = responseData.totalPages || 1;
     
          } 
          // Check if response has nested structure with data.items (old format)
          else if (responseData && typeof responseData === 'object' && 'data' in responseData) {
            const nestedData = responseData.data;
            if (nestedData && 'items' in nestedData) {
              pageOrders = Array.isArray(nestedData.items) ? nestedData.items : [];
              totalPages = nestedData.totalPages || 1;
            }
          } 
          // Fallback: direct array response
          else if (Array.isArray(responseData)) {
            pageOrders = responseData;
            console.log("Direct array response detected");
          } else {
            console.log("Unknown response structure");
            pageOrders = [];
          }
          
          console.log("Branch orders sayfa alındı", currentPage, pageOrders.length, allOrders.length + pageOrders.length, "of", totalPages, "pages");
          
          logger.info('Branch orders sayfa alındı', { 
            page: currentPage,
            totalPages: totalPages,
            ordersCount: pageOrders.length,
            totalSoFar: allOrders.length + pageOrders.length
          }, { prefix: 'OrderService' });
          
          // Add orders from this page to the total
          allOrders.push(...pageOrders);
          
          console.log("allOrders length after push:", allOrders.length);
          
          // Move to next page
          currentPage++;
          
          // Add a small delay between requests to be API-friendly
          if (currentPage <= totalPages) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (pageError: any) {
       
          // If it's a 404 or similar, we might have reached the end
          if (pageError?.response?.status === 404) {
            break; // Exit the loop
          } else {
            // For other errors, break the loop to avoid infinite retries
            throw pageError;
          }
        }
      }
      return allOrders;
      
    } catch (error: any) {
      console.log("Main catch error:", error);
      logger.error('Branch orders getirme hatası', error, { prefix: 'OrderService' });
      this.handleError(error, 'Branch orders getirilirken hata oluştu');
      return [];
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