import { APIProductExtraCategory, CreateProductExtraCategoryData, ProductExtraCategory, ReorderProductExtraCategoriesData, UpdateProductExtraCategoryData } from "../../types/Extras/type";
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";


// Product Extra Categories Service Class
class ProductExtraCategoriesService {
  private baseUrl = '/api';

  // Create Product Extra Category (POST)
  async createProductExtraCategory(data: CreateProductExtraCategoryData): Promise<ProductExtraCategory> {
    try {
      const payload = {
        productId: data.productId,
        extraCategoryId: data.extraCategoryId,
        isRequiredOverride: data.isRequiredOverride,
        minSelectionCount: data.minSelectionCount,
        maxSelectionCount: data.maxSelectionCount,
        minTotalQuantity: data.minTotalQuantity,
        maxTotalQuantity: data.maxTotalQuantity,
      };
      
      logger.info('Ürün ekstra kategorisi ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post<APIProductExtraCategory>(
        `${this.baseUrl}/ProductExtraCategories`, 
        payload
      );
      
      logger.info('Ürün ekstra kategorisi başarıyla eklendi', { data: response.data });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory = {
        id: response.data.id,
        productId: response.data.productId,
        extraCategoryId: response.data.extraCategoryId,
        isRequiredOverride: response.data.isRequiredOverride,
        minSelectionCount: response.data.minSelectionCount,
        maxSelectionCount: response.data.maxSelectionCount,
        minTotalQuantity: response.data.minTotalQuantity,
        maxTotalQuantity: response.data.maxTotalQuantity,
        displayOrder: response.data.displayOrder,
        isDeleted: response.data.isDeleted,
      };
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategorisi eklenirken hata:', error);
      throw error;
    }
  }

  // Get all Product Extra Categories (GET)
  async getProductExtraCategories(): Promise<ProductExtraCategory[]> {
    try {
      logger.info('Ürün ekstra kategori listesi getiriliyor');
      
      const response = await httpClient.get<APIProductExtraCategory[]>(
        `${this.baseUrl}/ProductExtraCategories`
      );
      
      logger.info('Ürün ekstra kategori listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory[] = response.data.map((item) => ({
        id: item.id,
        productId: item.productId,
        extraCategoryId: item.extraCategoryId,
        isRequiredOverride: item.isRequiredOverride,
        minSelectionCount: item.minSelectionCount,
        maxSelectionCount: item.maxSelectionCount,
        minTotalQuantity: item.minTotalQuantity,
        maxTotalQuantity: item.maxTotalQuantity,
        displayOrder: item.displayOrder,
        isDeleted: item.isDeleted,
      }));

      console.log('transformed', response.data);
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategori listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Get Product Extra Category by ID (GET by ID)
  async getProductExtraCategoryById(id: number): Promise<ProductExtraCategory> {
    try {
      logger.info('Ürün ekstra kategori detayı getiriliyor', { id });
      
      const response = await httpClient.get<APIProductExtraCategory>(
        `${this.baseUrl}/ProductExtraCategories/${id}`
      );
      
      logger.info('Ürün ekstra kategori detayı başarıyla getirildi', { data: response.data });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory = {
        id: response.data.id,
        productId: response.data.productId,
        extraCategoryId: response.data.extraCategoryId,
        isRequiredOverride: response.data.isRequiredOverride,
        minSelectionCount: response.data.minSelectionCount,
        maxSelectionCount: response.data.maxSelectionCount,
        minTotalQuantity: response.data.minTotalQuantity,
        maxTotalQuantity: response.data.maxTotalQuantity,
        displayOrder: response.data.displayOrder,
        isDeleted: response.data.isDeleted,
      };
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategori detayı getirilirken hata:', error);
      throw error;
    }
  }

  // Update Product Extra Category (PUT)
  async updateProductExtraCategory(data: UpdateProductExtraCategoryData): Promise<ProductExtraCategory> {
    try {
      const payload = {
        isRequiredOverride: data.isRequiredOverride,
        minSelectionCount: data.minSelectionCount,
        maxSelectionCount: data.maxSelectionCount,
        minTotalQuantity: data.minTotalQuantity,
        maxTotalQuantity: data.maxTotalQuantity,
      };
      
      logger.info('Ürün ekstra kategorisi güncelleme isteği gönderiliyor', { 
        id: data.id, 
        payload 
      });
      
      const response = await httpClient.put<APIProductExtraCategory>(
        `${this.baseUrl}/ProductExtraCategories/${data.id}`, 
        payload
      );
      
      logger.info('Ürün ekstra kategorisi başarıyla güncellendi', { data: response.data });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory = {
        id: response.data.id,
        productId: response.data.productId,
        extraCategoryId: response.data.extraCategoryId,
        isRequiredOverride: response.data.isRequiredOverride,
        minSelectionCount: response.data.minSelectionCount,
        maxSelectionCount: response.data.maxSelectionCount,
        minTotalQuantity: response.data.minTotalQuantity,
        maxTotalQuantity: response.data.maxTotalQuantity,
        displayOrder: response.data.displayOrder,
        isDeleted: response.data.isDeleted,
      };
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategorisi güncellenirken hata:', error);
      throw error;
    }
  }

  // Delete Product Extra Category (DELETE)
  async deleteProductExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Ürün ekstra kategorisi silme isteği gönderiliyor', { id });
      
      await httpClient.delete(`${this.baseUrl}/ProductExtraCategories/${id}`);
      
      logger.info('Ürün ekstra kategorisi başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategorisi silinirken hata:', error);
      throw error;
    }
  }

  // Get Deleted Product Extra Categories (GET /deleted)
  async getDeletedProductExtraCategories(): Promise<ProductExtraCategory[]> {
    try {
      logger.info('Silinmiş ürün ekstra kategori listesi getiriliyor');
      
      const response = await httpClient.get<APIProductExtraCategory[]>(
        `${this.baseUrl}/ProductExtraCategories/deleted`
      );
      
      logger.info('Silinmiş ürün ekstra kategori listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory[] = response.data.map((item) => ({
        id: item.id,
        productId: item.productId,
        extraCategoryId: item.extraCategoryId,
        isRequiredOverride: item.isRequiredOverride,
        minSelectionCount: item.minSelectionCount,
        maxSelectionCount: item.maxSelectionCount,
        minTotalQuantity: item.minTotalQuantity,
        maxTotalQuantity: item.maxTotalQuantity,
        displayOrder: item.displayOrder,
        isDeleted: item.isDeleted,
      }));
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Silinmiş ürün ekstra kategori listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Get Available Product Extra Categories (GET /available)
  async getAvailableProductExtraCategories(): Promise<ProductExtraCategory[]> {
    try {
      logger.info('Aktif ürün ekstra kategori listesi getiriliyor');
      
      const response = await httpClient.get<APIProductExtraCategory[]>(
        `${this.baseUrl}/ProductExtraCategories/available`
      );
      
      logger.info('Aktif ürün ekstra kategori listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // Transform API response to internal format
      const transformed: ProductExtraCategory[] = response.data.map((item) => ({
        id: item.id,
        productId: item.productId,
        extraCategoryId: item.extraCategoryId,
        isRequiredOverride: item.isRequiredOverride,
        minSelectionCount: item.minSelectionCount,
        maxSelectionCount: item.maxSelectionCount,
        minTotalQuantity: item.minTotalQuantity,
        maxTotalQuantity: item.maxTotalQuantity,
        displayOrder: item.displayOrder,
        isDeleted: item.isDeleted,
      }));
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Aktif ürün ekstra kategori listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Restore Product Extra Category (POST /{id}/restore)
  async restoreProductExtraCategory(id: number): Promise<void> {
    try {
      logger.info('Ürün ekstra kategorisi geri yükleme isteği gönderiliyor', { id });
      
      await httpClient.post(`${this.baseUrl}/ProductExtraCategories/${id}/restore`);
      
      logger.info('Ürün ekstra kategorisi başarıyla geri yüklendi', { id });
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategorisi geri yüklenirken hata:', error);
      throw error;
    }
  }

  // Reorder Product Extra Categories (POST /reorder)
  async reorderProductExtraCategories(data: ReorderProductExtraCategoriesData): Promise<void> {
    try {
      const payload = {
        items: data.items.map(item => ({
          id: item.id,
          displayOrder: item.displayOrder,
        }))
      };
      
      logger.info('Ürün ekstra kategorileri sıralama isteği gönderiliyor', { payload });
      
      await httpClient.post(
        `${this.baseUrl}/ProductExtraCategories/reorder`, 
        payload
      );
      
      logger.info('Ürün ekstra kategorileri başarıyla sıralandı');
    } catch (error: any) {
      logger.error('❌ Ürün ekstra kategorileri sıralanırken hata:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productExtraCategoriesService = new ProductExtraCategoriesService();