import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';
import { getRestaurantIdFromToken } from '../utils/http';
import type { 
  BranchData, 
  CreateBranchWithDetailsDto, 
  CreateBranchResponse, 
  BranchDetailResponse,
  Branch,
  BranchDropdownItem,
  TableData,
  TableCategory
} from '../types/api';

// Table management için yeni tipler
interface CreateMenuTableDto {
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface BatchCreateMenuTableItemDto {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface CreateBatchMenuTableDto {
  items: BatchCreateMenuTableItemDto[];
}

class BranchService {
  private baseUrl = '/api/Branches';

  async createOnboardingBranch(data: CreateBranchWithDetailsDto): Promise<CreateBranchResponse> {
    try {
      logger.info('Branch oluşturma isteği gönderiliyor', data, { prefix: 'BranchService' });
      
      // Veri validation kontrolü
      if (!data.branchName?.trim()) {
        throw new Error('Şube adı gereklidir');
      }
      
      if (!data.restaurantId) {
        throw new Error('Restaurant ID gereklidir');
      }
      
      if (!data.createBranchWorkingHourCoreDto || data.createBranchWorkingHourCoreDto.length === 0) {
        throw new Error('En az bir gün için çalışma saati belirtmelisiniz');
      }
      
      // Çalışma saatlerini kontrol et
      const workingDays = data.createBranchWorkingHourCoreDto.filter(day => day.isWorkingDay);
      if (workingDays.length === 0) {
        throw new Error('En az bir gün için çalışma saati belirtmelisiniz');
      }
      
      const response = await httpClient.post<CreateBranchResponse>(`${this.baseUrl}/onboarding`, data);
      logger.info('Branch API Response alındı', response.data, { prefix: 'BranchService' });
      return response.data;
    } catch (error: any) {
      logger.error('Branch oluşturma hatası', error, { prefix: 'BranchService' });
      
      // API validation hatalarını daha detaylı logla
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchService' });
      }
      
      throw error;
    }
  }

  async createBranch(data: CreateBranchWithDetailsDto): Promise<CreateBranchResponse> {
    try {
      logger.info('Branch oluşturma isteği gönderiliyor', data, { prefix: 'BranchService' });
      const response = await httpClient.post<CreateBranchResponse>(`${this.baseUrl}`, data);
      logger.info('Branch API Response alındı', response.data, { prefix: 'BranchService' });
      return response.data;
    } catch (error: any) {
      logger.error('Branch oluşturma hatası', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async updateBranch(id: number, data: Partial<CreateBranchWithDetailsDto>): Promise<BranchData> {
    try {
      logger.info('Branch güncelleme isteği gönderiliyor', { id, data }, { prefix: 'BranchService' });
      const response = await httpClient.put<any>(`${this.baseUrl}/${id}`, data);
      logger.info('Branch Update API Response alındı', response.data, { prefix: 'BranchService' });
      return response.data.data!;
    } catch (error: any) {
      logger.error('Branch güncelleme hatası', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async deleteBranch(id: number): Promise<void> {
    try {
      logger.info('Branch silme isteği gönderiliyor', { id }, { prefix: 'BranchService' });
      await httpClient.delete(`${this.baseUrl}/${id}`);
      logger.info('Branch başarıyla silindi', { id }, { prefix: 'BranchService' });
    } catch (error: any) {
      logger.error('Branch silme hatası', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async getBranchesByRestaurantId(restaurantId: number): Promise<Branch[]> {
    const response = await httpClient.get<any>(`${this.baseUrl}/restaurant/${restaurantId}`); // ApiResponse<Branch[]> yerine any kullanıldı
    return response.data.data || [];
  }

  async getBranchById(id: number): Promise<BranchDetailResponse | null> {
    try {
      logger.info('Branch detayları API çağrısı başlatılıyor', { id }, { prefix: 'BranchService' });
      
      const response = await httpClient.get<any>(`${this.baseUrl}/${id}`); // ApiResponse<BranchDetailResponse> yerine any kullanıldı
      
      logger.info('Branch API Response alındı', response.data, { prefix: 'BranchService' });

      // API response formatını kontrol et
      if (response.data && response.data.data) {
        return response.data.data;
      }

      // Alternatif format kontrolü (direkt data)
      if (response.data && !response.data.data && typeof response.data === 'object') {
        // ApiResponse wrapper olmadan direkt branch data gelmiş olabilir
        const directData = response.data as any;
        if (directData.branchId && directData.branchName) {
                  logger.info('API yanıtı direkt branch formatında', null, { prefix: 'BranchService' });
          return directData as BranchDetailResponse;
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Branch detayları çekilirken hata', error, { prefix: 'BranchService' });
      
      if ((error as any).status === 404) {
        logger.warn('Branch bulunamadı (404)', null, { prefix: 'BranchService' });
        return null;
      }
      throw error;
    }
  }

  async getBranches(): Promise<BranchData[]> {
    try {
      logger.info('Branch listesi API çağrısı başlatılıyor...', null, { prefix: 'BranchService' });
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        logger.error('Token bulunamadı', null, { prefix: 'BranchService' });
        throw new Error('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }

      // Restaurant ID kontrolü
      const restaurantId = getRestaurantIdFromToken();
      if (!restaurantId) {
        logger.error('Restaurant ID bulunamadı', null, { prefix: 'BranchService' });
        throw new Error('Restaurant bilgisi bulunamadı.');
      }

      logger.info(`Restaurant ID: ${restaurantId} ile şube listesi isteniyor`, null, { prefix: 'BranchService' });
      
      // İlk endpoint'i dene
      let url = `/api/Restaurants/branches?include=BranchIsOpen`;
      let response;
      
      try {
        response = await httpClient.get<any[]>(url);
        logger.info('İlk endpoint başarılı', response, { prefix: 'BranchService' });
      } catch (firstError: any) {
        logger.warn('İlk endpoint başarısız, alternatif deneniyor', firstError, { prefix: 'BranchService' });
        
        // Alternatif endpoint'i dene
        url = `/api/Branches?restaurantId=${restaurantId}&include=BranchIsOpen`;
        response = await httpClient.get<any[]>(url);
        logger.info('Alternatif endpoint başarılı', response, { prefix: 'BranchService' });
      }

      logger.info('Branch listesi API Response alındı', response, { prefix: 'BranchService' });

      // Response formatını kontrol et
      if (!response.data) {
        logger.warn('API response.data boş', null, { prefix: 'BranchService' });
        return [];
      }

      // Eğer response.data bir array değilse
      if (!Array.isArray(response.data)) {
        logger.warn('API response.data array değil, formatı:', response.data, { prefix: 'BranchService' });
        return [];
      }

      // API her bir öğede { branch: { ... } } yapısı döndürüyor
      const mapped = response.data.map((item: any, index: number): BranchData => {
        logger.debug(`İşlenen item ${index}`, item, { prefix: 'BranchService' });
        
        const b = item.branch || item; // Güvenlik için fallback

        logger.debug(`Branch data ${index}`, b, { prefix: 'BranchService' });

        return {
          // Hem id hem branchId alanlarını dolduruyoruz
          id: b.branchId,
          branchId: b.branchId,
          branchName: b.branchName,
          whatsappOrderNumber: b.whatsappOrderNumber ?? null,
          email: b.email ?? null,
          branchStatus: b.branchStatus ?? true,
          restaurantId: b.restaurantId ?? 0,
          branchLogoPath: b.branchLogoPath ?? null,
          isOpenNow: b.isOpenNow ?? false,
          isTemporarilyClosed: b.isTemporarilyClosed ?? false,
          BranchIsOpen: b.BranchIsOpen,
          createAddressDto: {
            country: b.country ?? null,
            city: b.city ?? null,
            street: b.street ?? null,
            zipCode: b.zipCode ?? null,
            addressLine1: b.addressLine1 ?? null,
          },
          workingHours: b.workingHours ?? [],
        } as BranchData;
      });

      logger.info(`Branch listesi başarıyla işlendi, toplam: ${mapped.length}`, mapped, { prefix: 'BranchService' });

      return mapped;
    } catch (error: any) {
      logger.error('Branch listesi alınırken hata', error, { prefix: 'BranchService' });
      
      // Detaylı hata mesajı
      if (error?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.status === 404) {
        throw new Error('Şube listesi bulunamadı.');
      } else if (error?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Şube listesi alınırken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  async toggleTemporaryClose(branchId: number, isTemporarilyClosed: boolean, isOpenNow: boolean): Promise<void> {
    try {
      logger.info('Branch temporary close güncelleme isteği', { branchId, isTemporarilyClosed, isOpenNow }, { prefix: 'BranchService' });
      
      // Backend sadece boolean değer bekliyor olabilir
      await httpClient.patch(`${this.baseUrl}/${branchId}/temporary-close`, isTemporarilyClosed);
      
      logger.info('Branch temporary close durumu güncellendi', null, { prefix: 'BranchService' });
    } catch (error: any) {
      logger.error('Branch temporary close güncelleme hatası', error, { prefix: 'BranchService' });
      
      // Detaylı hata mesajı
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
        throw new Error('Şube bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Şube durumu güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  // Yeni metotlar - Table Management için
  async getBranchesDropdown(): Promise<BranchDropdownItem[]> {
    try {
      logger.info('Şube dropdown listesi API çağrısı başlatılıyor...', null, { prefix: 'BranchService' });
      
      const response = await httpClient.get<BranchDropdownItem[]>(`/api/Restaurants/branches/dropdown`);
      
      logger.info('Şube dropdown listesi alındı', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Şube dropdown listesi alınırken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async getTables(branchId: number, categoryId?: string, onlyActive: boolean = true, includeCategory: boolean = true): Promise<TableData[]> {
    try {
      logger.info('Masalar API çağrısı başlatılıyor', { branchId }, { prefix: 'BranchService' });
      
      const params = new URLSearchParams({
        branchId: branchId.toString(),
        onlyActive: onlyActive.toString(),
        includeCategory: includeCategory.toString()
      });
      
      if (categoryId) {
        params.append('categoryId', categoryId);
      }
      
      const response = await httpClient.get<TableData[]>(`/api/branches/tables?${params.toString()}`);
      
      logger.info('Masalar alındı', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masalar alınırken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async getTableCategories(branchId: number, onlyActive: boolean = true, includeTableCount: boolean = false): Promise<TableCategory[]> {
    try {
      logger.info('Masa kategorileri API çağrısı başlatılıyor', { branchId, onlyActive, includeTableCount }, { prefix: 'BranchService' });
      
      const params = new URLSearchParams({
        branchId: branchId.toString(),
        onlyActive: onlyActive.toString(),
        includeTableCount: includeTableCount.toString()
      });
      
      const response = await httpClient.get<TableCategory[]>(`/api/branches/table-categories?${params.toString()}`);
      
      logger.info('Masa kategorileri alındı', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masa kategorileri alınırken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async createTable(data: CreateMenuTableDto, branchId: number): Promise<any> {
    try {
      logger.info('Masa oluşturma API çağrısı başlatılıyor', { data, branchId }, { prefix: 'BranchService' });
      
      // BranchId'yi query parameter olarak gönder
      const response = await httpClient.post(`/api/branches/tables?branchId=${branchId}`, data);
      
      logger.info('Masa başarıyla oluşturuldu', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masa oluşturulurken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async createBatchTables(data: CreateBatchMenuTableDto, branchId: number): Promise<any> {
    try {
      logger.info('Toplu masa oluşturma API çağrısı başlatılıyor', { data, branchId }, { prefix: 'BranchService' });
      
      // Batch işlemler için özel timeout konfigürasyonu
      const batchConfig = {
        timeout: 120000, // 2 dakika timeout (batch işlemler için)
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'batch-operation'
        }
      };
      
      // BranchId'yi query parameter olarak gönder
      const response = await httpClient.post(`/api/branches/tables/batch?branchId=${branchId}`, data, batchConfig);
      
      logger.info('Toplu masa başarıyla oluşturuldu', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Toplu masa oluşturulurken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async toggleTableStatus(tableId: number, branchId: number, isOccupied: boolean): Promise<void> {
    try {
      await httpClient.patch(`/api/branches/tables/${tableId}/status?branchId=${branchId}`, {
        isOccupied
      });
      logger.info('Masa durumu başarıyla güncellendi', { tableId, branchId, isOccupied }, { prefix: 'BranchService' });
    } catch (error) {
      logger.error('Masa durumu güncellenirken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }
}

export const branchService = new BranchService(); 