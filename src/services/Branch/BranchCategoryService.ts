import { Category } from "../../types/dashboard";
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// API Request interfaces for BranchCategories
interface CreateBranchCategoryRequest {
  categoryId: number;
  isActive: boolean;
  displayName: string;
  displayOrder: number;
}

interface UpdateBranchCategoryRequest {
  branchCategoryId: number;
  isActive: boolean;
  displayName: string;
  displayOrder: number;
}

interface BranchCategoryReorderRequest {
  categoryOrders: Array<{
    branchCategoryId: number;
    newDisplayOrder: number;
  }>;
}

interface BatchUpdateRequest {
  categoryIds: number[];
}

// API Response interfaces (what the backend actually returns)
interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
  description?: string;
  categoryId: number;
}

interface APIBranchCategory {
  categoryId: number;
  categoryName: string;
  status: boolean;
  displayOrder: number;
  restaurantId: number;
  products: APIProduct[];
  description?: string;
  branchCategoryId?: number; // For operations that return this
  isActive?: boolean; // For operations that return this
  displayName?: string; // For operations that return this
}

class BranchCategoryService {
  private baseUrl = '/api/BranchCategories';

  // Transform API response to match component expectations
  private transformAPIDataToComponentData(apiCategories: APIBranchCategory[]): Category[] {
    return apiCategories.map(apiCategory => ({
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

  // Get all branch categories
  async getBranchCategories(): Promise<Category[]> {
    try {
      const response = await httpClient.get<APIBranchCategory[]>(`${this.baseUrl}`);
      
      logger.info('Branch categories retrieved successfully', { 
        count: response.data.length 
      });
      
      // Transform the API response to match component expectations
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving branch categories:', error);
      return [];
    }
  }

  // Get available categories for a specific branch
  async getAvailableCategoriesForBranch(branchId: number): Promise<Category[]> {
    try {
      const response = await httpClient.get<APIBranchCategory[]>(`${this.baseUrl}/branch/${branchId}/available-categories`);
      
      logger.info('Available categories for branch retrieved successfully', { 
        branchId,
        count: response.data.length 
      });
      
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving available categories for branch:', error);
      return [];
    }
  }

  // Get public categories for a specific branch
  async getPublicCategoriesForBranch(branchId: number): Promise<Category[]> {
    try {
      const response = await httpClient.get<APIBranchCategory[]>(`${this.baseUrl}/branch/${branchId}/public-categories`);
      
      logger.info('Public categories for branch retrieved successfully', { 
        branchId,
        count: response.data.length 
      });
      
      const transformedData = this.transformAPIDataToComponentData(response.data);
      
      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving public categories for branch:', error);
      return [];
    }
  }

  // Get specific branch category
  async getBranchCategory(branchId: number, categoryId: number): Promise<Category | null> {
    try {
      const response = await httpClient.get<APIBranchCategory>(`${this.baseUrl}/${branchId}/category/${categoryId}`);
      
      logger.info('Branch category retrieved successfully', { branchId, categoryId });
      
      // Transform single category response
      const transformedCategory: Category = {
        categoryId: response.data.categoryId,
        categoryName: response.data.categoryName,
        description: response.data.description || '',
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        restaurantId: response.data.restaurantId,
        isExpanded: true,
        products: response.data.products.map(apiProduct => ({
          id: apiProduct.productId,
          name: apiProduct.name,
          description: apiProduct.description || '',
          price: apiProduct.price,
          imageUrl: apiProduct.imageUrl || '',
          isAvailable: apiProduct.status,
          status: apiProduct.status,
          displayOrder: apiProduct.displayOrder,
          categoryId: response.data.categoryId,
        }))
      };
      
      return transformedCategory;
    } catch (error: any) {
      logger.error('Error retrieving branch category:', error);
      return null;
    }
  }

  // Create branch category
  async createBranchCategory(branchId: number, categoryData: {
    categoryId: number;
    isActive: boolean;
    displayName: string;
    displayOrder: number;
  }): Promise<Category> {
    try {
      const payload: CreateBranchCategoryRequest = categoryData;
      
      logger.info('Creating branch category', { branchId, payload });
      
      try {
        const response = await httpClient.post<APIBranchCategory>(`${this.baseUrl}/${branchId}`, payload);
        logger.info('Branch category created successfully', { branchId, data: response.data });
        
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
        // Handle potential DTO wrapper requirements similar to ProductService
        if (error.response?.data?.errors && error.response.data.errors.createBranchCategoryDto) {
          logger.info('DTO wrapper required, retrying...');
          const wrappedPayload = {
            createBranchCategoryDto: categoryData
          };
          const response = await httpClient.post<APIBranchCategory>(`${this.baseUrl}/${branchId}`, wrappedPayload);
          logger.info('Branch category created successfully (with DTO wrapper)', { branchId, data: response.data });
          
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
      logger.error('❌ Error creating branch category:', error);
      throw error;
    }
  }

  // Update branch category
  async updateBranchCategory(branchId: number, branchCategoryData: {
    branchCategoryId: number;
    isActive?: boolean;
    displayName?: string;
    displayOrder?: number;
  }): Promise<Category> {
    try {
      const payload: UpdateBranchCategoryRequest = {
        branchCategoryId: branchCategoryData.branchCategoryId,
        isActive: branchCategoryData.isActive ?? true,
        displayName: branchCategoryData.displayName ?? '',
        displayOrder: branchCategoryData.displayOrder ?? 0
      };

      logger.info('Updating branch category', { branchId, payload });
      const response = await httpClient.put<APIBranchCategory>(`${this.baseUrl}/${branchId}`, payload);
      logger.info('Branch category updated successfully', { branchId, data: response.data });

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
      logger.error('❌ Error updating branch category:', error);
      throw error;
    }
  }

  // Delete branch category
  async deleteBranchCategory(id: number): Promise<void> {
    try {
      logger.info('Deleting branch category', { id });
      await httpClient.delete(`${this.baseUrl}/${id}`);
      logger.info('Branch category deleted successfully', { id });
    } catch (error: any) {
      logger.error('❌ Error deleting branch category:', error);
      throw error;
    }
  }

  // Reorder branch categories
  async reorderBranchCategories(categoryOrders: Array<{
    branchCategoryId: number;
    newDisplayOrder: number;
  }>): Promise<void> {
    try {
      const payload: BranchCategoryReorderRequest = {
        categoryOrders: categoryOrders
      };

      logger.info('Reordering branch categories', { 
        payload,
        totalCategories: categoryOrders.length 
      });
      
      const response = await httpClient.post(`${this.baseUrl}/reorder`, payload);
      
      logger.info('Branch categories reordered successfully', { 
        updatedCategories: categoryOrders.length,
        response: response.status 
      });
    } catch (error: any) {
      logger.error('❌ Error reordering branch categories:', error);
      
      // Re-throw with more specific error message if needed
      if (error.response?.status === 400) {
        throw new Error('Invalid branch category reorder data');
      } else if (error.response?.status === 404) {
        throw new Error('One or more branch categories not found');
      } else {
        throw new Error('Error occurred while saving branch category order');
      }
    }
  }

  // Batch update branch categories
  async batchUpdateBranchCategories(categoryIds: number[]): Promise<void> {
    try {
      const payload: BatchUpdateRequest = {
        categoryIds: categoryIds
      };

      logger.info('Batch updating branch categories', { 
        payload,
        totalCategories: categoryIds.length 
      });
      
      const response = await httpClient.post(`${this.baseUrl}/batch-update`, payload);
      
      logger.info('Branch categories batch updated successfully', { 
        updatedCategories: categoryIds.length,
        response: response.status 
      });
    } catch (error: any) {
      logger.error('❌ Error batch updating branch categories:', error);
      
      // Re-throw with more specific error message if needed
      if (error.response?.status === 400) {
        throw new Error('Invalid batch update data');
      } else if (error.response?.status === 404) {
        throw new Error('One or more categories not found');
      } else {
        throw new Error('Error occurred while batch updating categories');
      }
    }
  }
}

export const branchCategoryService = new BranchCategoryService();