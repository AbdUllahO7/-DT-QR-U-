import { Product } from "../../types/dashboard";
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// API Request interfaces for BranchProducts
interface CreateBranchProductRequest {
  price: number;
  isActive: boolean;
  productId: number;
  branchCategoryId: number;
}

interface UpdateBranchProductRequest {
  branchProductId: number;
  price: number;
  isActive: boolean;
  displayOrder: number;
  branchCategoryId: number;
}

interface BranchProductReorderRequest {
  productOrders: Array<{
    branchProductId: number;
    newDisplayOrder: number;
  }>;
}

// Updated API Response interfaces to match actual API structure
interface APIAllergen {
  id?: number;
  allergenId: number;
  code: string;
  allergenCode?: string;
  name: string;
  icon: string;
  description?: string | null;
  productCount?: number;
  containsAllergen?: boolean;
  presence?: number;
  note: string;
}

interface APIIngredient {
  id: number;
  productId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergens: APIAllergen[];
}

interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
}

interface APIBranchCategory {
  id: number;
  branchCategoryId: number;
  branchId: number;
  categoryId: number;
  displayName: string;
  displayOrder: number;
  isActive: boolean;
}

interface APIBranchProduct {
  branchProductId: number;
  price: number;
  isActive: boolean;
  displayOrder: number;
  productId: number;
  product?: APIProduct;
  branchId: number;
  branch?: any;
  branchCategoryId: number;
  branchCategory?: APIBranchCategory;
  orderDetails?: any;
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
}

// Simple API response for basic endpoints
interface SimpleBranchProduct {
  branchProductId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  description?: string;
  branchCategoryId: number;
  status?: boolean;
}

class BranchProductService {
  private baseUrl = '/api/BranchProducts';

  // Transform complex API response with includes to match component expectations
  private transformComplexAPIDataToComponentData(apiBranchProducts: APIBranchProduct[]): Product[] {
    return apiBranchProducts.map(apiBranchProduct => ({
      productId: apiBranchProduct.branchProductId,
      name: apiBranchProduct.product?.name || `Product ${apiBranchProduct.productId}`,
      description: '', // Description not available in this API structure
      price: apiBranchProduct.price,
      imageUrl: apiBranchProduct.product?.imageUrl || '',
      isAvailable: apiBranchProduct.isActive,
      status: apiBranchProduct.isActive,
      displayOrder: apiBranchProduct.displayOrder,
      categoryId: apiBranchProduct.branchCategoryId,
      // Add branch-specific fields
      branchProductId: apiBranchProduct.branchProductId,
      originalProductId: apiBranchProduct.productId,
      // Add nested data if available
      product: apiBranchProduct.product,
      branchCategory: apiBranchProduct.branchCategory,
      ingredients: apiBranchProduct.ingredients,
      allergens: apiBranchProduct.allergens,
      orderDetails: apiBranchProduct.orderDetails
    }));
  }

  // Transform simple API response to match component expectations
  private transformSimpleAPIDataToComponentData(apiBranchProducts: SimpleBranchProduct[]): Product[] {
    return apiBranchProducts.map(apiBranchProduct => ({
      productId: apiBranchProduct.branchProductId || apiBranchProduct.productId,
      name: apiBranchProduct.name,
      description: apiBranchProduct.description || '',
      price: apiBranchProduct.price,
      imageUrl: apiBranchProduct.imageUrl || '',
      isAvailable: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      status: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      displayOrder: apiBranchProduct.displayOrder || 0,
      categoryId: apiBranchProduct.branchCategoryId,
      branchProductId: apiBranchProduct.branchProductId,
      originalProductId: apiBranchProduct.productId
    }));
  }

  // Transform single product response
  private transformSingleProduct(apiBranchProduct: SimpleBranchProduct): Product {
    return {
      productId: apiBranchProduct.branchProductId || apiBranchProduct.productId,
      name: apiBranchProduct.name,
      description: apiBranchProduct.description || '',
      price: apiBranchProduct.price,
      imageUrl: apiBranchProduct.imageUrl || '',
      isAvailable: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      status: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      displayOrder: apiBranchProduct.displayOrder || 0,
      categoryId: apiBranchProduct.branchCategoryId,
      branchProductId: apiBranchProduct.branchProductId,
      originalProductId: apiBranchProduct.productId
    };
  }

  // Get all branch products with optional includes
  async getBranchProducts(includes?: string[]): Promise<Product[]> {
    try {
      let url = this.baseUrl;
      
      // Add includes parameter if provided
      if (includes && includes.length > 0) {
        const includesParam = includes.join(', ');
        url += `?includes=${encodeURIComponent(includesParam)}`;
        
        logger.info('Fetching branch products with includes', { 
          includes: includesParam,
          url 
        });
      }
      
      const response = await httpClient.get<APIBranchProduct[]>(url);
      
      logger.info('Branch products retrieved successfully', { 
        count: response.data.length,
        hasIncludes: !!includes?.length
      });
      
      // Determine if response has complex structure (with includes) or simple structure
      const firstItem = response.data[0];
      const hasComplexStructure = firstItem && (
        firstItem.product || 
        firstItem.branchCategory || 
        firstItem.ingredients || 
        firstItem.allergens
      );
      
      if (hasComplexStructure) {
        logger.info('Using complex transformation for response with includes');
        return this.transformComplexAPIDataToComponentData(response.data);
      } else {
        logger.info('Using simple transformation for basic response');
        return this.transformSimpleAPIDataToComponentData(response.data as unknown as SimpleBranchProduct[]);
      }
      
    } catch (error: any) {
      logger.error('Error retrieving branch products:', error);
      return [];
    }
  }

  // Convenience method to get products with full details
  async getBranchProductsWithDetails(): Promise<Product[]> {
    return this.getBranchProducts(['product', 'branchCategory', 'ingredients', 'allergens', 'orderDetails']);
  }

  // Convenience method to get products with ingredients and allergens
  async getBranchProductsWithIngredientsAndAllergens(): Promise<Product[]> {
    return this.getBranchProducts(['ingredients', 'allergens']);
  }

  // Get specific branch product
  async getBranchProduct(id: number): Promise<Product | null> {
    try {
      const response = await httpClient.get<SimpleBranchProduct>(`${this.baseUrl}/${id}`);
      
      logger.info('Branch product retrieved successfully', { id });
      
      const transformedProduct = this.transformSingleProduct(response.data);
      
      return transformedProduct;
    } catch (error: any) {
      logger.error('Error retrieving branch product:', error);
      return null;
    }
  }

  // Get menu for specific branch
  async getBranchMenu(branchId: number, includes?: string[]): Promise<Product[]> {
    try {
      let url = `${this.baseUrl}/branch/${branchId}/menu`;
      
      // Add includes parameter if provided
      if (includes && includes.length > 0) {
        const includesParam = includes.join(', ');
        url += `?includes=${encodeURIComponent(includesParam)}`;
      }
      
      const response = await httpClient.get<APIBranchProduct[]>(url);
      
      logger.info('Branch menu retrieved successfully', { 
        branchId,
        count: response.data.length,
        hasIncludes: !!includes?.length
      });
      
      // Determine transformation method based on response structure
      const firstItem = response.data[0];
      const hasComplexStructure = firstItem && (
        firstItem.product || 
        firstItem.branchCategory || 
        firstItem.ingredients || 
        firstItem.allergens
      );
      
      if (hasComplexStructure) {
        return this.transformComplexAPIDataToComponentData(response.data);
      } else {
        return this.transformSimpleAPIDataToComponentData(response.data as unknown as SimpleBranchProduct[]);
      }
      
    } catch (error: any) {
      logger.error('Error retrieving branch menu:', error);
      return [];
    }
  }

  // Create branch product
  async createBranchProduct(productData: {
    price: number;
    isActive: boolean;
    productId: number;
    branchCategoryId: number;
  }): Promise<Product> {
    try {
      const payload: CreateBranchProductRequest = productData;
      
      logger.info('Creating branch product', { payload });
      
      try {
        const response = await httpClient.post<SimpleBranchProduct>(`${this.baseUrl}`, payload);
        logger.info('Branch product created successfully', { data: response.data });
        
        const transformedProduct = this.transformSingleProduct(response.data);
        
        return transformedProduct;
      } catch (error: any) {
        // Handle potential DTO wrapper requirements similar to other services
        if (error.response?.data?.errors && error.response.data.errors.createBranchProductDto) {
          logger.info('DTO wrapper required, retrying...');
          const wrappedPayload = {
            createBranchProductDto: productData
          };
          const response = await httpClient.post<SimpleBranchProduct>(`${this.baseUrl}`, wrappedPayload);
          logger.info('Branch product created successfully (with DTO wrapper)', { data: response.data });
          
          const transformedProduct = this.transformSingleProduct(response.data);
          
          return transformedProduct;
        }
        throw error;
      }
    } catch (error: any) {
      logger.error('❌ Error creating branch product:', error);
      throw error;
    }
  }

  // Update branch product
  async updateBranchProduct(id: number, productData: {
    branchProductId?: number;
    price?: number;
    isActive?: boolean;
    displayOrder?: number;
    branchCategoryId?: number;
  }): Promise<Product> {
    try {
      console.log("productData",productData)
      const payload: UpdateBranchProductRequest = {
        branchProductId: productData.branchProductId ?? id,
        price: productData.price ?? 0,
        isActive: productData.isActive ?? true,
        displayOrder: productData.displayOrder ?? 0,
        branchCategoryId: productData.branchCategoryId ?? 0
      };

      logger.info('Updating branch product', { id, payload });
      const response = await httpClient.put<SimpleBranchProduct>(`${this.baseUrl}/${id}`, payload);
      logger.info('Branch product updated successfully', { id, data: response.data });

      const transformedProduct = this.transformSingleProduct(response.data);

      return transformedProduct;
    } catch (error: any) {
      logger.error('❌ Error updating branch product:', error);
      throw error;
    }
  }

  // Delete branch product
  async deleteBranchProduct(id: number): Promise<void> {
    try {
      logger.info('Deleting branch product', { id });
      await httpClient.delete(`${this.baseUrl}/${id}`);
      logger.info('Branch product deleted successfully', { id });
    } catch (error: any) {
      logger.error('❌ Error deleting branch product:', error);
      throw error;
    }
  }

  // Reorder branch products
  async reorderBranchProducts(productOrders: Array<{
    branchProductId: number;
    newDisplayOrder: number;
  }>): Promise<void> {
    try {
      const payload: BranchProductReorderRequest = {
        productOrders: productOrders
      };

      logger.info('Reordering branch products', { 
        payload,
        totalProducts: productOrders.length 
      });
      
      const response = await httpClient.post(`${this.baseUrl}/reorder`, payload);
      
      logger.info('Branch products reordered successfully', { 
        updatedProducts: productOrders.length,
        response: response.status 
      });
    } catch (error: any) {
      logger.error('❌ Error reordering branch products:', error);
      
      // Re-throw with more specific error message if needed
      if (error.response?.status === 400) {
        throw new Error('Invalid branch product reorder data');
      } else if (error.response?.status === 404) {
        throw new Error('One or more branch products not found');
      } else {
        throw new Error('Error occurred while saving branch product order');
      }
    }
  }

  // Helper method to activate multiple products
  async activateBranchProducts(branchProductIds: number[]): Promise<void> {
    try {
      logger.info('Activating multiple branch products', { branchProductIds });
      
      const updatePromises = branchProductIds.map(id => 
        this.updateBranchProduct(id, { isActive: true })
      );
      
      await Promise.all(updatePromises);
      
      logger.info('Branch products activated successfully', { 
        count: branchProductIds.length 
      });
    } catch (error: any) {
      logger.error('❌ Error activating branch products:', error);
      throw error;
    }
  }

  // Helper method to deactivate multiple products
  async deactivateBranchProducts(branchProductIds: number[]): Promise<void> {
    try {
      logger.info('Deactivating multiple branch products', { branchProductIds });
      
      const updatePromises = branchProductIds.map(id => 
        this.updateBranchProduct(id, { isActive: false })
      );
      
      await Promise.all(updatePromises);
      
      logger.info('Branch products deactivated successfully', { 
        count: branchProductIds.length 
      });
    } catch (error: any) {
      logger.error('❌ Error deactivating branch products:', error);
      throw error;
    }
  }

  // Helper method to update prices for multiple products
  async updateBranchProductPrices(updates: Array<{
    branchProductId: number;
    newPrice: number;
  }>): Promise<void> {
    try {
      logger.info('Updating multiple branch product prices', { updates });
      
      const updatePromises = updates.map(update => 
        this.updateBranchProduct(update.branchProductId, { 
          price: update.newPrice 
        })
      );
      
      await Promise.all(updatePromises);
      
      logger.info('Branch product prices updated successfully', { 
        count: updates.length 
      });
    } catch (error: any) {
      logger.error('❌ Error updating branch product prices:', error);
      throw error;
    }
  }
}

export const branchProductService = new BranchProductService();