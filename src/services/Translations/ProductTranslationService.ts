import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  ProductTranslation,
  UpsertProductTranslationDto,
  BatchUpsertProductTranslationsDto,
} from '../../types/Translations/type';

class ProductTranslationService {
  private baseUrl = '/api/product-translations';

  async getProductTranslations(productId: number): Promise<ProductTranslation[]> {
    try {
      logger.info('Fetching product translations', { productId }, { prefix: 'ProductTranslationService' });
      const response = await httpClient.get<ProductTranslation[]>(`${this.baseUrl}/${productId}`);
      logger.info('Product translations fetched successfully', { productId, count: response.data.length }, { prefix: 'ProductTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product translations', error, { prefix: 'ProductTranslationService' });
      throw this.handleError(error, 'Error fetching product translations');
    }
  }

  async getProductTranslation(productId: number, languageCode: string): Promise<ProductTranslation> {
    try {
      logger.info('Fetching product translation', { productId, languageCode }, { prefix: 'ProductTranslationService' });
      const response = await httpClient.get<ProductTranslation>(`${this.baseUrl}/${productId}/${languageCode}`);
      logger.info('Product translation fetched successfully', { productId, languageCode }, { prefix: 'ProductTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product translation', error, { prefix: 'ProductTranslationService' });
      throw this.handleError(error, 'Error fetching product translation');
    }
  }

  async upsertProductTranslation(data: UpsertProductTranslationDto): Promise<ProductTranslation> {
    try {
      logger.info('Upserting product translation', { data }, { prefix: 'ProductTranslationService' });
      const response = await httpClient.put<ProductTranslation>(`${this.baseUrl}`, data);
      logger.info('Product translation upserted successfully', { data }, { prefix: 'ProductTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting product translation', error, { prefix: 'ProductTranslationService' });
      throw this.handleError(error, 'Error upserting product translation');
    }
  }

  async batchUpsertProductTranslations(data: BatchUpsertProductTranslationsDto): Promise<ProductTranslation[]> {
    try {
      logger.info('Batch upserting product translations', { count: data.translations.length }, { prefix: 'ProductTranslationService' });
      const response = await httpClient.put<ProductTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Product translations batch upserted successfully', { count: data.translations.length }, { prefix: 'ProductTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting product translations', error, { prefix: 'ProductTranslationService' });
      throw this.handleError(error, 'Error batch upserting product translations');
    }
  }

  async deleteProductTranslation(productId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting product translation', { productId, languageCode }, { prefix: 'ProductTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${productId}/${languageCode}`);
      logger.info('Product translation deleted successfully', { productId, languageCode }, { prefix: 'ProductTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting product translation', error, { prefix: 'ProductTranslationService' });
      throw this.handleError(error, 'Error deleting product translation');
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

export const productTranslationService = new ProductTranslationService();
