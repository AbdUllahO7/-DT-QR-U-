import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';
import { getRestaurantIdFromToken } from '../utils/http';
import type { 
  CreateBranchWithDetailsDto, 
  CreateBranchResponse, 
  BranchDetailResponse,
  Branch,
  BatchUpdateBranchDto
} from '../types/api';
import { BranchData, BranchDropdownItem, TableCategory, TableData } from '../types/BranchManagement/type';

// Table management için yeni tipler
interface CreateMenuTableDto {
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface DeletedBranch {
  id: number;
  displayName: string;
  description: string | null;
  code: string | null;
  entityType: 'Branch';
  deletedAt: string;
  deletedBy: string;
  branchId: number | null;
  branchName: string | null;
  restaurantId: number;
  restaurantName: string | null;
  categoryId: number | null;
  categoryName: string | null;
}
export interface UpdateMenuTableDto {
  id: number;
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  rowVersion: string;
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
      
      // Transform the data to match the API's expected format
      const batchUpdateData: BatchUpdateBranchDto = {
        branchName: data.branchName?.trim() || null,
        whatsappOrderNumber: data.whatsappOrderNumber?.trim() || null,
        branchLogoPath: data.branchLogoPath || null,
      };

      // Transform address data if provided
      if (data.createAddressDto) {
        batchUpdateData.batchUpdateAddressDto = {
          country: data.createAddressDto.country?.trim() || null,
          city: data.createAddressDto.city?.trim() || null,
          street: data.createAddressDto.street?.trim() || null,
          adressLine1: data.createAddressDto.addressLine1?.trim() || null, // Note the field name mapping
          adressLine2: data.createAddressDto.addressLine2?.trim() || null, // Note the field name mapping
          zipCode: data.createAddressDto.zipCode?.trim() || null,
        };
      }

      // Transform contact data if provided
      if (data.createContactDto) {
        batchUpdateData.batchUpdateContactDto = {
          contactHeader: data.createContactDto.contactHeader?.trim() || null,
          location: data.createContactDto.location?.trim() || null,
          phone: data.createContactDto.phone?.trim() || null,
          mail: data.createContactDto.mail?.trim() || null,
          footerTitle: data.createContactDto.footerTitle?.trim() || null,
          footerDescription: data.createContactDto.footerDescription?.trim() || null,
          openTitle: data.createContactDto.openTitle?.trim() || null,
          openDays: data.createContactDto.openDays?.trim() || null,
          openHours: data.createContactDto.openHours?.trim() || null,
        };
      }

      // Transform working hours data if provided
      if (data.createBranchWorkingHourCoreDto && data.createBranchWorkingHourCoreDto.length > 0) {
        batchUpdateData.batchUpdateBranchWorkingHourDto = data.createBranchWorkingHourCoreDto.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isWorkingDay: hour.isWorkingDay
        }));
      }

      logger.info('Transformed batch update data', batchUpdateData, { prefix: 'BranchService' });

      const response = await httpClient.put<any>(`${this.baseUrl}/${id}/batch-update`, batchUpdateData);
      logger.info('Branch Update API Response alındı', response.data, { prefix: 'BranchService' });
      return response.data.data!;
    } catch (error: any) {
      logger.error('Branch güncelleme hatası', error, { prefix: 'BranchService' });
      
      // Enhanced error handling
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchService' });
      }
      
      throw error;
    }
  }
  /**
   * Get all deleted branches
   */
  async getDeletedBranches(): Promise<DeletedBranch[]> {
    try {
      logger.info('Silinmiş şubeler getiriliyor', null, { prefix: 'BranchService' });
      
      const response = await httpClient.get<DeletedBranch[]>(`${this.baseUrl}/deleted`);
      
      logger.info('Silinmiş şubeler başarıyla getirildi', { 
        count: response.data?.length || 0 
      }, { prefix: 'BranchService' });
      
      return response.data || [];
    } catch (error: any) {
      logger.error('❌ Silinmiş şubeler getirilirken hata:', error, { prefix: 'BranchService' });
      
      // Enhanced error handling
      if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Silinmiş şubeler getirilirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  /**
   * Restore a deleted branch
   */
  async restoreBranch(branchId: number): Promise<void> {
    try {
      logger.info('Şube geri yükleniyor', { branchId }, { prefix: 'BranchService' });
      
      const response = await httpClient.post(`${this.baseUrl}/${branchId}/restore`);
      
      logger.info('Şube başarıyla geri yüklendi', { 
        branchId,
        response: response.status 
      }, { prefix: 'BranchService' });
    } catch (error: any) {
      logger.error('❌ Şube geri yüklenirken hata:', error, { prefix: 'BranchService' });
      
      // Enhanced error handling with specific error messages
      if (error?.response?.status === 404) {
        throw new Error('Geri yüklenecek şube bulunamadı.');
      } else if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.errors) {
          // Show validation errors
          const validationErrors = Object.values(errorData.errors).flat();
          throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
        } else {
          throw new Error('Geçersiz şube geri yükleme isteği.');
        }
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 409) {
        throw new Error('Bu şube zaten aktif durumda veya aynı isimde aktif bir şube mevcut.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Şube geri yüklenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
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
      
      // Include query parameters for address, contact, and workingHours
      const includes = ['address', 'contact', 'workingHours'].join('%2C');
      const url = `${this.baseUrl}?branchId=${id}&include=${includes}`;
      
      logger.info('API URL:', url, { prefix: 'BranchService' });
      
      const response = await httpClient.get<any>(url);
      
      logger.info('Branch API Response alındı', response.data, { prefix: 'BranchService' });

      // API response formatını kontrol et
      if (response.data && response.data.data) {
        const branchData = response.data.data;
        
        // Ensure branchId is set for compatibility
        if (branchData.id && !branchData.branchId) {
          branchData.branchId = branchData.id;
        }
        
        return branchData as BranchDetailResponse;
      }

      // Alternatif format kontrolü (direkt data)
      if (response.data && !response.data.data && typeof response.data === 'object') {
        const directData = response.data as any;
        if (directData.id && directData.branchName) {
          logger.info('API yanıtı direkt branch formatında', null, { prefix: 'BranchService' });
          
          // Ensure branchId is set for compatibility
          if (directData.id && !directData.branchId) {
            directData.branchId = directData.id;
          }
          
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
      
      // Include query parameters for richer data
      const includes = ['address', 'contact', 'workingHours'].join('%2C');
      
      // İlk endpoint'i dene
      let url = `/api/Restaurants/branches?include=BranchIsOpen%2C${includes}`;
      let response;
      
      try {
        response = await httpClient.get<any[]>(url);
        logger.info('İlk endpoint başarılı', response, { prefix: 'BranchService' });
      } catch (firstError: any) {
        logger.warn('İlk endpoint başarısız, alternatif deneniyor', firstError, { prefix: 'BranchService' });
        
        // Alternatif endpoint'i dene
        url = `/api/Branches?restaurantId=${restaurantId}&include=BranchIsOpen%2C${includes}`;
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
          id: b.branchId || b.id,
          branchId: b.branchId || b.id,
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
            country: b.address?.country ?? null,
            city: b.address?.city ?? null,
            street: b.address?.street ?? null,
            zipCode: b.address?.zipCode ?? null,
            addressLine1: b.address?.addressLine1 ?? null,
          },
          workingHours: b.workingHours ?? [],
          // Store the full objects for future use
          address: b.address,
          contact: b.contact,
        } as unknown as BranchData;
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

  async getTableCategories(branchId: number, onlyActive: boolean , includeTableCount: boolean = false): Promise<TableCategory[]> {
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


  async updateTable(tableId: number, data: UpdateMenuTableDto): Promise<any> {
    try {
      logger.info('Masa güncelleme API çağrısı başlatılıyor', { tableId, data }, { prefix: 'BranchService' });
      
      const response = await httpClient.put(`/api/branches/tables/${tableId}`, data);
      
      logger.info('Masa başarıyla güncellendi', response.data, { prefix: 'BranchService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masa güncellenirken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  // Delete a table
  async deleteTable(tableId: number, branchId: number): Promise<void> {
    try {
      logger.info('Masa silme API çağrısı başlatılıyor', { tableId, branchId }, { prefix: 'BranchService' });
      
      // Include branchId as query parameter
      await httpClient.delete(`/api/branches/tables/${tableId}?branchId=${branchId}`);
      
      logger.info('Masa başarıyla silindi', { tableId, branchId }, { prefix: 'BranchService' });
    } catch (error) {
      logger.error('Masa silinirken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  // Fix the existing toggleTableStatus method (it should toggle isActive, not isOccupied for status changes)
  async toggleTableStatus(tableId: number, branchId: number, isActive: boolean): Promise<void> {
    try {
      logger.info('Masa durumu güncelleme isteği', { tableId, branchId, isActive }, { prefix: 'BranchService' });
      
      // You might need to adjust this endpoint based on your actual API
      await httpClient.patch(`/api/branches/tables/${tableId}/toggle-status?branchId=${branchId}`, {
        isActive
      });
      
      logger.info('Masa durumu başarıyla güncellendi', { tableId, isActive }, { prefix: 'BranchService' });
    } catch (error) {
      logger.error('Masa durumu güncellenirken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  // Toggle table occupation status (for when customers sit/leave)
  async toggleTableOccupation(tableId: number, branchId: number, isOccupied: boolean): Promise<void> {
    try {
      logger.info('Masa doluluk durumu güncelleme isteği', { tableId, branchId, isOccupied }, { prefix: 'BranchService' });
      
      await httpClient.patch(`/api/branches/tables/${tableId}/occupation?branchId=${branchId}`, {
        isOccupied
      });
      
      logger.info('Masa doluluk durumu başarıyla güncellendi', { tableId, isOccupied }, { prefix: 'BranchService' });
    } catch (error) {
      logger.error('Masa doluluk durumu güncellenirken hata oluştu', error, { prefix: 'BranchService' });
      throw error;
    }
  }
}

export const branchService = new BranchService(); 