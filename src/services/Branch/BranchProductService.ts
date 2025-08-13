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

// API Response interfaces (what the backend actually returns)
interface APIBranchProduct {
  branchProductId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  description?: string;
  branchCategoryId: number;
  status?: boolean; // Sometimes returned as status instead of isActive
}

class BranchProductService {
  private baseUrl = '/api/BranchProducts';

  // Transform API response to match component expectations
  private transformAPIDataToComponentData(apiBranchProducts: APIBranchProduct[]): Product[] {
    return apiBranchProducts.map(apiBranchProduct => ({
      id: apiBranchProduct.branchProductId || apiBranchProduct.productId,
      name: apiBranchProduct.name,
      description: apiBranchProduct.description || '',
      price: apiBranchProduct.price,
      imageUrl: apiBranchProduct.imageUrl || '',
      isAvailable: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      status: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      displayOrder: apiBranchProduct.displayOrder || 0,
      categoryId: apiBranchProduct.branchCategoryId,
      // Add branch-specific fields if needed
      branchProductId: apiBranchProduct.branchProductId,
      originalProductId: apiBranchProduct.productId
    }));
  }

  // Transform single product response
  private transformSingleProduct(apiBranchProduct: APIBranchProduct): Product {
    return {
      id: apiBranchProduct.branchProductId || apiBranchProduct.productId,
      name: apiBranchProduct.name,
      description: apiBranchProduct.description || '',
      price: apiBranchProduct.price,
      imageUrl: apiBranchProduct.imageUrl || '',
      isAvailable: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      status: apiBranchProduct.isActive ?? apiBranchProduct.status ?? true,
      displayOrder: apiBranchProduct.displayOrder || 0,
      categoryId: apiBranchProduct.branchCategoryId,
      // Add branch-specific fields if needed
      branchProductId: apiBranchProduct.branchProductId,
      originalProductId: apiBranchProduct.productId
    };
  }

  // Get all branch products
  async getBranchProducts(): Promise<Product[]> {
    try {
      const response = await httpClient.get<APIBranchProduct[]>(`${this.baseUrl}`);
      
      logger.info('Branch products retrieved successfully', { 
        count: response.data.length 
      });
      
      // Transform the API response to match component expectations
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving branch products:', error);
      return [];
    }
  }

  // Get specific branch product
  async getBranchProduct(id: number): Promise<Product | null> {
    try {
      const response = await httpClient.get<APIBranchProduct>(`${this.baseUrl}/${id}`);
      
      logger.info('Branch product retrieved successfully', { id });
      
      const transformedProduct = this.transformSingleProduct(response.data);
      
      return transformedProduct;
    } catch (error: any) {
      logger.error('Error retrieving branch product:', error);
      return null;
    }
  }

  // Get menu for specific branch
  async getBranchMenu(branchId: number): Promise<Product[]> {
    try {
      const response = await httpClient.get<APIBranchProduct[]>(`${this.baseUrl}/branch/${branchId}/menu`);
      
      logger.info('Branch menu retrieved successfully', { 
        branchId,
        count: response.data.length 
      });
      
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      return transformedData;
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
        const response = await httpClient.post<APIBranchProduct>(`${this.baseUrl}`, payload);
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
          const response = await httpClient.post<APIBranchProduct>(`${this.baseUrl}`, wrappedPayload);
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
      const payload: UpdateBranchProductRequest = {
        branchProductId: productData.branchProductId ?? id,
        price: productData.price ?? 0,
        isActive: productData.isActive ?? true,
        displayOrder: productData.displayOrder ?? 0,
        branchCategoryId: productData.branchCategoryId ?? 0
      };

      logger.info('Updating branch product', { id, payload });
      const response = await httpClient.put<APIBranchProduct>(`${this.baseUrl}/${id}`, payload);
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