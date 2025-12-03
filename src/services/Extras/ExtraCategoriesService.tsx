import { APIExtraCategory, CreateExtraCategoryData, ExtraCategory, ReorderCategoriesData, UpdateExtraCategoryData } from "../../types/Extras/type";
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";


class ExtraCategoriesService {
  private baseUrl = '/api/ExtraCategories';

  async getExtraCategories(): Promise<ExtraCategory[]> {
    try {
      logger.info('Extra kategori listesi getiriliyor');
      
      const response = await httpClient.get<APIExtraCategory[]>(`${this.baseUrl}`);
      logger.info('Extra kategori listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra kategori listesi getirilirken hata:', error);
      throw error;
    }
  }

  // GET - Get extra category by ID
  async getExtraCategoryById(id: number): Promise<ExtraCategory> {
    try {
      logger.info('Extra kategori detayı getiriliyor', { id });
      
      const response = await httpClient.get<APIExtraCategory>(`${this.baseUrl}/${id}`);
      
      logger.info('Extra kategori detayı başarıyla getirildi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra kategori detayı getirilirken hata:', error);
      throw error;
    }
  }

  // POST - Create new extra category
  async createExtraCategory(categoryData: CreateExtraCategoryData): Promise<ExtraCategory> {
    try {
      const payload = {
        categoryName: categoryData.categoryName,
        status: categoryData.status,
        isRequired: categoryData.isRequired,
        defaultMinSelectionCount: categoryData.defaultMinSelectionCount,
        defaultMaxSelectionCount: categoryData.defaultMaxSelectionCount,
        defaultMinTotalQuantity: categoryData.defaultMinTotalQuantity,
        defaultMaxTotalQuantity: categoryData.defaultMaxTotalQuantity
      };
      
      logger.info('Extra kategori ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post<APIExtraCategory>(`${this.baseUrl}`, payload);
      
      logger.info('Extra kategori başarıyla eklendi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra kategori eklenirken hata:', error);
      throw error;
    }
  }

  // PUT - Update extra category
  async updateExtraCategory(categoryData: UpdateExtraCategoryData): Promise<ExtraCategory> {
    try {
      const payload = {
        categoryName: categoryData.categoryName,
        status: categoryData.status,
        isRequired: categoryData.isRequired,
        defaultMinSelectionCount: categoryData.defaultMinSelectionCount,
        defaultMaxSelectionCount: categoryData.defaultMaxSelectionCount,
        defaultMinTotalQuantity: categoryData.defaultMinTotalQuantity,
        defaultMaxTotalQuantity: categoryData.defaultMaxTotalQuantity
      };
      
      logger.info('Extra kategori güncelleme isteği gönderiliyor', { 
        id: categoryData.id, 
        payload 
      });
      
      const response = await httpClient.put<APIExtraCategory>(
        `${this.baseUrl}/${categoryData.id}`, 
        payload
      );
      
      logger.info('Extra kategori başarıyla güncellendi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra kategori güncellenirken hata:', error);
      throw error;
    }
  }

  // DELETE - Delete extra category
  async deleteExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Extra kategori silme isteği gönderiliyor', { id });
      
      await httpClient.delete(`${this.baseUrl}/${id}`);
      
      logger.info('Extra kategori başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Extra kategori silinirken hata:', error);
      throw error;
    }
  }

  // GET - Get deleted extra categories
  async getDeletedExtraCategories(): Promise<ExtraCategory[]> {
    try {
      logger.info('Silinmiş extra kategori listesi getiriliyor');
      
      const response = await httpClient.get<APIExtraCategory[]>(`${this.baseUrl}/deleted`);
      
      logger.info('Silinmiş extra kategori listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Silinmiş extra kategori listesi getirilirken hata:', error);
      throw error;
    }
  }

  // POST - Reorder extra categories
  async reorderExtraCategories(reorderData: ReorderCategoriesData): Promise<void> {
    try {
      logger.info('Extra kategori sıralama isteği gönderiliyor', { reorderData });
      
      await httpClient.post(`${this.baseUrl}/reorder`, reorderData);
      
      logger.info('Extra kategoriler başarıyla sıralandı');
    } catch (error: any) {
      logger.error('❌ Extra kategoriler sıralanırken hata:', error);
      throw error;
    }
  }

  // POST - Restore deleted extra category
  async restoreExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Extra kategori geri yükleme isteği gönderiliyor', { id });
      
      await httpClient.post(`${this.baseUrl}/${id}/restore`);
      
      logger.info('Extra kategori başarıyla geri yüklendi', { id });
    } catch (error: any) {
      logger.error('❌ Extra kategori geri yüklenirken hata:', error);
      throw error;
    }
  }
}

export const extraCategoriesService = new ExtraCategoriesService();