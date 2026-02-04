import { Category } from "../../types/BranchManagement/type";
import { httpClient, getEffectiveBranchId } from "../../utils/http";
import { logger } from "../../utils/logger";

// API Request interfaces for BranchCategories
interface CreateBranchCategoryRequest {
  categoryId: number;
  isActive: boolean;
  displayName: string;
  displayOrder: number;
}
interface DeletedBranchCategory {
  id: number;
  displayName: string;
  description: string;
  code: string | null;
  entityType: string;
  deletedAt: string;
  deletedBy: string;
  branchId: number;
  branchName: string | null;
  restaurantId: number | null;
  restaurantName: string | null;
  categoryId: number | null;
  categoryName: string | null;
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


interface GetAvailableProductsRequest {
  categoryId?: number; 
  onlyActive?: boolean; 
  includes?: string; 
}

interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
  description?: string;
  categoryId: number;
  maxQuantity?: number;
}

interface APIBranchCategory {
  categoryId: number;
  categoryName: string;
  status: boolean;
  displayOrder: number;
  restaurantId: number;
  products: APIProduct[];
  description: string;
  branchCategoryId?: number;
  isActive?: boolean;
  displayName?: string;
  isExpanded?: boolean;
}

class BranchCategoryService {
  private baseUrl = '/api/BranchCategories';
  private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }
  // Transform API response to match component expectations
  private transformAPIDataToComponentData(apiCategories: APIBranchCategory[]): Category[] {
    return apiCategories.map(apiCategory => ({
      categoryId: apiCategory.categoryId,
      categoryName: apiCategory.categoryName,
      description: apiCategory.description || '',
      status: apiCategory.status,
      displayOrder: apiCategory.displayOrder,
      restaurantId: apiCategory.restaurantId,
      isExpanded: apiCategory.isExpanded ?? true,
      products: apiCategory.products?.map(apiProduct => ({
        id: apiProduct.productId,
        name: apiProduct.name,
        description: apiProduct.description || '',
        price: apiProduct.price,
        imageUrl: apiProduct.imageUrl || '',
        isAvailable: apiProduct.status,
        status: apiProduct.status,
        displayOrder: apiProduct.displayOrder,
        categoryId: apiCategory.categoryId,
        maxQuantity: apiProduct.maxQuantity,
      })) || [],
      productId: undefined,
      name: undefined
    }));
  }


  async getAvailableProductsForBranch(params: GetAvailableProductsRequest): Promise<Category[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const { categoryId, onlyActive, includes  } = params;
      const language = this.getLanguageFromStorage();
      const queryParams = new URLSearchParams();
      if (branchId) queryParams.append('branchId', branchId.toString());
      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (onlyActive !== undefined) queryParams.append('onlyActive', onlyActive.toString());
      if (includes) queryParams.append('includes', includes);
      if (language) queryParams.append('language', language);

      const response = await httpClient.get(`/api/BranchProducts/branch/available-products?${queryParams.toString()}`);

      logger.info('Available products for branch retrieved successfully', {
        branchId,
        categoryId,
        onlyActive,
        includes,
        count: response.data.length
      });

      return response.data;
    } catch (error: any) {
      logger.error('Error retrieving available products for branch:', error);
      return [];
    }
  }

  async getAvailableCategoriesForBranch(): Promise<Category[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();
      const params = new URLSearchParams({
        includes: "products",
      });
      if (branchId) params.append('branchId', branchId.toString());
      if (language) params.append('language', language);

      const response = await httpClient.get<APIBranchCategory[]>(`${this.baseUrl}/branch/available-categories?${params.toString()}`);
      logger.info('Available categories for branch retrieved successfully', {
        count: response.data.length,
        branchId
      });

      const transformedData = this.transformAPIDataToComponentData(response.data);
      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving available categories for branch:', error);
      return [];
    }
  }

  async getBranchCategories(): Promise<Category[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();
                  
      const params: any = {
        includeInactive: true,
        language :language
      };

      // Add branchId if available
      if (branchId) {
        params.branchId = branchId;
      }

      const response = await httpClient.get(`${this.baseUrl}`, { params });
      logger.info('Branch categories retrieved successfully', {
        count: response.data,
        branchId
      });
      return response.data;
    } catch (error: any) {
      logger.error('Error retrieving branch categories:', error);
      return [];
    }
  }

  async getPublicCategoriesForBranch(branchId?: number): Promise<Category[]> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      if (!effectiveBranchId) {
        throw new Error('Branch ID is required');
      }

      const response = await httpClient.get<APIBranchCategory[]>(`${this.baseUrl}/branch/${effectiveBranchId}/public-categories`, {
        params: {
          language
        }
      });

      logger.info('Public categories for branch retrieved successfully', {
        branchId: effectiveBranchId,
        count: response.data.length
      });

      const transformedData = this.transformAPIDataToComponentData(response.data);

      return transformedData;
    } catch (error: any) {
      logger.error('Error retrieving public categories for branch:', error);
      return [];
    }
  }

  async getBranchCategory(categoryId: number): Promise<Category | null> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      const params = branchId ? { branchId, language } : { language };
      const response = await httpClient.get<APIBranchCategory>(`${this.baseUrl}/category/${categoryId}`, { params });

      logger.info('Branch category retrieved successfully', { categoryId, branchId });

      const transformedCategory: Category = {
        categoryId: response.data.categoryId,
        categoryName: response.data.categoryName,
        description: response.data.description || '',
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        restaurantId: response.data.restaurantId,
        isExpanded: true,
        products: response.data.products.map(apiProduct => ({
          productId: apiProduct.productId,
          id: apiProduct.productId,
          name: apiProduct.name,
          description: apiProduct.description || '',
          price: apiProduct.price,
          imageUrl: apiProduct.imageUrl || '',
          isAvailable: apiProduct.status,
          status: apiProduct.status,
          displayOrder: apiProduct.displayOrder,
          categoryId: response.data.categoryId,
          originalProductId: apiProduct.productId,
        })),
        productId: undefined,
        name: undefined
      };

      return transformedCategory;
    } catch (error: any) {
      logger.error('Error retrieving branch category:', error);
      return null;
    }
  }

  async createBranchCategory(categoryData: {
    categoryId: number;
    isActive: boolean;
    displayName: string;
    displayOrder: number;
  }): Promise<Category> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload: CreateBranchCategoryRequest = categoryData;

      logger.info('Creating branch category', { payload, branchId });

      try {
        const params = branchId ? { branchId } : {};
        const response = await httpClient.post(`${this.baseUrl}`, payload, { params });
        logger.info('Branch category created successfully', { data: response.data, branchId });
        return response.data;
      } catch (error: any) {
        if (error.response?.data?.errors && error.response.data.errors.createBranchCategoryDto) {
          logger.info('DTO wrapper required, retrying...');
          const wrappedPayload = {
            createBranchCategoryDto: categoryData
          };
          const params = branchId ? { branchId } : {};
          const response = await httpClient.post<APIBranchCategory>(`${this.baseUrl}`, wrappedPayload, { params });
          logger.info('Branch category created successfully (with DTO wrapper)', { data: response.data, branchId });

          const transformedCategory: Category = {
            categoryId: response.data.categoryId,
            categoryName: response.data.categoryName,
            description: response.data.description || '',
            status: response.data.status,
            displayOrder: response.data.displayOrder,
            restaurantId: response.data.restaurantId,
            isExpanded: true,
            products: [],
            productId: undefined,
            name: undefined
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

  async updateBranchCategory(branchCategoryData: {
    branchCategoryId: number;
    isActive?: boolean;
    displayName?: string;
    displayOrder?: number;
  }): Promise<Category> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload: UpdateBranchCategoryRequest = {
        branchCategoryId: branchCategoryData.branchCategoryId,
        isActive: branchCategoryData.isActive ?? true,
        displayName: branchCategoryData.displayName ?? '',
        displayOrder: branchCategoryData.displayOrder ?? 0
      };

      logger.info('Updating branch category', { payload, branchId });
      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<APIBranchCategory>(`${this.baseUrl}`, payload, { params });
      logger.info('Branch category updated successfully', { data: response.data, branchId });

      const transformedCategory: Category = {
        categoryId: response.data.categoryId,
        categoryName: response.data.categoryName,
        description: response.data.description || '',
        status: response.data.status,
        displayOrder: response.data.displayOrder,
        restaurantId: response.data.restaurantId,
        isExpanded: true,
        products: response.data.products?.map(apiProduct => ({
          productId: apiProduct.productId,
          id: apiProduct.productId,
          name: apiProduct.name,
          description: apiProduct.description || '',
          price: apiProduct.price,
          imageUrl: apiProduct.imageUrl || '',
          isAvailable: apiProduct.status,
          status: apiProduct.status,
          displayOrder: apiProduct.displayOrder,
          categoryId: response.data.categoryId,
        })) || [],
        productId: undefined,
        name: undefined
      };

      return transformedCategory;
    } catch (error: any) {
      logger.error('❌ Error updating branch category:', error);
      throw error;
    }
  }

  async deleteBranchCategory(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Deleting branch category', { id, branchId });
      await httpClient.delete(`${this.baseUrl}`, {
        params: { id, ...(branchId && { branchId }) }
      });
      logger.info('Branch category deleted successfully', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Error deleting branch category:', error);
      throw error;
    }
  }

  async reorderBranchCategories(categoryOrders: Array<{
    branchCategoryId: number;
    newDisplayOrder: number;
  }>): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload: BranchCategoryReorderRequest = {
        categoryOrders: categoryOrders
      };

      logger.info('Reordering branch categories', {
        payload,
        totalCategories: categoryOrders.length,
        branchId
      });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post(`${this.baseUrl}/reorder`, payload, { params });

      logger.info('Branch categories reordered successfully', {
        updatedCategories: categoryOrders.length,
        response: response.status,
        branchId
      });
    } catch (error: any) {
      logger.error('❌ Error reordering branch categories:', error);

      if (error.response?.status === 400) {
        throw new Error('Invalid branch category reorder data');
      } else if (error.response?.status === 404) {
        throw new Error('One or more branch categories not found');
      } else {
        throw new Error('Error occurred while saving branch category order');
      }
    }
  }

  async batchUpdateBranchCategories(categoryIds: number[]): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      const payload: BatchUpdateRequest = {
        categoryIds: categoryIds
      };

      logger.info('Batch updating branch categories', {
        payload,
        totalCategories: categoryIds.length,
        branchId
      });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post(`${this.baseUrl}/batch-update`, payload, { params });

      logger.info('Branch categories batch updated successfully', {
        updatedCategories: categoryIds.length,
        response: response.status,
        branchId
      });
    } catch (error: any) {
      logger.error('❌ Error batch updating branch categories:', error);

      if (error.response?.status === 400) {
        throw new Error('Invalid batch update data');
      } else if (error.response?.status === 404) {
        throw new Error('One or more categories not found');
      } else {
        throw new Error('Error occurred while batch updating categories');
      }
    }
  }
  // Get all deleted branch categories
  async getDeletedBranchCategories(): Promise<DeletedBranchCategory[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Fetching deleted branch categories', { branchId });

      const params = branchId ? { branchId, language } : { language };
      const response = await httpClient.get<DeletedBranchCategory[]>(`${this.baseUrl}/deleted`, { params });

      logger.info('Deleted branch categories retrieved successfully', {
        count: response.data.length,
        branchId
      });

      return response.data;
    } catch (error: any) {
      logger.error('❌ Error retrieving deleted branch categories:', error);
      return [];
    }
  }

  // Restore a deleted branch category
  async restoreBranchCategory(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Restoring branch category', { id, branchId });

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/${id}/restore`, {}, { params });

      logger.info('Branch category restored successfully', { id, branchId });
    } catch (error: any) {
      logger.error('❌ Error restoring branch category:', error);
      throw error;
    }
  }
}

export const branchCategoryService = new BranchCategoryService();