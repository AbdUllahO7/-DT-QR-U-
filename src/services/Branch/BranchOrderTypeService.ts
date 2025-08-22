import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// Core OrderType interface
export interface OrderType {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
  isActive: boolean;
  isStandard: boolean;
  displayOrder: number;
  requiresTable: boolean;
  requiresAddress: boolean;
  requiresPhone: boolean;
  minOrderAmount: number;
  serviceCharge: number;
  estimatedMinutes: number;
  activeOrderCount: number;
  rowVersion: string;
}

// Update OrderType DTO
export interface UpdateOrderTypeDto {
  id:number;
  name: string;
  code: string;
  description: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  requiresTable: boolean;
  requiresAddress: boolean;
  requiresPhone: boolean;
  minOrderAmount: number;
  serviceCharge: number;
  estimatedMinutes: number;
  rowVersion: string;
}

// Update OrderType Settings DTO
export interface UpdateOrderTypeSettingsDto {
  isActive: boolean;
  minOrderAmount: number;
  serviceCharge: number;
  rowVersion: string;
  id:number,
}

// Reorder DTO
export interface ReorderOrderTypeDto {
  id: number;
  displayOrder: number;
}

// API response interface for GET /api/OrderTypes
interface GetOrderTypesResponse {
  data?: OrderType | OrderType[];
  isSuccess?: boolean;
  message?: string | null;
}

class OrderTypeService {
  private baseUrl = '/api/OrderTypes';

  async getOrderTypes(): Promise<OrderType[]> {
    try {
      logger.info('OrderType listesi getirme isteği gönderiliyor', null, { prefix: 'OrderTypeService' });
      
      const response = await httpClient.get<OrderType[] | GetOrderTypesResponse>(this.baseUrl);
      
      logger.info('OrderType API Raw Response:', response, { prefix: 'OrderTypeService' });
      logger.info('OrderType API Response Data:', response.data, { prefix: 'OrderTypeService' });
      
      let orderTypes: OrderType[] = [];
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        // Direct array response from database
        orderTypes = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Wrapped response structure
        const apiData = response.data.data;
        if (Array.isArray(apiData)) {
          orderTypes = apiData;
        } else if (apiData) {
          orderTypes = [apiData];
        }
      } else if (response.data) {
        // Single object response
        orderTypes = [response.data as OrderType];
      }
      
      logger.info('OrderType listesi başarıyla alındı', { 
        orderTypeCount: orderTypes.length,
        orderTypes: orderTypes.map(ot => ({ 
          id: ot.id, 
          name: ot.name, 
          code: ot.code, 
          isActive: ot.isActive,
          isStandard: ot.isStandard,
          activeOrderCount: ot.activeOrderCount 
        }))
      }, { prefix: 'OrderTypeService' });
      
      return orderTypes;
    } catch (error: any) {
      logger.error('OrderType listesi getirme hatası', error, { prefix: 'OrderTypeService' });
      logger.error('Error response:', error?.response, { prefix: 'OrderTypeService' });
      logger.error('Error response data:', error?.response?.data, { prefix: 'OrderTypeService' });
      
      this.handleError(error, 'OrderType listesi getirilirken hata oluştu');
    }
  }

  async getOrderTypeById(id: number): Promise<OrderType> {
    try {
      logger.info('OrderType detay getirme isteği gönderiliyor', { id }, { prefix: 'OrderTypeService' });
      
      const response = await httpClient.get<{ data: OrderType }>(`${this.baseUrl}/${id}`);
      
      logger.info('OrderType detayı başarıyla alındı', response.data, { prefix: 'OrderTypeService' });
      return response.data.data;
    } catch (error: any) {
      logger.error('OrderType detay getirme hatası', error, { prefix: 'OrderTypeService' });
      this.handleError(error, 'OrderType detayı getirilirken hata oluştu');
    }
  }

  async updateOrderType(id: number, data: UpdateOrderTypeDto): Promise<OrderType> {
    try {
      logger.info('OrderType güncelleme isteği gönderiliyor', { id, data }, { prefix: 'OrderTypeService' });
      
      // Trim string values
      const updateData: UpdateOrderTypeDto = {
        id:data.id,
        name: data.name?.trim() || '',
        code: data.code?.trim() || '',
        description: data.description?.trim() || '',
        icon: data.icon?.trim() || '',
        isActive: data.isActive,
        displayOrder: data.displayOrder || 0,
        requiresTable: data.requiresTable,
        requiresAddress: data.requiresAddress,
        requiresPhone: data.requiresPhone,
        minOrderAmount: data.minOrderAmount || 0,
        serviceCharge: data.serviceCharge || 0,
        estimatedMinutes: data.estimatedMinutes || 0,
        rowVersion: data.rowVersion,
      };

      const response = await httpClient.put<{ data: OrderType }>(`${this.baseUrl}/${id}`, updateData);
      
      logger.info('OrderType başarıyla güncellendi', response.data, { prefix: 'OrderTypeService' });
      return response.data.data;
    } catch (error: any) {
      logger.error('OrderType güncelleme hatası', error, { prefix: 'OrderTypeService' });
      
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'OrderTypeService' });
      }
      
      this.handleError(error, 'OrderType güncellenirken hata oluştu');
    }
  }

  async deleteOrderType(id: number): Promise<void> {
    try {
      logger.info('OrderType silme isteği gönderiliyor', { id }, { prefix: 'OrderTypeService' });
      
      await httpClient.delete(`${this.baseUrl}/${id}`);
      
      logger.info('OrderType başarıyla silindi', { id }, { prefix: 'OrderTypeService' });
    } catch (error: any) {
      logger.error('OrderType silme hatası', error, { prefix: 'OrderTypeService' });
      this.handleError(error, 'OrderType silinirken hata oluştu');
    }
  }

  async updateOrderTypeSettings(id: number, data: UpdateOrderTypeSettingsDto): Promise<OrderType> {
    try {
      logger.info('OrderType ayarları güncelleme isteği gönderiliyor', { id, data }, { prefix: 'OrderTypeService' });
      
      const response = await httpClient.put<{ data: OrderType }>(`${this.baseUrl}/${id}/settings`, data);
      
      logger.info('OrderType ayarları başarıyla güncellendi', response.data, { prefix: 'OrderTypeService' });
      return response.data.data;
    } catch (error: any) {
      logger.error('OrderType ayarları güncelleme hatası', error, { prefix: 'OrderTypeService' });
      
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'OrderTypeService' });
      }
      
      this.handleError(error, 'OrderType ayarları güncellenirken hata oluştu');
    }
  }

  async getActiveOrderTypesByBranch(branchId: number): Promise<OrderType[]> {
    try {
      logger.info('Branch aktif OrderType listesi getirme isteği gönderiliyor', { branchId }, { prefix: 'OrderTypeService' });
      
      const response = await httpClient.get<OrderType[] | GetOrderTypesResponse>(`${this.baseUrl}/branch/${branchId}/active`);
      
      let orderTypes: OrderType[] = [];
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        // Direct array response from database
        orderTypes = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Wrapped response structure
        const apiData = response.data.data;
        if (Array.isArray(apiData)) {
          orderTypes = apiData;
        } else if (apiData) {
          orderTypes = [apiData];
        }
      } else if (response.data) {
        // Single object response
        orderTypes = [response.data as OrderType];
      }
      
      logger.info('Branch aktif OrderType listesi başarıyla alındı', { 
        branchId,
        orderTypeCount: orderTypes.length,
        activeOrderTypes: orderTypes.map(ot => ({ 
          id: ot.id, 
          name: ot.name, 
          code: ot.code, 
          isActive: ot.isActive,
          isStandard: ot.isStandard,
          activeOrderCount: ot.activeOrderCount 
        }))
      }, { prefix: 'OrderTypeService' });
      
      return orderTypes;
    } catch (error: any) {
      logger.error('Branch aktif OrderType listesi getirme hatası', error, { prefix: 'OrderTypeService' });
      this.handleError(error, 'Branch aktif OrderType listesi getirilirken hata oluştu');
    }
  }

  async reorderOrderTypes(reorderData: ReorderOrderTypeDto[]): Promise<void> {
    try {
      logger.info('OrderType sıralama güncelleme isteği gönderiliyor', reorderData, { prefix: 'OrderTypeService' });
      
      await httpClient.put(`${this.baseUrl}/reorder`, reorderData);
      
      logger.info('OrderType sıralaması başarıyla güncellendi', null, { prefix: 'OrderTypeService' });
    } catch (error: any) {
      logger.error('OrderType sıralama güncelleme hatası', error, { prefix: 'OrderTypeService' });
      
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'OrderTypeService' });
      }
      
      this.handleError(error, 'OrderType sıralaması güncellenirken hata oluştu');
    }
  }

  // Helper method for consistent error handling
  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 401) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    } else if (error?.response?.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    } else if (error?.response?.status === 404) {
      throw new Error('İstenen kayıt bulunamadı.');
    } else if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        // Validation error'ları göster
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else {
        throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
      }
    } else if (error?.response?.status === 409) {
      throw new Error('Bu kayıt zaten mevcut veya çakışma var.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }
}

export const orderTypeService = new OrderTypeService();