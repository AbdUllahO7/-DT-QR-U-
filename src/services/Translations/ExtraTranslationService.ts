import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  ExtraTranslation,
  UpsertExtraTranslationDto,
  BatchUpsertExtraTranslationsDto,
} from '../../types/Translations/type';

class ExtraTranslationService {
  private baseUrl = '/api/extra-translations';

  // Helper method to get language from localStorage
  private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }

  async getExtraTranslations(extraId: number): Promise<ExtraTranslation[]> {
    try {
      const language = this.getLanguageFromStorage();
      logger.info('Fetching extra translations', { extraId, language }, { prefix: 'ExtraTranslationService' });
      const response = await httpClient.get<ExtraTranslation[]>(`${this.baseUrl}/${extraId}`, {
        params: { language }
      });
      logger.info('Extra translations fetched successfully', { extraId, count: response.data.length, language }, { prefix: 'ExtraTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra translations', error, { prefix: 'ExtraTranslationService' });
      throw this.handleError(error, 'Error fetching extra translations');
    }
  }

  async getExtraTranslation(extraId: number, languageCode: string): Promise<ExtraTranslation> {
    try {
      logger.info('Fetching extra translation', { extraId, languageCode }, { prefix: 'ExtraTranslationService' });
      const response = await httpClient.get<ExtraTranslation>(`${this.baseUrl}/${extraId}/${languageCode}`);
      logger.info('Extra translation fetched successfully', { extraId, languageCode }, { prefix: 'ExtraTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra translation', error, { prefix: 'ExtraTranslationService' });
      throw this.handleError(error, 'Error fetching extra translation');
    }
  }

  async upsertExtraTranslation(data: UpsertExtraTranslationDto): Promise<ExtraTranslation> {
    try {
      logger.info('Upserting extra translation', { data }, { prefix: 'ExtraTranslationService' });
      const response = await httpClient.put<ExtraTranslation>(`${this.baseUrl}`, data);
      logger.info('Extra translation upserted successfully', { data }, { prefix: 'ExtraTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting extra translation', error, { prefix: 'ExtraTranslationService' });
      throw this.handleError(error, 'Error upserting extra translation');
    }
  }

  async batchUpsertExtraTranslations(data: BatchUpsertExtraTranslationsDto): Promise<ExtraTranslation[]> {
    try {
      logger.info('Batch upserting extra translations', { count: data.translations.length }, { prefix: 'ExtraTranslationService' });
      const response = await httpClient.put<ExtraTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Extra translations batch upserted successfully', { count: data.translations.length }, { prefix: 'ExtraTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting extra translations', error, { prefix: 'ExtraTranslationService' });
      throw this.handleError(error, 'Error batch upserting extra translations');
    }
  }

  async deleteExtraTranslation(extraId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting extra translation', { extraId, languageCode }, { prefix: 'ExtraTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${extraId}/${languageCode}`);
      logger.info('Extra translation deleted successfully', { extraId, languageCode }, { prefix: 'ExtraTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting extra translation', error, { prefix: 'ExtraTranslationService' });
      throw this.handleError(error, 'Error deleting extra translation');
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

export const extraTranslationService = new ExtraTranslationService();
