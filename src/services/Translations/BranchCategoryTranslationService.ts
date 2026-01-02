import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  BranchCategoryTranslation,
  UpsertBranchCategoryTranslationDto,
  BatchUpsertBranchCategoryTranslationsDto,
} from '../../types/Translations/type';

class BranchCategoryTranslationService {
  private baseUrl = '/api/branch-category-translations';

  async getBranchCategoryTranslations(branchCategoryId: number): Promise<BranchCategoryTranslation[]> {
    try {
      logger.info('Fetching branch category translations', { branchCategoryId }, { prefix: 'BranchCategoryTranslationService' });
      const response = await httpClient.get<BranchCategoryTranslation[]>(`${this.baseUrl}/${branchCategoryId}`);
      logger.info('Branch category translations fetched successfully', { branchCategoryId, count: response.data.length }, { prefix: 'BranchCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch category translations', error, { prefix: 'BranchCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching branch category translations');
    }
  }

  async getBranchCategoryTranslation(branchCategoryId: number, languageCode: string): Promise<BranchCategoryTranslation> {
    try {
      logger.info('Fetching branch category translation', { branchCategoryId, languageCode }, { prefix: 'BranchCategoryTranslationService' });
      const response = await httpClient.get<BranchCategoryTranslation>(`${this.baseUrl}/${branchCategoryId}/${languageCode}`);
      logger.info('Branch category translation fetched successfully', { branchCategoryId, languageCode }, { prefix: 'BranchCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch category translation', error, { prefix: 'BranchCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching branch category translation');
    }
  }

  async upsertBranchCategoryTranslation(data: UpsertBranchCategoryTranslationDto): Promise<BranchCategoryTranslation> {
    try {
      logger.info('Upserting branch category translation', { data }, { prefix: 'BranchCategoryTranslationService' });
      const response = await httpClient.put<BranchCategoryTranslation>(`${this.baseUrl}`, data);
      logger.info('Branch category translation upserted successfully', { data }, { prefix: 'BranchCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting branch category translation', error, { prefix: 'BranchCategoryTranslationService' });
      throw this.handleError(error, 'Error upserting branch category translation');
    }
  }

  async batchUpsertBranchCategoryTranslations(data: BatchUpsertBranchCategoryTranslationsDto): Promise<BranchCategoryTranslation[]> {
    try {
      logger.info('Batch upserting branch category translations', { count: data.translations.length }, { prefix: 'BranchCategoryTranslationService' });
      const response = await httpClient.put<BranchCategoryTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Branch category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'BranchCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting branch category translations', error, { prefix: 'BranchCategoryTranslationService' });
      throw this.handleError(error, 'Error batch upserting branch category translations');
    }
  }

  async deleteBranchCategoryTranslation(branchCategoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting branch category translation', { branchCategoryId, languageCode }, { prefix: 'BranchCategoryTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${branchCategoryId}/${languageCode}`);
      logger.info('Branch category translation deleted successfully', { branchCategoryId, languageCode }, { prefix: 'BranchCategoryTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting branch category translation', error, { prefix: 'BranchCategoryTranslationService' });
      throw this.handleError(error, 'Error deleting branch category translation');
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

export const branchCategoryTranslationService = new BranchCategoryTranslationService();
