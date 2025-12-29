import { APIBranchProductExtraCategory, AvailableExtraCategory, BatchBranchProductExtraCategoryData, BranchProductExtraCategory, CreateBranchProductExtraCategoryData, UpdateBranchProductExtraCategoryData } from "../../../types/Branch/Extras/type";
import { httpClient, getEffectiveBranchId } from "../../../utils/http";
import { logger } from "../../../utils/logger";

class BranchProductExtraCategoriesService {
  private baseUrl = '/api/BranchProductExtraCategories';

  // Get all branch product extra categories
  async getBranchProductExtraCategories(params?: {
    branchProductId?: number;
    branchId?: number;
    onlyActive?: boolean;
  }): Promise<BranchProductExtraCategory[]> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = params?.branchId || getEffectiveBranchId();

      logger.info('Branch product extra categories listesi getiriliyor', { branchId: effectiveBranchId });

      const response = await httpClient.get<APIBranchProductExtraCategory[]>(this.baseUrl,
        {
          params: {
            branchProductId: params?.branchProductId,
            ...(effectiveBranchId && { branchId: effectiveBranchId }),
            onlyActive: params?.onlyActive,
          },
      }
      );

      logger.info('Branch product extra categories listesi başarıyla getirildi', {
        count: response.data.length,
        branchId: effectiveBranchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra categories listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Create a new branch product extra category
  async createBranchProductExtraCategory(
    data: CreateBranchProductExtraCategoryData
  ): Promise<BranchProductExtraCategory> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload = {
        branchProductId: data.branchProductId,
        productExtraCategoryId: data.productExtraCategoryId,
        isRequiredOverride: data.isRequiredOverride,
        minSelectionCount: data.minSelectionCount,
        maxSelectionCount: data.maxSelectionCount,
        minTotalQuantity: data.minTotalQuantity,
        maxTotalQuantity: data.maxTotalQuantity,
        isActive: data.isActive,
      };

      logger.info('Branch product extra category ekleme isteği gönderiliyor', { payload, branchId });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post<APIBranchProductExtraCategory>(this.baseUrl, payload, { params });

      logger.info('Branch product extra category başarıyla eklendi', { data: response.data, branchId });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra category eklenirken hata:', error);
      throw error;
    }
  }

  // Get deleted branch product extra categories
  async getDeletedBranchProductExtraCategories(): Promise<BranchProductExtraCategory[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Silinen branch product extra categories listesi getiriliyor', { branchId });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<APIBranchProductExtraCategory[]>(
        `${this.baseUrl}/deleted`,
        { params }
      );

      logger.info('Silinen branch product extra categories listesi başarıyla getirildi', {
        count: response.data.length,
        branchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Silinen branch product extra categories listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Get available extra categories with optional filters
  async getAvailableExtraCategories(params?: {
    branchProductId?: number;
    branchId?: number;
    onlyActive?: boolean;
  }): Promise<AvailableExtraCategory[]> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = params?.branchId || getEffectiveBranchId();

      logger.info('Mevcut extra categories listesi getiriliyor', { params, branchId: effectiveBranchId });

      const response = await httpClient.get<AvailableExtraCategory[]>(`${this.baseUrl}/available`, {
          params: {
            branchProductId: params?.branchProductId,
            ...(effectiveBranchId && { branchId: effectiveBranchId }),
            onlyActive: params?.onlyActive,
          },
      });

      logger.info('Mevcut extra categories listesi başarıyla getirildi', {
        count: response.data.length,
        branchId: effectiveBranchId
      });
      return response.data;
    } catch (error: any) {
      logger.error('❌ Mevcut extra categories listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Update branch product extra category
  async updateBranchProductExtraCategory(
    data: UpdateBranchProductExtraCategoryData
  ): Promise<BranchProductExtraCategory> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload = {
        isRequiredOverride: data.isRequiredOverride,
        minSelectionCount: data.minSelectionCount,
        maxSelectionCount: data.maxSelectionCount,
        minTotalQuantity: data.minTotalQuantity,
        maxTotalQuantity: data.maxTotalQuantity,
        isActive: data.isActive,
      };

      logger.info('Branch product extra category güncelleme isteği gönderiliyor', {
        id: data.id,
        payload,
        branchId
      });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<APIBranchProductExtraCategory>(
        `${this.baseUrl}/${data.id}`,
        payload,
        { params }
      );

      logger.info('Branch product extra category başarıyla güncellendi', { data: response.data, branchId });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra category güncellenirken hata:', error);
      throw error;
    }
  }

  // Delete branch product extra category
  async deleteBranchProductExtraCategory(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extra category silme isteği gönderiliyor', { id, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/${id}`, { params });

      logger.info('Branch product extra category başarıyla silindi', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extra category silinirken hata:', error);
      throw error;
    }
  }

  // Restore deleted branch product extra category
  async restoreBranchProductExtraCategory(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extra category restore isteği gönderiliyor', { id, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/${id}/restore`, {}, { params });

      logger.info('Branch product extra category başarıyla restore edildi', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extra category restore edilirken hata:', error);
      throw error;
    }
  }

  // Batch create/update branch product extra categories
  async batchBranchProductExtraCategories(
    data: BatchBranchProductExtraCategoryData
  ): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch product extra categories batch işlemi gönderiliyor', { data, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/batch`, data, { params });

      logger.info('Branch product extra categories batch işlemi başarıyla tamamlandı', { branchId });
    } catch (error: any) {
      logger.error('❌ Branch product extra categories batch işlemi sırasında hata:', error);
      throw error;
    }
  }
}

export const branchProductExtraCategoriesService = new BranchProductExtraCategoriesService();