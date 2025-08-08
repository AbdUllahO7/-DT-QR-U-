import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';
import type { Category, CategoryReorderRequest, Product, ProductReorderRequest } from '../types/dashboard';

// API Response interfaces (what the backend actually returns)
interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
  description?: string; // May or may not be included
  categoryId: number;
}

interface APICategory {
  categoryId: number;
  categoryName: string;
  status: boolean;
  displayOrder: number;
  restaurantId: number;
  products: APIProduct[];
  description?: string; // May or may not be included
}
interface ProductIngredient {
  ingredientId: number;
  quantity: number;
  unit: string;
}
interface UpdateIngredientsPayload {
  productId: number;
  ingredients: ProductIngredient[];
}
class ProductService {
  private baseUrl = '/api';

  // Transform API response to match component expectations
  private transformAPIDataToComponentData(apiCategories: APICategory[]): Category[] {
    return apiCategories.map( apiCategory => ({
      categoryId: apiCategory.categoryId, 
      categoryName: apiCategory.categoryName,
      description: apiCategory.description || '', 
      status: apiCategory.status,
      displayOrder: apiCategory.displayOrder,
      restaurantId: apiCategory.restaurantId,
      isExpanded: true, 
      products: apiCategory.products.map(apiProduct => ({
        id: apiProduct.productId, 
        name: apiProduct.name,
        description: apiProduct.description || '', 
        price: apiProduct.price,
        imageUrl: apiProduct.imageUrl || '',
        isAvailable: apiProduct.status, 
        status: apiProduct.status,
        displayOrder: apiProduct.displayOrder,
        categoryId: apiCategory.categoryId,
      }))
    }));
  }

  // Kategori listesini getirir
  async getCategories(): Promise<Category[]> {
    try {
      // Include products in the request
      const response = await httpClient.get<APICategory[]>(`${this.baseUrl}/categories`, {
        params: {
          includes: 'Products',
          onlyActive: true
        }
      });
      
      console.log("API response.data", response.data);
      
      // Transform the API response to match component expectations
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      console.log("Transformed data", transformedData);
      return transformedData;
    } catch (error: any) {
      logger.error('Kategori verileri getirilirken hata:', error);
      return [];
    }
  }

  // Kategori ekleme
  async createCategory(categoryData: {
    categoryName: string;
    status: boolean;
    displayOrder: number;
    description?: string;
  }): Promise<Category> {
    try {

      let payload: any = categoryData;
      
      logger.info('Kategori ekleme isteği gönderiliyor', { payload });
      
      try {
        const response = await httpClient.post<APICategory>(`${this.baseUrl}/categories`, payload);
        logger.info('Kategori başarıyla eklendi', { data: response.data });
        
        // Transform single category response
        const transformedCategory: Category = {
          categoryId: response.data.categoryId,
          categoryName: response.data.categoryName,
          description: response.data.description || '',
          status: response.data.status,
          displayOrder: response.data.displayOrder,
          restaurantId: response.data.restaurantId,
          isExpanded: true,
          products: []
        };
        
        return transformedCategory;
      } catch (error: any) {
        // Eğer DTO hatası alırsak, wrapper ile tekrar dene
        if (error.response?.data?.errors && error.response.data.errors.createCategoryDto) {
          logger.info('DTO wrapper gerekli, tekrar deneniyor...');
          payload = {
            createCategoryDto: categoryData
          };
          const response = await httpClient.post<APICategory>(`${this.baseUrl}/categories`, payload);
          logger.info('Kategori başarıyla eklendi (DTO wrapper ile)', { data: response.data });
          
          // Transform single category response
          const transformedCategory: Category = {
            categoryId: response.data.categoryId,
            categoryName: response.data.categoryName,
            description: response.data.description || '',
            status: response.data.status,
            displayOrder: response.data.displayOrder,
            restaurantId: response.data.restaurantId,
            isExpanded: true,
            products: []
          };
          
          return transformedCategory;
        }
        throw error;
      }
    } catch (error: any) {
      logger.error('❌ Kategori eklenirken hata:', error);
      throw error;
    }
  }

  // Ürün ekleme
  async createProduct(productData: {
    name: string;
    description?: string;
    price: number;
    categoryId: number | string; // Accept both number and string
    status: boolean;
    displayOrder: number;
    imageUrl?: string;
  }): Promise<Product> {
    try {
      // API expects direct fields without wrapper, based on Swagger
      const payload: any = {
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        categoryId: typeof productData.categoryId === 'string' 
          ? parseInt(productData.categoryId) 
          : productData.categoryId, // Ensure it's a number for API
        status: productData.status,
        displayOrder: productData.displayOrder,
      };
      
      // Only include imageUrl if it exists
      if (productData.imageUrl) {
        payload.imageUrl = productData.imageUrl;
      }
      
      logger.info('Ürün ekleme isteği gönderiliyor', { payload });
      const response = await httpClient.post<APIProduct>(`${this.baseUrl}/products`, payload);
      logger.info('Ürün başarıyla eklendi', { data: response.data });
      
      // Transform single product response
      const transformedProduct: Product = {
        id: response.data.productId,
        name: response.data.name,
        description: response.data.description || '',
        price: response.data.price,
        imageUrl: response.data.imageUrl || '',
        isAvailable: response.data.status,
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        categoryId: payload.categoryId,
      };
      
      return transformedProduct;
    } catch (error: any) {
      logger.error('❌ Ürün eklenirken hata:', error);
      throw error;
    }
  }

  // Ürün güncelleme
  async updateProduct(productId: number, productData: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    isAvailable?: boolean;
    imageUrl?: string;
    displayOrder?: number;
  }): Promise<Product> {
    try {
      const payload: any = {
        productId: productId,
        ...(productData.name && { name: productData.name }),
        ...(productData.description !== undefined && { description: productData.description }),
        ...(productData.price !== undefined && { price: productData.price }),
        ...(productData.categoryId && { categoryId: productData.categoryId }),
        ...(productData.isAvailable !== undefined && { status: productData.isAvailable }),
        ...(productData.imageUrl !== undefined && { imageUrl: productData.imageUrl }),
        ...(productData.displayOrder !== undefined && { displayOrder: productData.displayOrder })
      };

      logger.info('Ürün güncelleme isteği gönderiliyor', { productId, payload });
      const response = await httpClient.put<APIProduct>(`${this.baseUrl}/products`, payload);
      logger.info('Ürün başarıyla güncellendi', { data: response.data });

      // Transform single product response
      const transformedProduct: Product = {
        id: response.data.productId,
        name: response.data.name,
        description: response.data.description || '',
        price: response.data.price,
        imageUrl: response.data.imageUrl || '',
        isAvailable: response.data.status,
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        categoryId: response.data.categoryId,
      };

      return transformedProduct;
    } catch (error: any) {
      logger.error('❌ Ürün güncellenirken hata:', error);
      throw error;
    }
  }

  // Ürün silme (malzemeler dahil)
  async deleteProduct(productId: number): Promise<void> {
    try {
      logger.info('Ürün silme isteği gönderiliyor', { productId });
      
      // First, try to delete product ingredients (ingredientId = 0 for now)
      try {
        await this.deleteProductIngredient(productId, 0);
        logger.info('Ürün malzemeleri silindi', { productId });
      } catch (ingredientError) {
        // If ingredient deletion fails, log it but continue with product deletion
        logger.warn('Ürün malzemesi silinemedi, ürün silinmeye devam ediliyor:', ingredientError);
      }
      
      // Then delete the product itself
      const numericId = productId;
      await httpClient.delete(`${this.baseUrl}/products/${numericId}`);
      logger.info('Ürün başarıyla silindi', { productId });
    } catch (error: any) {
      logger.error('❌ Ürün silinirken hata:', error);
      throw error;
    }
  }

  // Kategori silme
  async deleteCategory(categoryId: number): Promise<void> {
    try {
      logger.info('Kategori silme isteği gönderiliyor', { categoryId });
      // Convert string ID back to number for API call
      const numericId = categoryId;
      await httpClient.delete(`${this.baseUrl}/categories/${numericId}`);
      logger.info('Kategori başarıyla silindi', { categoryId });
    } catch (error: any) {
      logger.error('❌ Kategori silinirken hata:', error);
      throw error;
    }
  }

  // Ürün malzeme silme (ingredientId şimdilik 0 olacak)
  async deleteProductIngredient(productId: number, ingredientId: number = 0): Promise<void> {
    try {
      logger.info('Ürün malzeme silme isteği gönderiliyor', { productId, ingredientId });
      const numericProductId = productId;
      await httpClient.delete(`${this.baseUrl}/products/${numericProductId}/ingredients/${ingredientId}`);
      logger.info('Ürün malzemesi başarıyla silindi', { productId, ingredientId });
    } catch (error: any) {
      logger.error('❌ Ürün malzemesi silinirken hata:', error);
      throw error;
    }
  }

  // Kategori güncelleme
  async updateCategory(categoryId: number, categoryData: {
    categoryName?: string;
    description?: string;
    status?: boolean;
    displayOrder?: number;
  }): Promise<Category> {
    try {
      const payload: any = {
        categoryId: categoryId,
        ...(categoryData.categoryName && { categoryName: categoryData.categoryName }),
        ...(categoryData.description !== undefined && { description: categoryData.description }),
        ...(categoryData.status !== undefined && { status: categoryData.status }),
        ...(categoryData.displayOrder !== undefined && { displayOrder: categoryData.displayOrder })
      };

      logger.info('Kategori güncelleme isteği gönderiliyor', { categoryId, payload });
      const response = await httpClient.put<APICategory>(`${this.baseUrl}/categories`, payload);
      logger.info('Kategori başarıyla güncellendi', { data: response.data });

      // Transform single category response
      const transformedCategory: Category = {
        categoryId: response.data.categoryId,
        categoryName: response.data.categoryName,
        description: response.data.description || '',
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        restaurantId: response.data.restaurantId,
        isExpanded: true,
        products: response.data.products?.map(apiProduct => ({
          id: apiProduct.productId,
          name: apiProduct.name,
          description: apiProduct.description || '',
          price: apiProduct.price,
          imageUrl: apiProduct.imageUrl || '',
          isAvailable: apiProduct.status,
          status: apiProduct.status,
          displayOrder: apiProduct.displayOrder,
          categoryId: response.data.categoryId,
        })) || []
      };

      return transformedCategory;
    } catch (error: any) {
      logger.error('❌ Kategori güncellenirken hata:', error);
      throw error;
    }
  }

  async reorderCategories(categoryOrders: Array<{
    categoryId: number;
    newDisplayOrder: number;
  }>): Promise<void> {
    try {
      const payload: CategoryReorderRequest = {
        categoryOrders: categoryOrders
      };

      logger.info('Kategori sıralama isteği gönderiliyor', { 
        payload,
        totalCategories: categoryOrders.length 
      });
      
      const response = await httpClient.post(`${this.baseUrl}/Categories/reorder`, payload);
      
      logger.info('Kategori sıralaması başarıyla güncellendi', { 
        updatedCategories: categoryOrders.length,
        response: response.status 
      });
    } catch (error: any) {
      logger.error('❌ Kategori sıralaması güncellenirken hata:', error);
      
      // Re-throw with more specific error message if needed
      if (error.response?.status === 400) {
        throw new Error('Geçersiz kategori sıralama verisi');
      } else if (error.response?.status === 404) {
        throw new Error('Bir veya daha fazla kategori bulunamadı');
      } else {
        throw new Error('Kategori sıralaması kaydedilirken bir hata oluştu');
      }
    }
  }
  async reorderProducts(productOrders: Array<{
      productId: number;
      newDisplayOrder: number;
    }>): Promise<void> {
      try {
        const payload: ProductReorderRequest = {
          productOrders: productOrders
        };

        logger.info('Ürün sıralama isteği gönderiliyor', { 
          payload,
          totalProducts: productOrders.length 
        });
        
        const response = await httpClient.post(`${this.baseUrl}/Products/reorder`, payload);
        
        logger.info('Ürün sıralaması başarıyla güncellendi', { 
          updatedProducts: productOrders.length,
          response: response.status 
        });
      } catch (error: any) {
        logger.error('❌ Ürün sıralaması güncellenirken hata:', error);
        
        // Re-throw with more specific error message if needed
        if (error.response?.status === 400) {
          throw new Error('Geçersiz ürün sıralama verisi');
        } else if (error.response?.status === 404) {
          throw new Error('Bir veya daha fazla ürün bulunamadı');
        } else {
          throw new Error('Ürün sıralaması kaydedilirken bir hata oluştu');
        }
      }
  }
  async addIngredientsToProduct(productId: number, ingredients: ProductIngredient[]): Promise<void> {
    try {
      const payload = {
        productId: productId,
        ingredients: ingredients // Send the full ingredient objects with quantity and unit
      };

      logger.info('Ürüne malzemeler ekleniyor', { productId, ingredients, payload });
      
      const response = await httpClient.post(`${this.baseUrl}/Products/ingredients/batch`, payload);
      
      logger.info('Ürün malzemeleri başarıyla eklendi', { 
        productId, 
        ingredientCount: ingredients.length,
        response: response.status 
      });
    } catch (error: any) {
      logger.error('❌ Ürün malzemeleri eklenirken hata:', error);
      throw error;
    }
  }

 async removeIngredientFromProduct(productId: number, ingredientId: number): Promise<void> {
    try {
      logger.info('Ürün malzemesi siliniyor', { productId, ingredientId });
      
      await httpClient.delete(`${this.baseUrl}/Products/${productId}/ingredients/${ingredientId}`);
      
      logger.info('Ürün malzemesi başarıyla silindi', { productId, ingredientId });
    } catch (error: any) {
      logger.error('❌ Ürün malzemesi silinirken hata:', error);
      throw error;
    }
  }
  
  async getProductIngredients(productId: number): Promise<any[]> {
    try {
      logger.info('Ürün malzemeleri getiriliyor', { productId });
      
      const response = await httpClient.get(`${this.baseUrl}/Products/${productId}/ingredients`);
      
      logger.info('Ürün malzemeleri başarıyla getirildi', { 
        productId, 
        ingredientCount: response.data?.length || 0 
      });
      
      return response.data || [];
    } catch (error: any) {
      logger.error('❌ Ürün malzemeleri getirilirken hata:', error);
      throw error;
    }
  }


}

export const productService = new ProductService();