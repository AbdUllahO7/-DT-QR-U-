// src/services/productAddonsService.ts
import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';

// Interfaces for Product Addons
export interface ProductAddon {
  id: number;
  productId: number;
  addonProductId: number;
  displayOrder: number;
  isRecommended: boolean;
  marketingText: string;
  // Additional fields from joined data
  addonProduct?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    isAvailable: boolean;
  };
}

export interface CreateProductAddonRequest {
  productId: number;
  addonProductId: number;
  displayOrder?: number;
  isRecommended?: boolean;
  marketingText?: string;
}

export interface UpdateProductAddonRequest {
  id: number;
  displayOrder?: number;
  isRecommended?: boolean;
  marketingText?: string;
}

export interface AvailableAddonProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

class ProductAddonsService {
  private baseUrl = '/api/ProductAddons';

  /**
   * Add a product as an addon to another product
   */
  async addProductAddon(request: CreateProductAddonRequest): Promise<ProductAddon> {
    try {
      const payload = {
        productId: request.productId,
        addonProductId: request.addonProductId,
        displayOrder: request.displayOrder || 0,
        isRecommended: request.isRecommended || false,
        marketingText: request.marketingText || '',
      };

      logger.info('Ürün eklentisi ekleniyor', { payload });
      
      const response = await httpClient.post<ProductAddon>(this.baseUrl, payload);
      
      logger.info('Ürün eklentisi başarıyla eklendi', { 
        productId: request.productId,
        addonProductId: request.addonProductId,
        response: response.data 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Ürün eklentisi eklenirken hata:', error);
      throw error;
    }
  }

  /**
   * Update an existing product addon
   */
  async updateProductAddon(request: UpdateProductAddonRequest): Promise<ProductAddon> {
    try {
      const payload = {
        id: request.id,
        displayOrder: request.displayOrder,
        isRecommended: request.isRecommended,
        marketingText: request.marketingText,
      };

      logger.info('Ürün eklentisi güncelleniyor', { payload });
      
      const response = await httpClient.put<ProductAddon>(`${this.baseUrl}/${request.id}`, payload);
      
      logger.info('Ürün eklentisi başarıyla güncellendi', { 
        addonId: request.id,
        response: response.data 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Ürün eklentisi güncellenirken hata:', error);
      throw error;
    }
  }

  /**
   * Delete a product addon
   */
  async deleteProductAddon(addonId: number): Promise<void> {
    try {
      logger.info('Ürün eklentisi siliniyor', { addonId });
      
      await httpClient.delete(`${this.baseUrl}/${addonId}`);
      
      logger.info('Ürün eklentisi başarıyla silindi', { addonId });
    } catch (error: any) {
      logger.error('❌ Ürün eklentisi silinirken hata:', error);
      throw error;
    }
  }

  /**
   * Get a specific product addon by ID
   */
  async getProductAddon(addonId: number): Promise<ProductAddon> {
    try {
      logger.info('Ürün eklentisi getiriliyor', { addonId });
      
      const response = await httpClient.get<ProductAddon>(`${this.baseUrl}/${addonId}`);
      
      logger.info('Ürün eklentisi başarıyla getirildi', { 
        addonId,
        response: response.data 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Ürün eklentisi getirilirken hata:', error);
      throw error;
    }
  }

  /**
   * Get all addons for a specific product
   */
  async getProductAddons(productId: number): Promise<ProductAddon[]> {
    try {
      logger.info('Ürün eklentileri getiriliyor', { productId });
      
      const response = await httpClient.get<ProductAddon[]>(`${this.baseUrl}/product/${productId}`);
      
      logger.info('Ürün eklentileri başarıyla getirildi', { 
        productId,
        addonCount: response.data?.length || 0 
      });
      
      return response.data || [];
    } catch (error: any) {
      logger.error('❌ Ürün eklentileri getirilirken hata:', error);
      throw error;
    }
  }

  /**
   * Get all available products that can be used as addons
   */
  async getAvailableAddonProducts(): Promise<AvailableAddonProduct[]> {
    try {
      logger.info('Mevcut eklenti ürünleri getiriliyor');
      
      const response = await httpClient.get<AvailableAddonProduct[]>(`${this.baseUrl}/available`);
      
      logger.info('Mevcut eklenti ürünleri başarıyla getirildi', { 
        productCount: response.data?.length || 0 
      });
      
      return response.data || [];
    } catch (error: any) {
      logger.error('❌ Mevcut eklenti ürünleri getirilirken hata:', error);
      throw error;
    }
  }

  /**
   * Reorder product addons for a specific product
   */
  async reorderProductAddons(productId: number, addonOrders: Array<{
    addonId: number;
    newDisplayOrder: number;
  }>): Promise<void> {
    try {
      const payload = {
        productId,
        addonOrders
      };

      logger.info('Ürün eklenti sıralaması güncelleniyor', { payload });
      
      // If there's a specific reorder endpoint, use it; otherwise update each addon individually
      for (const order of addonOrders) {
        await this.updateProductAddon({
          id: order.addonId,
          displayOrder: order.newDisplayOrder
        });
      }
      
      logger.info('Ürün eklenti sıralaması başarıyla güncellendi', { 
        productId,
        updatedAddons: addonOrders.length 
      });
    } catch (error: any) {
      logger.error('❌ Ürün eklenti sıralaması güncellenirken hata:', error);
      throw error;
    }
  }

  /**
   * Bulk add multiple addons to a product
   */
  async addMultipleAddons(productId: number, addonRequests: Array<{
    addonProductId: number;
    isRecommended?: boolean;
    marketingText?: string;
  }>): Promise<ProductAddon[]> {
    try {
      logger.info('Çoklu ürün eklentisi ekleniyor', { productId, count: addonRequests.length });
      
      const results: ProductAddon[] = [];
      
      // Add each addon with proper display order
      for (let i = 0; i < addonRequests.length; i++) {
        const request = addonRequests[i];
        const addon = await this.addProductAddon({
          productId,
          addonProductId: request.addonProductId,
          displayOrder: i + 1,
          isRecommended: request.isRecommended || false,
          marketingText: request.marketingText || '',
        });
        results.push(addon);
      }
      
      logger.info('Çoklu ürün eklentisi başarıyla eklendi', { 
        productId,
        addedCount: results.length 
      });
      
      return results;
    } catch (error: any) {
      logger.error('❌ Çoklu ürün eklentisi eklenirken hata:', error);
      throw error;
    }
  }

  /**
   * Remove multiple addons from a product
   */
  async removeMultipleAddons(addonIds: number[]): Promise<void> {
    try {
      logger.info('Çoklu ürün eklentisi siliniyor', { addonIds });
      
      // Delete each addon
      for (const addonId of addonIds) {
        await this.deleteProductAddon(addonId);
      }
      
      logger.info('Çoklu ürün eklentisi başarıyla silindi', { 
        deletedCount: addonIds.length 
      });
    } catch (error: any) {
      logger.error('❌ Çoklu ürün eklentisi silinirken hata:', error);
      throw error;
    }
  }
}

export const productAddonsService = new ProductAddonsService();