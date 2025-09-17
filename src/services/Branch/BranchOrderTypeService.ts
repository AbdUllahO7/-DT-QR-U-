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
  // Additional fields from the new API response
  branchId?: number;
  createdAt?: string;
  updatedAt?: string | null;
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

  async getOrderTypesBySessionId(): Promise<OrderType[]> {
    try {
      logger.info('Session OrderType listesi getirme isteği gönderiliyor', { prefix: 'OrderTypeService' });
      
      const response = await httpClient.get<OrderType[]>(`${this.baseUrl}/GetOrderTypesBySessionId`);
      
      logger.info('Session OrderType API Raw Response:', response, { prefix: 'OrderTypeService' });
      logger.info('Session OrderType API Response Data:', response.data, { prefix: 'OrderTypeService' });
      
      let orderTypes: OrderType[] = [];
      
      // Handle response - expecting direct array based on your example
      if (Array.isArray(response.data)) {
        orderTypes = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Handle wrapped response if needed
        const apiData = (response.data as any).data;
        if (Array.isArray(apiData)) {
          orderTypes = apiData;
        } else if (apiData) {
          orderTypes = [apiData];
        }
      } else if (response.data) {
        // Single object response
        orderTypes = [response.data as OrderType];
      }
      
      logger.info('Session OrderType listesi başarıyla alındı', { 
        orderTypeCount: orderTypes.length,
        orderTypes: orderTypes.map(ot => ({ 
          id: ot.id, 
          name: ot.name, 
          code: ot.code, 
          isActive: ot.isActive,
          branchId: ot.branchId,
          requiresTable: ot.requiresTable,
          requiresAddress: ot.requiresAddress,
          requiresPhone: ot.requiresPhone,
          serviceCharge: ot.serviceCharge,
          estimatedMinutes: ot.estimatedMinutes
        }))
      }, { prefix: 'OrderTypeService' });
      
      return orderTypes;
    } catch (error: any) {
      logger.error('Session OrderType listesi getirme hatası', error, { prefix: 'OrderTypeService' });
      logger.error('Error response:', error?.response, { prefix: 'OrderTypeService' });
      logger.error('Error response data:', error?.response?.data, { prefix: 'OrderTypeService' });
      
      this.handleError(error, 'Session OrderType listesi getirilirken hata oluştu');
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
    
    const response = await httpClient.put<any>(`${this.baseUrl}/${id}/settings`, data);
    
    logger.info('OrderType ayarları API Raw Response:', response, { prefix: 'OrderTypeService' });
    logger.info('OrderType ayarları API Response Data:', response.data, { prefix: 'OrderTypeService' });
    
    console.log('=== DEBUG: Response Data Structure ===');
    console.log('Type of response.data:', typeof response.data);
    console.log('Is Array:', Array.isArray(response.data));
    console.log('Response.data:', response.data);
    console.log('Response status:', response.status);
    console.log('Response.data keys:', response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'No keys');
    console.log('=====================================');
    
    let orderType: OrderType | null = null;
    
    // Handle 204 No Content or empty string response (successful update with no data returned)
    if ((response.status === 204 || response.status === 200) && 
        (response.data === '' || response.data === null || response.data === undefined)) {
      console.log('Detected successful response with no data (204 No Content) - creating response from input data');
      
      // Since the server confirmed the update was successful but didn't return data,
      // we'll create a response using the input data and generate a new rowVersion
      orderType = {
        id: data.id,
        isActive: data.isActive,
        minOrderAmount: data.minOrderAmount,
        serviceCharge: data.serviceCharge,
        rowVersion: this.generateNewRowVersion(data.rowVersion), // Generate a new rowVersion
        updatedAt: new Date().toISOString(),
        // These fields won't be updated by this endpoint, so we'll mark them as undefined
        // The component will handle this by refetching if needed
        name: undefined as any,
        code: undefined as any,
        description: undefined as any,
        icon: undefined as any,
      } as OrderType;
      
      logger.info('Created mock OrderType from successful empty response', orderType, { prefix: 'OrderTypeService' });
      return orderType;
    }
    
    // Handle other response structures
    if (response.data) {
      // Check if it's a direct OrderType object
      if (typeof response.data === 'object' && !Array.isArray(response.data) && 'id' in response.data && 'rowVersion' in response.data) {
        console.log('Detected direct OrderType object');
        orderType = response.data as OrderType;
      }
      // Check if it's wrapped in { data: OrderType }
      else if ('data' in response.data && response.data.data) {
        console.log('Detected wrapped { data: OrderType } structure');
        const apiData = response.data.data;
        if (typeof apiData === 'object' && !Array.isArray(apiData) && 'id' in apiData && 'rowVersion' in apiData) {
          orderType = apiData as OrderType;
        }
      }
      // Check for different success response structures
      else if ('isSuccess' in response.data) {
        console.log('Detected isSuccess response structure');
        if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          orderType = response.data.data as OrderType;
        }
      }
    }
    
    if (!orderType) {
      logger.error('Invalid API response structure:', {
        responseData: response.data,
        responseStatus: response.status,
        responseType: typeof response.data,
        isArray: Array.isArray(response.data)
      }, { prefix: 'OrderTypeService' });
      throw new Error('Sunucudan geçersiz yanıt alındı - lütfen yanıt yapısını kontrol edin');
    }
    
    logger.info('OrderType ayarları başarıyla güncellendi', orderType, { prefix: 'OrderTypeService' });
    return orderType;
  } catch (error: any) {
    logger.error('OrderType ayarları güncelleme hatası', error, { prefix: 'OrderTypeService' });
    logger.error('Error response:', error?.response, { prefix: 'OrderTypeService' });
    logger.error('Error response data:', error?.response?.data, { prefix: 'OrderTypeService' });
    
    if (error.response?.data?.errors) {
      logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'OrderTypeService' });
    }
    
    this.handleError(error, 'OrderType ayarları güncellenirken hata oluştu');
  }
}

// Helper method to generate a new rowVersion (simple increment)
private generateNewRowVersion(currentRowVersion: string): string {
  try {
    // If rowVersion is a timestamp or number, increment it
    const timestamp = Date.now().toString();
    return timestamp;
  } catch {
    // Fallback to current timestamp
    return Date.now().toString();
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