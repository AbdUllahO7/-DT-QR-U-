import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';
import { sanitizePlaceholder } from '../utils/sanitize';
import type {
  CreateRestaurantDto,
  CreateRestaurantResponse,
  ApiResponse,
  RestaurantManagementInfo,
  UpdateRestaurantManagementRequest,
  CreateAboutDto,
  AboutInfo,
  CreateAboutResponse
} from '../types/api';
import { RestaurantBranchDropdownItem } from '../types/BranchManagement/type';

// Interface for restaurant response from GET /api/Restaurants
interface RestaurantInfo {
  restaurantId: number;
  restaurantName: string;
  cuisineType: string;
  branchCount: number;
  activeBranchCount: number;
  hasAlcoholService: boolean;
  restaurantStatus: boolean;
  restaurantLogoPath: string;
}

// Existing interfaces
interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoPath?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DeletedRestaurant {
  id: string;
  name: string;
  description?: string;
  deletedAt: string;
  userId: string;
}

class RestaurantService {
  private baseUrl = '/api/Restaurants';
     // Helper method to get language from localStorage
  private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }
  // NEW: Get all restaurants
  async getRestaurants(): Promise<RestaurantInfo[]> {
    try {
      logger.info('Tüm restoranlar getiriliyor...');
      const language = this.getLanguageFromStorage();
      const response = await httpClient.get<RestaurantInfo[]>(this.baseUrl, {
        params: {
          'language': language
        }
      });
      logger.info('Restoranlar alındı:', response.data);

      // Sanitize restaurantName and restaurantLogoPath for each restaurant
      const sanitizedData = response.data.map(restaurant => ({
        ...restaurant,
        restaurantName: sanitizePlaceholder(restaurant.restaurantName),
        restaurantLogoPath: sanitizePlaceholder(restaurant.restaurantLogoPath)
      }));

      return sanitizedData;
    } catch (error: any) {
      logger.error('Restoranlar alınırken hata oluştu:', error);
      throw error;
    }
  }

  async createRestaurant(data: CreateRestaurantDto): Promise<CreateRestaurantResponse> {
    try {
      logger.info('Restaurant oluşturma isteği gönderiliyor:', data);

      const { userId, ...restData } = data;

      const apiData = {
        ...restData,
        creatorUserId: userId
      };

      logger.info('API\'ye gönderilen düzenlenmiş veri:', apiData);

      const response = await httpClient.post<CreateRestaurantResponse>(`${this.baseUrl}`, apiData);
      logger.info('Restaurant API Response:', response.data);
      return response.data;
    } catch (error: any) {
      logger.error('Restaurant oluşturma hatası:', error);
      throw error;
    }
  }

  async getRestaurantByUserId(userId: string): Promise<Restaurant | null> {
    try {
      const language = this.getLanguageFromStorage();
      const response = await httpClient.get<ApiResponse<Restaurant>>(`/api/Restaurants/user/${userId}`, {
        params: {
          'language': language
        }
      });
      return response.data.data || null;
    } catch (error) {
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getRestaurantBranchesDropdown(): Promise<RestaurantBranchDropdownItem[]> {
    try {
      if (import.meta.env.DEV) {
        logger.info('🔍 Restaurant branches dropdown API çağrısı başlatılıyor...');
      }
      const language = this.getLanguageFromStorage();

      const response = await httpClient.get<any[]>(`${this.baseUrl}/branches/dropdown`, {
       params: {
          'language': language
        }
      });

      if (import.meta.env.DEV) {
        logger.info('📡 Restaurant branches dropdown API yanıtı:', response.data);
      }

      const items: RestaurantBranchDropdownItem[] = response.data.map(item => ({
        id: item.branchId,
        name: item.branchName,
        type: 'branch',
        isActive: item.branchStatus,
        branchTag: item.branchTag
      }));

      if (import.meta.env.DEV) {
        logger.info('✅ Restaurant branches dropdown dönüştürülmüş veri:', items);
      }

      return items;
    } catch (error) {
      logger.error('❌ Restaurant ve şube listesi alınırken hata oluştu:', error);
      throw error;
    }
  }

  async getRestaurantManagementInfo(): Promise<RestaurantManagementInfo | null> {
    try {
      logger.info('Restaurant yönetim bilgileri alınıyor...');
      const { getRestaurantIdFromToken } = await import('../utils/http');
      const restaurantId = getRestaurantIdFromToken();
      const language = this.getLanguageFromStorage();

      const url = restaurantId
        ? `${this.baseUrl}/management-info?restaurantId=${restaurantId}`
        : `${this.baseUrl}/management-info`;

      const response = await httpClient.get<RestaurantManagementInfo>(url, {
        params: {
          language
        }
      });
      logger.info('Restaurant yönetim bilgileri alındı:', response.data);
      let fixedData = response.data;

      if (!fixedData.restaurantName || fixedData.restaurantName.toLowerCase() === 'string') {
        const storedName = localStorage.getItem('restaurantName');
        if (storedName && storedName.toLowerCase() !== 'string') {
          fixedData = { ...fixedData, restaurantName: storedName };
        } else {
          const token = localStorage.getItem('token');
          if (token) {
            const { decodeToken } = await import('../utils/http');
            const decoded = decodeToken(token);
            const tokenName = decoded?.restaurant_name;
            if (tokenName && tokenName.toLowerCase() !== 'string') {
              fixedData = { ...fixedData, restaurantName: tokenName };
            }
          }
        }
      }

      if (fixedData.restaurantLogoPath && sanitizePlaceholder(fixedData.restaurantLogoPath) === '') {
        const storedLogo = localStorage.getItem('restaurantLogoPath');
        if (storedLogo && storedLogo.toLowerCase() !== 'string') {
          fixedData = { ...fixedData, restaurantLogoPath: storedLogo };
        } else {
          fixedData = { ...fixedData, restaurantLogoPath: '' };
        }
      }

      fixedData = { ...fixedData, restaurantName: sanitizePlaceholder(fixedData.restaurantName) };

      return fixedData;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        logger.warn('Restaurant yönetim bilgileri endpoint 404 döndü. Varsayılan boş değer kullanılacak.');
        return null;
      }
      logger.error('Restaurant yönetim bilgileri alınırken hata oluştu:', error);
      throw error;
    }
  }

  async updateRestaurantManagementInfo(data: Partial<RestaurantManagementInfo>): Promise<RestaurantManagementInfo> {
    try {
      logger.info('Restaurant yönetim bilgileri güncelleniyor...', data);

      const updateRequest: UpdateRestaurantManagementRequest = {
        updateRestaurantDto: {
          restaurantId: data.restaurantId || 0,
          restaurantName: data.restaurantName || null,
          restaurantLogoPath: data.restaurantLogoPath || null,
          cuisineType: data.cuisineTypeId || undefined,
          hasAlcoholService: data.hasAlcoholService || null,
          companyTitle: data.companyTitle || null,
          taxNumber: data.taxNumber || null,
          taxOffice: data.taxOffice || null,
          mersisNumber: data.mersisNumber || null,
          tradeRegistryNumber: data.tradeRegistryNumber || null,
          legalType: data.legalType || null,
          workPermitFilePath: data.workPermitFilePath || null,
          foodCertificateFilePath: data.foodCertificateFilePath || null,
          restaurantStatus: data.restaurantStatus || null,
          restaurantDateModified: new Date().toISOString()
        },
        updateAboutDto: {
          about: data.about || null
        }
      };

      logger.info('API\'ye gönderilen format:', updateRequest);

      const response = await httpClient.put<RestaurantManagementInfo>(`${this.baseUrl}/management-info`, updateRequest);

      logger.info('Restaurant yönetim bilgileri güncellendi:', response.data);
      return response.data;
    } catch (error: any) {
      logger.error('Restaurant yönetim bilgileri güncellenirken hata oluştu:', error);
      throw error;
    }
  }

  async updateRestaurant(id: string, data: Partial<CreateRestaurantDto>): Promise<Restaurant> {
    const response = await httpClient.put<ApiResponse<Restaurant>>(`/api/Restaurants/${id}`, data);
    return response.data.data!;
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      logger.info('Restaurant silme isteği gönderiliyor:', id);
      await httpClient.delete(`/api/Restaurants/${id}`);
      logger.info('Restaurant başarıyla silindi:', id);
    } catch (error: any) {
      logger.error('Restaurant silinirken hata oluştu:', error);
      throw error;
    }
  }

  async getDeletedRestaurants(): Promise<DeletedRestaurant[]> {
    try {
            const language = this.getLanguageFromStorage();
      logger.info('Silinmiş restaurantlar getiriliyor...');
      const response = await httpClient.get<DeletedRestaurant[]>(`${this.baseUrl}/deleted`, {
        params: {
          language
        }
      });
      logger.info('Silinmiş restaurantlar alındı:', response.data);
      return response.data;
    } catch (error: any) {
      logger.error('Silinmiş restaurantlar alınırken hata oluştu:', error);
      throw error;
    }
  }

  async restoreRestaurant(id: string): Promise<void> {
    try {
      logger.info('Restaurant restore isteği gönderiliyor:', id);
      await httpClient.post(`${this.baseUrl}/${id}/restore`);
      logger.info('Restaurant başarıyla restore edildi:', id);
    } catch (error: any) {
      logger.error('Restaurant restore edilirken hata oluştu:', error);
      throw error;
    }
  }

  async createAbout(data: CreateAboutDto): Promise<CreateAboutResponse> {
    try {
      logger.info('About oluşturma isteği gönderiliyor:', data);

      const response = await httpClient.post<CreateAboutResponse>('/api/About', data);

      logger.info('About oluşturma yanıtı:', response.data);
      return response.data;
    } catch (error) {
      logger.error('About oluşturma hatası:', error);
      throw error;
    }
  }

  async getAbout(restaurantId: number): Promise<AboutInfo | null> {
    try {
      logger.info('About bilgileri alınıyor...', restaurantId);
      const language = this.getLanguageFromStorage();

      const response = await httpClient.get<AboutInfo>(`/api/About?restaurantId=${restaurantId}&language=${language}`);

      logger.info('About bilgileri alındı:', response.data);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        logger.info('About bilgisi bulunamadı (404)');
        return null;
      }
      logger.error('About bilgileri alınırken hata:', error);
      throw error;
    }
  }

  async updateAbout(data: CreateAboutDto): Promise<AboutInfo> {
    try {
      logger.info('About güncelleme isteği gönderiliyor:', data);

      const response = await httpClient.put<AboutInfo>('/api/About', data);

      logger.info('About güncelleme yanıtı:', response.data);
      return response.data;
    } catch (error) {
      logger.error('About güncelleme hatası:', error);
      throw error;
    }
  }
}

export const restaurantService = new RestaurantService();
export const restaurantServiceInstance = restaurantService;