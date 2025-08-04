import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';
import type { Category } from '../types/dashboard';

class ProductService {
  private baseUrl = '/api/Products';

  // Kategori listesini getirir
  async getCategories(): Promise<Category[]> {
    try {
      const response = await httpClient.get<Category[]>(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error: any) {
      logger.error('Kategori verileri getirilirken hata:', error);
      // Hata durumunda boş dizi dönerek uygulamanın çökmemesini sağlıyoruz
      return [];
    }
  }

  // Kategori ekleme
  async createCategory(categoryData: {
    categoryName: string;
    status: boolean;
    displayOrder: number;
  }): Promise<Category> {
    try {
      logger.info('Kategori ekleme isteği gönderiliyor', { payload: categoryData });
      const response = await httpClient.post<Category>(`${this.baseUrl}/categories`, categoryData);
      logger.info('Kategori başarıyla eklendi', { data: response.data });
      return response.data;
    } catch (error: any) {
      logger.error('❌ Kategori eklenirken hata:', error);
      throw error;
    }
  }
}

export const productService = new ProductService(); 