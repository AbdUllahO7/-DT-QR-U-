import { APIProductExtra, CreateProductExtraData, ProductExtra, ReorderProductExtrasData, UpdateProductExtraData } from "../../types/Extras/type";
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";


// Product Extras Service Class
class ProductExtrasService {
  private baseUrl = '/api';

    private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }

  // Create Product Extra (POST)
  async createProductExtra(data: CreateProductExtraData): Promise<ProductExtra> {
    try {
      const payload = {
        productId: data.productId,
        extraId: data.extraId,
        selectionMode: data.selectionMode,
        defaultQuantity: data.defaultQuantity,
        defaultMinQuantity: data.defaultMinQuantity,
        defaultMaxQuantity: data.defaultMaxQuantity,
        unitPrice: data.unitPrice,
        isRequired: data.isRequired,
      };
      
      logger.info('Ürün ekstrası ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post<APIProductExtra>(
        `${this.baseUrl}/ProductExtras`, 
        payload
      );
      
      logger.info('Ürün ekstrası başarıyla eklendi', { data: response.data });
      
      // Transform API response to internal format
      const transformed: ProductExtra = {
        id: response.data.id,
        productId: response.data.productId,
        extraId: response.data.extraId,
        extraName: response.data.extraName,
        categoryName: response.data.categoryName,
        selectionMode: response.data.selectionMode,
        defaultQuantity: response.data.defaultQuantity,
        defaultMinQuantity: response.data.defaultMinQuantity,
        defaultMaxQuantity: response.data.defaultMaxQuantity,
        unitPrice: response.data.unitPrice,
        isRequired: response.data.isRequired,
        displayOrder: response.data.displayOrder,
        isDeleted: response.data.isDeleted,
      };
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstrası eklenirken hata:', error);
      throw error;
    }
  }

  // Get Product Extras by Product ID (GET /product/{productId})
  async getProductExtrasByProductId(productId: number): Promise<ProductExtra[]> {
    try {
      logger.info('Ürün ekstrasları listesi getiriliyor', { productId });
            const language = this.getLanguageFromStorage();
      const response = await httpClient.get<APIProductExtra[]>(
        `${this.baseUrl}/ProductExtras/product/${productId}`, {
          params: {
            'language': language
          }
        }
      );
      
      logger.info('Ürün ekstrasları listesi başarıyla getirildi', { 
        productId,
        count: response.data.length 
      });
      
      // Transform API response to internal format
      const transformed: ProductExtra[] = response.data.map((item) => ({
        id: item.id,
        productId: item.productId,
        extraId: item.extraId,
        extraName: item.extraName,
        categoryName: item.categoryName,
        selectionMode: item.selectionMode,
        defaultQuantity: item.defaultQuantity,
        defaultMinQuantity: item.defaultMinQuantity,
        defaultMaxQuantity: item.defaultMaxQuantity,
        unitPrice: item.unitPrice,
        isRequired: item.isRequired,
        displayOrder: item.displayOrder,
        isDeleted: item.isDeleted,
      }));
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstrasları listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Update Product Extra (PUT)
  async updateProductExtra(data: UpdateProductExtraData): Promise<ProductExtra> {
    try {
      const payload = {
        selectionMode: data.selectionMode,
        defaultQuantity: data.defaultQuantity,
        defaultMinQuantity: data.defaultMinQuantity,
        defaultMaxQuantity: data.defaultMaxQuantity,
        unitPrice: data.unitPrice,
        isRequired: data.isRequired,
      };
      
      logger.info('Ürün ekstrası güncelleme isteği gönderiliyor', { 
        id: data.id, 
        payload 
      });
      
      const response = await httpClient.put<APIProductExtra>(
        `${this.baseUrl}/ProductExtras/${data.id}`, 
        payload
      );
      
      logger.info('Ürün ekstrası başarıyla güncellendi', { data: response.data });
      
      // Transform API response to internal format
      const transformed: ProductExtra = {
        id: response.data.id,
        productId: response.data.productId,
        extraId: response.data.extraId,
        extraName: response.data.extraName,
        categoryName: response.data.categoryName,
        selectionMode: response.data.selectionMode,
        defaultQuantity: response.data.defaultQuantity,
        defaultMinQuantity: response.data.defaultMinQuantity,
        defaultMaxQuantity: response.data.defaultMaxQuantity,
        unitPrice: response.data.unitPrice,
        isRequired: response.data.isRequired,
        displayOrder: response.data.displayOrder,
        isDeleted: response.data.isDeleted,
      };
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Ürün ekstrası güncellenirken hata:', error);
      throw error;
    }
  }

  // Delete Product Extra (DELETE)
  async deleteProductExtra(id: number): Promise<void> {
    try {
      logger.info('Ürün ekstrası silme isteği gönderiliyor', { id });
      
      await httpClient.delete(`${this.baseUrl}/ProductExtras/${id}`);
      
      logger.info('Ürün ekstrası başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Ürün ekstrası silinirken hata:', error);
      throw error;
    }
  }

  // Get Deleted Product Extras (GET /deleted)
  async getDeletedProductExtras(): Promise<ProductExtra[]> {
    try {
      logger.info('Silinmiş ürün ekstrasları listesi getiriliyor');
                  const language = this.getLanguageFromStorage();

      const response = await httpClient.get<APIProductExtra[]>(
        `${this.baseUrl}/ProductExtras/deleted`, {
          params: {
            'language': language
          }
        }
      );
      
      logger.info('Silinmiş ürün ekstrasları listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // Transform API response to internal format
      const transformed: ProductExtra[] = response.data.map((item) => ({
        id: item.id,
        productId: item.productId,
        extraId: item.extraId,
        extraName: item.extraName,
        categoryName: item.categoryName,
        selectionMode: item.selectionMode,
        defaultQuantity: item.defaultQuantity,
        defaultMinQuantity: item.defaultMinQuantity,
        defaultMaxQuantity: item.defaultMaxQuantity,
        unitPrice: item.unitPrice,
        isRequired: item.isRequired,
        displayOrder: item.displayOrder,
        isDeleted: item.isDeleted,
      }));
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Silinmiş ürün ekstrasları listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Restore Product Extra (POST /{id}/restore)
  async restoreProductExtra(id: number): Promise<void> {
    try {
      logger.info('Ürün ekstrası geri yükleme isteği gönderiliyor', { id });
      
      await httpClient.post(`${this.baseUrl}/ProductExtras/${id}/restore`);
      
      logger.info('Ürün ekstrası başarıyla geri yüklendi', { id });
    } catch (error: any) {
      logger.error('❌ Ürün ekstrası geri yüklenirken hata:', error);
      throw error;
    }
  }

  // Reorder Product Extras (POST /product/{productId}/reorder)
  async reorderProductExtras(data: ReorderProductExtrasData): Promise<void> {
    try {
      const payload = {
        productId: data.productId,
        extraOrders: data.items.map((order) => ({
          productExtraId: order.id,
          newDisplayOrder: order.displayOrder,
        }))
      };
      
      logger.info('Ürün ekstrasları sıralama isteği gönderiliyor', { payload });
      
      await httpClient.post(
        `${this.baseUrl}/ProductExtras/product/${data.productId}/reorder`, 
        payload
      );
      
      logger.info('Ürün ekstrasları başarıyla sıralandı', { productId: data.productId });
    } catch (error: any) {
      logger.error('❌ Ürün ekstrasları sıralanırken hata:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productExtrasService = new ProductExtrasService();