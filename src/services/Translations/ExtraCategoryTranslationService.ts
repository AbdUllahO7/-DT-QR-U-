import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  ExtraCategoryTranslation,
  UpsertExtraCategoryTranslationDto,
  BatchUpsertExtraCategoryTranslationsDto,
} from '../../types/Translations/type';

class ExtraCategoryTranslationService {
  private baseUrl = '/api/extra-category-translations';

  async getExtraCategoryTranslations(extraCategoryId: number): Promise<ExtraCategoryTranslation[]> {
    try {
      logger.info('Fetching extra category translations', { extraCategoryId }, { prefix: 'ExtraCategoryTranslationService' });
      const response = await httpClient.get<ExtraCategoryTranslation[]>(`${this.baseUrl}/${extraCategoryId}`);
      logger.info('Extra category translations fetched successfully', { extraCategoryId, count: response.data.length }, { prefix: 'ExtraCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra category translations', error, { prefix: 'ExtraCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching extra category translations');
    }
  }

  async getExtraCategoryTranslation(extraCategoryId: number, languageCode: string): Promise<ExtraCategoryTranslation> {
    try {
      logger.info('Fetching extra category translation', { extraCategoryId, languageCode }, { prefix: 'ExtraCategoryTranslationService' });
      const response = await httpClient.get<ExtraCategoryTranslation>(`${this.baseUrl}/${extraCategoryId}/${languageCode}`);
      logger.info('Extra category translation fetched successfully', { extraCategoryId, languageCode }, { prefix: 'ExtraCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra category translation', error, { prefix: 'ExtraCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching extra category translation');
    }
  }

  async upsertExtraCategoryTranslation(data: UpsertExtraCategoryTranslationDto): Promise<ExtraCategoryTranslation> {
    try {
      logger.info('Upserting extra category translation', { data }, { prefix: 'ExtraCategoryTranslationService' });
      const response = await httpClient.put<ExtraCategoryTranslation>(`${this.baseUrl}`, data);
      logger.info('Extra category translation upserted successfully', { data }, { prefix: 'ExtraCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting extra category translation', error, { prefix: 'ExtraCategoryTranslationService' });
      throw this.handleError(error, 'Error upserting extra category translation');
    }
  }

  async batchUpsertExtraCategoryTranslations(data: BatchUpsertExtraCategoryTranslationsDto): Promise<ExtraCategoryTranslation[]> {
    try {
      logger.info('Batch upserting extra category translations', { count: data.translations.length }, { prefix: 'ExtraCategoryTranslationService' });
      const response = await httpClient.put<ExtraCategoryTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Extra category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'ExtraCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting extra category translations', error, { prefix: 'ExtraCategoryTranslationService' });
      throw this.handleError(error, 'Error batch upserting extra category translations');
    }
  }

  async deleteExtraCategoryTranslation(extraCategoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting extra category translation', { extraCategoryId, languageCode }, { prefix: 'ExtraCategoryTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${extraCategoryId}/${languageCode}`);
      logger.info('Extra category translation deleted successfully', { extraCategoryId, languageCode }, { prefix: 'ExtraCategoryTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting extra category translation', error, { prefix: 'ExtraCategoryTranslationService' });
      throw this.handleError(error, 'Error deleting extra category translation');
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

export const extraCategoryTranslationService = new ExtraCategoryTranslationService();
