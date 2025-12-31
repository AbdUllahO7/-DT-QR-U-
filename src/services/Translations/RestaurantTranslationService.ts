import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  RestaurantTranslation,
  UpsertRestaurantTranslationDto,
  BatchUpsertRestaurantTranslationsDto,
} from '../../types/Translations/type';

class RestaurantTranslationService {
  private baseUrl = '/api/restaurant-translations';

  async getRestaurantTranslations(): Promise<RestaurantTranslation[]> {
    try {
      logger.info('Fetching restaurant translations', {}, { prefix: 'RestaurantTranslationService' });
      const response = await httpClient.get<RestaurantTranslation[]>(`${this.baseUrl}`);
      logger.info('Restaurant translations fetched successfully', { count: response.data.length }, { prefix: 'RestaurantTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching restaurant translations', error, { prefix: 'RestaurantTranslationService' });
      throw this.handleError(error, 'Error fetching restaurant translations');
    }
  }

  async getRestaurantTranslation(languageCode: string): Promise<RestaurantTranslation> {
    try {
      logger.info('Fetching restaurant translation', { languageCode }, { prefix: 'RestaurantTranslationService' });
      const response = await httpClient.get<RestaurantTranslation>(`${this.baseUrl}/${languageCode}`);
      logger.info('Restaurant translation fetched successfully', { languageCode }, { prefix: 'RestaurantTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching restaurant translation', error, { prefix: 'RestaurantTranslationService' });
      throw this.handleError(error, 'Error fetching restaurant translation');
    }
  }

  async upsertRestaurantTranslation(data: UpsertRestaurantTranslationDto): Promise<RestaurantTranslation> {
    try {
      logger.info('Upserting restaurant translation', { data }, { prefix: 'RestaurantTranslationService' });
      const response = await httpClient.put<RestaurantTranslation>(`${this.baseUrl}`, data);
      logger.info('Restaurant translation upserted successfully', { data }, { prefix: 'RestaurantTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting restaurant translation', error, { prefix: 'RestaurantTranslationService' });
      throw this.handleError(error, 'Error upserting restaurant translation');
    }
  }

  async batchUpsertRestaurantTranslations(data: BatchUpsertRestaurantTranslationsDto): Promise<RestaurantTranslation[]> {
    try {
      logger.info('Batch upserting restaurant translations', { count: data.translations.length }, { prefix: 'RestaurantTranslationService' });
      const response = await httpClient.put<RestaurantTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Restaurant translations batch upserted successfully', { count: data.translations.length }, { prefix: 'RestaurantTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting restaurant translations', error, { prefix: 'RestaurantTranslationService' });
      throw this.handleError(error, 'Error batch upserting restaurant translations');
    }
  }

  async deleteRestaurantTranslation(languageCode: string): Promise<void> {
    try {
      logger.info('Deleting restaurant translation', { languageCode }, { prefix: 'RestaurantTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${languageCode}`);
      logger.info('Restaurant translation deleted successfully', { languageCode }, { prefix: 'RestaurantTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting restaurant translation', error, { prefix: 'RestaurantTranslationService' });
      throw this.handleError(error, 'Error deleting restaurant translation');
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

export const restaurantTranslationService = new RestaurantTranslationService();
