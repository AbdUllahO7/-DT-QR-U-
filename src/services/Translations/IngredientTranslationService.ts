import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  IngredientTranslation,
  UpsertIngredientTranslationDto,
  BatchUpsertIngredientTranslationsDto,
} from '../../types/Translations/type';

class IngredientTranslationService {
  private baseUrl = '/api/ingredient-translations';

  async getIngredientTranslations(ingredientId: number): Promise<IngredientTranslation[]> {
    try {
      logger.info('Fetching ingredient translations', { ingredientId }, { prefix: 'IngredientTranslationService' });
      const response = await httpClient.get<IngredientTranslation[]>(`${this.baseUrl}/${ingredientId}`);
      logger.info('Ingredient translations fetched successfully', { ingredientId, count: response.data.length }, { prefix: 'IngredientTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching ingredient translations', error, { prefix: 'IngredientTranslationService' });
      throw this.handleError(error, 'Error fetching ingredient translations');
    }
  }

  async getIngredientTranslation(ingredientId: number, languageCode: string): Promise<IngredientTranslation> {
    try {
      logger.info('Fetching ingredient translation', { ingredientId, languageCode }, { prefix: 'IngredientTranslationService' });
      const response = await httpClient.get<IngredientTranslation>(`${this.baseUrl}/${ingredientId}/${languageCode}`);
      logger.info('Ingredient translation fetched successfully', { ingredientId, languageCode }, { prefix: 'IngredientTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching ingredient translation', error, { prefix: 'IngredientTranslationService' });
      throw this.handleError(error, 'Error fetching ingredient translation');
    }
  }

  async upsertIngredientTranslation(data: UpsertIngredientTranslationDto): Promise<IngredientTranslation> {
    try {
      logger.info('Upserting ingredient translation', { data }, { prefix: 'IngredientTranslationService' });
      const response = await httpClient.put<IngredientTranslation>(`${this.baseUrl}`, data);
      logger.info('Ingredient translation upserted successfully', { data }, { prefix: 'IngredientTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting ingredient translation', error, { prefix: 'IngredientTranslationService' });
      throw this.handleError(error, 'Error upserting ingredient translation');
    }
  }

  async batchUpsertIngredientTranslations(data: BatchUpsertIngredientTranslationsDto): Promise<IngredientTranslation[]> {
    try {
      logger.info('Batch upserting ingredient translations', { count: data.translations.length }, { prefix: 'IngredientTranslationService' });
      const response = await httpClient.put<IngredientTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Ingredient translations batch upserted successfully', { count: data.translations.length }, { prefix: 'IngredientTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting ingredient translations', error, { prefix: 'IngredientTranslationService' });
      throw this.handleError(error, 'Error batch upserting ingredient translations');
    }
  }

  async deleteIngredientTranslation(ingredientId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting ingredient translation', { ingredientId, languageCode }, { prefix: 'IngredientTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${ingredientId}/${languageCode}`);
      logger.info('Ingredient translation deleted successfully', { ingredientId, languageCode }, { prefix: 'IngredientTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting ingredient translation', error, { prefix: 'IngredientTranslationService' });
      throw this.handleError(error, 'Error deleting ingredient translation');
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

export const ingredientTranslationService = new IngredientTranslationService();
