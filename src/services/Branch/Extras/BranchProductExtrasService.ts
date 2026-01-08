import { APIBranchProductExtra, AvailableProductExtra, BatchUpdateBranchProductExtraData, BranchProductExtra, CreateBranchProductExtraData, GroupedBranchProductExtra, ReorderBranchProductExtraItem, UpdateBranchProductExtraData } from "../../../types/Branch/Extras/type";
import { httpClient, getEffectiveBranchId } from "../../../utils/http";
import { logger } from "../../../utils/logger";

class BranchProductExtrasService {
  private baseUrl = '/api/BranchProductExtras';

      private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }

  // Get all branch product extras by branch product ID
  async getBranchProductExtrasByBranchProductId(
    branchProductId: number
  ): Promise<BranchProductExtra[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Branch product extras listesi getiriliyor', { branchProductId, branchId, language });

      const params = branchId ? { branchId, language } : {};
      const response = await httpClient.get<APIBranchProductExtra[]>(
        `${this.baseUrl}/branch-product/${branchProductId}`,
        { params }
      );

      logger.info('Branch product extras listesi başarıyla getirildi', {
        count: response.data.length,
        branchId
      });
      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extras listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Get grouped branch product extras by branch product ID
  async getGroupedBranchProductExtrasByBranchProductId(
    branchProductId: number
  ): Promise<GroupedBranchProductExtra[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Gruplu branch product extras listesi getiriliyor', { branchProductId, branchId, language });

      const params = branchId ? { branchId, language } : {};
      const response = await httpClient.get<GroupedBranchProductExtra[]>(
        `${this.baseUrl}/branch-product/${branchProductId}/grouped`,
        { params }
      );

      logger.info('Gruplu branch product extras listesi başarıyla getirildi', {
        count: response.data.length,
        branchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Gruplu branch product extras listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Get branch product extra by ID
  async getBranchProductExtraById(id: number): Promise<BranchProductExtra> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Branch product extra detayı getiriliyor', { id, branchId, language });

      const params = branchId ? { branchId, language } : {};
      const response = await httpClient.get<APIBranchProductExtra>(`${this.baseUrl}/${id}`, { params });

      logger.info('Branch product extra detayı başarıyla getirildi', { data: response.data, branchId });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra detayı getirilirken hata:', error);
      throw error;
    }
  }

  // Update branch product extra
  async updateBranchProductExtra(data: UpdateBranchProductExtraData): Promise<BranchProductExtra> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload = {
        isActive: data.isActive,
        specialUnitPrice: data.specialUnitPrice,
        minQuantity: data.minQuantity,
        maxQuantity: data.maxQuantity,
        isRequiredOverride: data.isRequiredOverride,
      };

      logger.info('Branch product extra güncelleme isteği gönderiliyor', {
        id: data.id,
        payload,
        branchId
      });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<APIBranchProductExtra>(
        `${this.baseUrl}/${data.id}`,
        payload,
        { params }
      );

      logger.info('Branch product extra başarıyla güncellendi', { data: response.data, branchId });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra güncellenirken hata:', error);
      throw error;
    }
  }

  // Delete branch product extra
  async deleteBranchProductExtra(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extra silme isteği gönderiliyor', { id, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/${id}`, { params });

      logger.info('Branch product extra başarıyla silindi', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extra silinirken hata:', error);
      throw error;
    }
  }

  // Create branch product extra
  async createBranchProductExtra(data: CreateBranchProductExtraData): Promise<BranchProductExtra> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload = {
        branchProductId: data.branchProductId,
        productExtraId: data.productExtraId,
        isActive: data.isActive,
        specialUnitPrice: data.specialUnitPrice,
        minQuantity: data.minQuantity,
        maxQuantity: data.maxQuantity,
        isRequiredOverride: data.isRequiredOverride,
      };

      logger.info('Branch product extra ekleme isteği gönderiliyor', { payload, branchId });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post<APIBranchProductExtra>(this.baseUrl, payload, { params });

      logger.info('Branch product extra başarıyla eklendi', { data: response.data, branchId });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra eklenirken hata:', error);
      throw error;
    }
  }

  // Get available product extras with optional filters
  async getAvailableProductExtras(params?: {
    branchProductId?: number;
    branchId?: number;
    onlyActive?: boolean;
  }): Promise<AvailableProductExtra[]> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = params?.branchId || getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Mevcut product extras listesi getiriliyor', { params, branchId: effectiveBranchId, language });
      const response = await httpClient.get<AvailableProductExtra[]>(`${this.baseUrl}/available`, {
        params: {
          branchProductId: params?.branchProductId,
          ...(effectiveBranchId && { branchId: effectiveBranchId }),
          language
        }
      });

      logger.info('Mevcut product extras listesi başarıyla getirildi', {
        count: response.data.length,
        branchId: effectiveBranchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Mevcut product extras listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Batch update branch product extras
  async batchUpdateBranchProductExtras(data: BatchUpdateBranchProductExtraData): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extras batch update işlemi gönderiliyor', { data, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/batch-update`, data, { params });

      logger.info('Branch product extras batch update işlemi başarıyla tamamlandı', { branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extras batch update işlemi sırasında hata:', error);
      throw error;
    }
  }

  // Reorder branch product extras
  async reorderBranchProductExtras(
    branchProductId: number,
    items: ReorderBranchProductExtraItem[]
  ): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extras reorder işlemi gönderiliyor', {
        branchProductId,
        items,
        branchId
      });

      const params = branchId ? { branchId } : {};
      await httpClient.put(
        `${this.baseUrl}/branch-product/${branchProductId}/reorder`,
        items,
        { params }
      );

      logger.info('Branch product extras reorder işlemi başarıyla tamamlandı', { branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extras reorder işlemi sırasında hata:', error);
      throw error;
    }
  }

  // Get deleted branch product extras
  async getDeletedBranchProductExtras(): Promise<BranchProductExtra[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Silinen branch product extras listesi getiriliyor', { branchId, language });

      const params = branchId ? { branchId, language } : {};
      const response = await httpClient.get<APIBranchProductExtra[]>(`${this.baseUrl}/deleted`, { params });

      logger.info('Silinen branch product extras listesi başarıyla getirildi', {
        count: response.data.length,
        branchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Silinen branch product extras listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Restore deleted branch product extra
  async restoreBranchProductExtra(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extra restore isteği gönderiliyor', { id, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/${id}/restore`, {}, { params });

      logger.info('Branch product extra başarıyla restore edildi', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extra restore edilirken hata:', error);
      throw error;
    }
  }
}

// Export service instances
export const branchProductExtrasService = new BranchProductExtrasService();