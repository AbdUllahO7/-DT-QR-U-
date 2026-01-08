import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  CategoryTranslation,
  UpsertCategoryTranslationDto,
  BatchUpsertCategoryTranslationsDto,
} from '../../types/Translations/type';

class CategoryTranslationService {
  private baseUrl = '/api/category-translations';

  async getCategoryTranslations(categoryId: number): Promise<CategoryTranslation[]> {
    try {
      logger.info('Fetching category translations', { categoryId }, { prefix: 'CategoryTranslationService' });
      const response = await httpClient.get<CategoryTranslation[]>(`${this.baseUrl}/${categoryId}`);
      logger.info('Category translations fetched successfully', { categoryId, count: response.data.length }, { prefix: 'CategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching category translations', error, { prefix: 'CategoryTranslationService' });
      throw this.handleError(error, 'Error fetching category translations');
    }
  }

  async getCategoryTranslation(categoryId: number, languageCode: string): Promise<CategoryTranslation> {
    try {
      logger.info('Fetching category translation', { categoryId, languageCode }, { prefix: 'CategoryTranslationService' });
      const response = await httpClient.get<CategoryTranslation>(`${this.baseUrl}/${categoryId}/${languageCode}`);
      logger.info('Category translation fetched successfully', { categoryId, languageCode }, { prefix: 'CategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching category translation', error, { prefix: 'CategoryTranslationService' });
      throw this.handleError(error, 'Error fetching category translation');
    }
  }

  async upsertCategoryTranslation(data: UpsertCategoryTranslationDto): Promise<CategoryTranslation> {
    try {
      logger.info('Upserting category translation', { data }, { prefix: 'CategoryTranslationService' });
      const response = await httpClient.put<CategoryTranslation>(`${this.baseUrl}`, data);
      logger.info('Category translation upserted successfully', { data }, { prefix: 'CategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting category translation', error, { prefix: 'CategoryTranslationService' });
      throw this.handleError(error, 'Error upserting category translation');
    }
  }

  async batchUpsertCategoryTranslations(data: BatchUpsertCategoryTranslationsDto): Promise<CategoryTranslation[]> {
    try {
      logger.info('Batch upserting category translations', { count: data.translations.length }, { prefix: 'CategoryTranslationService' });
      const response = await httpClient.put<CategoryTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'CategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting category translations', error, { prefix: 'CategoryTranslationService' });
      throw this.handleError(error, 'Error batch upserting category translations');
    }
  }

  async deleteCategoryTranslation(categoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting category translation', { categoryId, languageCode }, { prefix: 'CategoryTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${categoryId}/${languageCode}`);
      logger.info('Category translation deleted successfully', { categoryId, languageCode }, { prefix: 'CategoryTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting category translation', error, { prefix: 'CategoryTranslationService' });
      throw this.handleError(error, 'Error deleting category translation');
    }
  }

  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Validation error: ${validationErrors.join(', ')}`);
      } else {
        throw new Error(error.message || defaultMessage);
      }
    } else if (error?.response?.status === 401) {
      throw new Error('Session expired. Please log in again.');
    } else if (error?.response?.status === 403) {
      throw new Error('You do not have permission for this operation.');
    } else if (error?.response?.status === 404) {
      throw new Error('Translation not found.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('Please check your internet connection.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Unknown error'}`);
    }
  }
}

export const categoryTranslationService = new CategoryTranslationService();
