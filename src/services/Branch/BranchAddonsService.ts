import { httpClient, getEffectiveBranchId } from "../../utils/http";
import { logger } from "../../utils/logger";

// Available addons interface (from the /available endpoint)
export interface BranchProductAddon {
  mainBranchProductId: number;
  addonBranchProductId: number;
  mainProductName: string;
  addonProductName: string;
  addonProductDescription: string;
  addonImageUrl: string;
  addonPrice: number;
  addonCategoryName: string;
  isRecommended: boolean;
  marketingText: string;
  suggestedDisplayOrder: number;
}

// Update addon interface (PUT request)
export interface UpdateBranchProductAddonDto {
  isActive: boolean;
  specialPrice: number;
  marketingText: string;
  maxQuantity: number;
  minQuantity: number;
  groupTag: string;
  isGroupRequired: boolean;
}

// Create addon interface (POST request)
export interface CreateBranchProductAddonDto {
  mainBranchProductId: number;
  addonBranchProductId: number;
  isActive: boolean;
  specialPrice: number;
  marketingText: string;
  maxQuantity: number;
  minQuantity: number;
  groupTag: string;
  isGroupRequired: boolean;
}

// Batch update addon item interface
export interface BatchUpdateAddonItemDto {
  addonBranchProductId: number;
  isActive: boolean;
  specialPrice: number;
  displayOrder: number;
  marketingText: string;
  maxQuantity: number;
  minQuantity: number;
  groupTag: string;
  isGroupRequired: boolean;
}

// Batch update interface
export interface BatchUpdateBranchProductAddonsDto {
  branchProductId: number;
  addons: BatchUpdateAddonItemDto[];
}

// Reorder item interface
export interface ReorderBranchProductAddonDto {
  id: number;
  displayOrder: number;
}

// Full addon details interface (for GET single addon response)
export interface BranchProductAddonDetails extends UpdateBranchProductAddonDto {
  id: number;
  mainBranchProductId: number;
  addonBranchProductId: number;
  displayOrder: number;
  createdDate?: string;
  modifiedDate?: string;
}

class BranchProductAddonsService {
  private baseUrl = '/api/BranchProductAddons';

  // GET /api/BranchProductAddons/available
  async getAvailableBranchProductAddons(): Promise<BranchProductAddon[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<BranchProductAddon[]>(`${this.baseUrl}/available`, { params });
      
      // The response is a direct array of BranchProductAddon objects
      const addonsData: BranchProductAddon[] = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Available branch product addons başarıyla alındı', { 
        addonsCount: addonsData.length,
        addons: addonsData.map(addon => ({
          mainProductName: addon.mainProductName,
          addonProductName: addon.addonProductName,
          addonPrice: addon.addonPrice,
          addonCategoryName: addon.addonCategoryName,
          isRecommended: addon.isRecommended
        }))
      }, );
      return addonsData;
    } catch (error: any) {
      logger.error('Available branch product addons getirme hatası', error, { prefix: 'BranchProductAddonsService' });
      
      if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Branch product addons bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Branch product addons bilgileri getirilirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  // GET /api/BranchProductAddons/branch-product/{branchProductId}
  async getBranchProductAddons(branchProductId: number): Promise<BranchProductAddonDetails[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addons getirme isteği gönderiliyor', { branchProductId, branchId }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/branch-product/${branchProductId}`;
      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<BranchProductAddonDetails[]>(url, { params });

      const addonsData = Array.isArray(response.data) ? response.data : [];

      logger.info('Branch product addons başarıyla alındı', {
        branchProductId,
        branchId,
        addonsCount: addonsData.length
      }, { prefix: 'BranchProductAddonsService' });

      return addonsData;
    } catch (error: any) {
      logger.error('Branch product addons getirme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addons getirilirken hata oluştu');
    }
  }

  // GET /api/BranchProductAddons/branch-product/{branchProductId}/grouped
  async getBranchProductAddonsGrouped(branchProductId: number): Promise<any> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addons grouped getirme isteği gönderiliyor', { branchProductId, branchId }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/branch-product/${branchProductId}/grouped`;
      const params = branchId ? { branchId } : {};
      const response = await httpClient.get(url, { params });

      logger.info('Branch product addons grouped başarıyla alındı', {
        branchProductId,
        branchId
      }, { prefix: 'BranchProductAddonsService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch product addons grouped getirme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Grouped branch product addons getirilirken hata oluştu');
    }
  }

  // GET /api/BranchProductAddons/{id}
  async getBranchProductAddon(id: number): Promise<BranchProductAddonDetails> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addon detayı getirme isteği gönderiliyor', { id, branchId }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/${id}`;
      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<BranchProductAddonDetails>(url, { params });

      logger.info('Branch product addon detayı başarıyla alındı', { id, branchId }, { prefix: 'BranchProductAddonsService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch product addon detayı getirme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addon detayı getirilirken hata oluştu');
    }
  }

  // PUT /api/BranchProductAddons/{id}
  async updateBranchProductAddon(id: number, data: UpdateBranchProductAddonDto): Promise<BranchProductAddonDetails> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addon güncelleme isteği gönderiliyor', { id, branchId, data }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/${id}`;
      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<BranchProductAddonDetails>(url, data, { params });

      logger.info('Branch product addon başarıyla güncellendi', { id, branchId }, { prefix: 'BranchProductAddonsService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch product addon güncelleme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addon güncellenirken hata oluştu');
    }
  }

  // DELETE /api/BranchProductAddons/{id}
  async deleteBranchProductAddon(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addon silme isteği gönderiliyor', { id, branchId }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/${id}`;
      const params = branchId ? { branchId } : {};
      await httpClient.delete(url, { params });

      logger.info('Branch product addon başarıyla silindi', { id, branchId }, { prefix: 'BranchProductAddonsService' });
    } catch (error: any) {
      logger.error('Branch product addon silme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addon silinirken hata oluştu');
    }
  }

  // POST /api/BranchProductAddons
  async createBranchProductAddon(data: CreateBranchProductAddonDto): Promise<BranchProductAddonDetails> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addon oluşturma isteği gönderiliyor', { branchId, data }, { prefix: 'BranchProductAddonsService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post<BranchProductAddonDetails>(this.baseUrl, data, { params });

      logger.info('Branch product addon başarıyla oluşturuldu', {
        id: response.data.id,
        branchId
      }, { prefix: 'BranchProductAddonsService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch product addon oluşturma hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addon oluşturulurken hata oluştu');
    }
  }

  // POST /api/BranchProductAddons/batch-update
  async batchUpdateBranchProductAddons(data: BatchUpdateBranchProductAddonsDto): Promise<any> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addons batch güncelleme isteği gönderiliyor', {
        branchProductId: data.branchProductId,
        branchId,
        addonsCount: data.addons.length
      }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/batch-update`;
      const params = branchId ? { branchId } : {};
      const response = await httpClient.post(url, data, { params });

      logger.info('Branch product addons batch güncelleme başarıyla tamamlandı', {
        branchProductId: data.branchProductId,
        branchId
      }, { prefix: 'BranchProductAddonsService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch product addons batch güncelleme hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addons batch güncellenirken hata oluştu');
    }
  }

  // PUT /api/BranchProductAddons/branch-product/{branchProductId}/reorder
  async reorderBranchProductAddons(branchProductId: number, reorderData: ReorderBranchProductAddonDto[]): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product addons reorder isteği gönderiliyor', {
        branchProductId,
        branchId,
        itemsCount: reorderData.length
      }, { prefix: 'BranchProductAddonsService' });

      const url = `${this.baseUrl}/branch-product/${branchProductId}/reorder`;
      const params = branchId ? { branchId } : {};
      await httpClient.put(url, reorderData, { params });

      logger.info('Branch product addons reorder başarıyla tamamlandı', {
        branchProductId,
        branchId
      }, { prefix: 'BranchProductAddonsService' });
    } catch (error: any) {
      logger.error('Branch product addons reorder hatası', error, { prefix: 'BranchProductAddonsService' });
      this.handleError(error, 'Branch product addons sıralanırken hata oluştu');
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
      throw new Error('Kayıt bulunamadı.');
    } else if (error?.response?.status === 409) {
      throw new Error('Bu kayıt zaten mevcut.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }
}

export const branchProductAddonsService = new BranchProductAddonsService();