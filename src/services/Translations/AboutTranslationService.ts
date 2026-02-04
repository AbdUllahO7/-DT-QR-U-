import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  AboutTranslation,
  UpsertAboutTranslationDto,
  BatchUpsertAboutTranslationsDto,
} from '../../types/Translations/type';

class AboutTranslationService {
  private baseUrl = '/api/about-translations';

  async getAboutTranslations(aboutId: number): Promise<AboutTranslation[]> {
    try {
      logger.info('Fetching about translations', { aboutId }, { prefix: 'AboutTranslationService' });
      const response = await httpClient.get<AboutTranslation[]>(`${this.baseUrl}/${aboutId}`);
      logger.info('About translations fetched successfully', { aboutId, count: response.data.length }, { prefix: 'AboutTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching about translations', error, { prefix: 'AboutTranslationService' });
      throw this.handleError(error, 'Error fetching about translations');
    }
  }

  async getAboutTranslation(aboutId: number, languageCode: string): Promise<AboutTranslation> {
    try {
      logger.info('Fetching about translation', { aboutId, languageCode }, { prefix: 'AboutTranslationService' });
      const response = await httpClient.get<AboutTranslation>(`${this.baseUrl}/${aboutId}/${languageCode}`);
      logger.info('About translation fetched successfully', { aboutId, languageCode }, { prefix: 'AboutTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching about translation', error, { prefix: 'AboutTranslationService' });
      throw this.handleError(error, 'Error fetching about translation');
    }
  }

  async upsertAboutTranslation(data: UpsertAboutTranslationDto): Promise<AboutTranslation> {
    try {
      logger.info('Upserting about translation', { data }, { prefix: 'AboutTranslationService' });
      const response = await httpClient.put<AboutTranslation>(`${this.baseUrl}`, data);
      logger.info('About translation upserted successfully', { data }, { prefix: 'AboutTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting about translation', error, { prefix: 'AboutTranslationService' });
      throw this.handleError(error, 'Error upserting about translation');
    }
  }

  async batchUpsertAboutTranslations(data: BatchUpsertAboutTranslationsDto): Promise<AboutTranslation[]> {
    try {
      logger.info('Batch upserting about translations', { count: data.translations.length }, { prefix: 'AboutTranslationService' });
      const response = await httpClient.put<AboutTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('About translations batch upserted successfully', { count: data.translations.length }, { prefix: 'AboutTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting about translations', error, { prefix: 'AboutTranslationService' });
      throw this.handleError(error, 'Error batch upserting about translations');
    }
  }

  async deleteAboutTranslation(aboutId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting about translation', { aboutId, languageCode }, { prefix: 'AboutTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${aboutId}/${languageCode}`);
      logger.info('About translation deleted successfully', { aboutId, languageCode }, { prefix: 'AboutTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting about translation', error, { prefix: 'AboutTranslationService' });
      throw this.handleError(error, 'Error deleting about translation');
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

export const aboutTranslationService = new AboutTranslationService();
