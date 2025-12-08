import { APIBranchProductExtraCategory, AvailableExtraCategory, BatchBranchProductExtraCategoryData, BranchProductExtraCategory, CreateBranchProductExtraCategoryData, UpdateBranchProductExtraCategoryData } from "../../../types/Branch/Extras/type";
import { httpClient } from "../../../utils/http";
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
      logger.info('Branch product extra categories listesi getiriliyor');

      const response = await httpClient.get<APIBranchProductExtraCategory[]>(this.baseUrl , 
        {
          params: {
            branchProductId: params?.branchProductId,
            branchId: params?.branchId,
            onlyActive: params?.onlyActive,
          },
      }
      );

      logger.info('Branch product extra categories listesi başarıyla getirildi', {
        count: response.data.length,
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

      logger.info('Branch product extra category ekleme isteği gönderiliyor', { payload });

      const response = await httpClient.post<APIBranchProductExtraCategory>(this.baseUrl, payload);

      logger.info('Branch product extra category başarıyla eklendi', { data: response.data });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra category eklenirken hata:', error);
      throw error;
    }
  }

  // Get deleted branch product extra categories
  async getDeletedBranchProductExtraCategories(): Promise<BranchProductExtraCategory[]> {
    try {
      logger.info('Silinen branch product extra categories listesi getiriliyor');

      const response = await httpClient.get<APIBranchProductExtraCategory[]>(
        `${this.baseUrl}/deleted`
      );

      logger.info('Silinen branch product extra categories listesi başarıyla getirildi', {
        count: response.data.length,
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
      logger.info('Mevcut extra categories listesi getiriliyor', { params });


      const response = await httpClient.get<AvailableExtraCategory[]>(`${this.baseUrl}/available`, {
          params: {
            branchProductId: params?.branchProductId,
            branchId: params?.branchId,
            onlyActive: params?.onlyActive,
          },
      });
      
      
      logger.info('Mevcut extra categories listesi başarıyla getirildi', {
        count: response.data.length,
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
      });

      const response = await httpClient.put<APIBranchProductExtraCategory>(
        `${this.baseUrl}/${data.id}`,
        payload
      );

      logger.info('Branch product extra category başarıyla güncellendi', { data: response.data });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Branch product extra category güncellenirken hata:', error);
      throw error;
    }
  }

  // Delete branch product extra category
  async deleteBranchProductExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Branch product extra category silme isteği gönderiliyor', { id });

      await httpClient.delete(`${this.baseUrl}/${id}`);

      logger.info('Branch product extra category başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Branch product extra category silinirken hata:', error);
      throw error;
    }
  }

  // Restore deleted branch product extra category
  async restoreBranchProductExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Branch product extra category restore isteği gönderiliyor', { id });

      await httpClient.post(`${this.baseUrl}/${id}/restore`);

      logger.info('Branch product extra category başarıyla restore edildi', { id });
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
      logger.info('Branch product extra categories batch işlemi gönderiliyor', { data });

      await httpClient.post(`${this.baseUrl}/batch`, data);

      logger.info('Branch product extra categories batch işlemi başarıyla tamamlandı');
    } catch (error: any) {
      logger.error('❌ Branch product extra categories batch işlemi sırasında hata:', error);
      throw error;
    }
  }
}

export const branchProductExtraCategoriesService = new BranchProductExtraCategoriesService();