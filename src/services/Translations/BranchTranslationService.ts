import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  BranchTranslation,
  UpsertBranchTranslationDto,
  BatchUpsertBranchTranslationsDto,
} from '../../types/Translations/type';

class BranchTranslationService {
  private baseUrl = '/api/branch-translations';

  async getBranchTranslations(branchId: number): Promise<BranchTranslation[]> {
    try {
      logger.info('Fetching branch translations', { branchId }, { prefix: 'BranchTranslationService' });
      const response = await httpClient.get<BranchTranslation[]>(`${this.baseUrl}/${branchId}`);
      logger.info('Branch translations fetched successfully', { branchId, count: response.data.length }, { prefix: 'BranchTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch translations', error, { prefix: 'BranchTranslationService' });
      throw this.handleError(error, 'Error fetching branch translations');
    }
  }

  async getBranchTranslation(branchId: number, languageCode: string): Promise<BranchTranslation> {
    try {
      logger.info('Fetching branch translation', { branchId, languageCode }, { prefix: 'BranchTranslationService' });
      const response = await httpClient.get<BranchTranslation>(`${this.baseUrl}/${branchId}/${languageCode}`);
      logger.info('Branch translation fetched successfully', { branchId, languageCode }, { prefix: 'BranchTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch translation', error, { prefix: 'BranchTranslationService' });
      throw this.handleError(error, 'Error fetching branch translation');
    }
  }

  async upsertBranchTranslation(data: UpsertBranchTranslationDto): Promise<BranchTranslation> {
    try {
      logger.info('Upserting branch translation', { data }, { prefix: 'BranchTranslationService' });
      const response = await httpClient.put<BranchTranslation>(`${this.baseUrl}`, data);
      logger.info('Branch translation upserted successfully', { data }, { prefix: 'BranchTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting branch translation', error, { prefix: 'BranchTranslationService' });
      throw this.handleError(error, 'Error upserting branch translation');
    }
  }

  async batchUpsertBranchTranslations(data: BatchUpsertBranchTranslationsDto): Promise<BranchTranslation[]> {
    try {
      logger.info('Batch upserting branch translations', { count: data.translations.length }, { prefix: 'BranchTranslationService' });
      const response = await httpClient.put<BranchTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Branch translations batch upserted successfully', { count: data.translations.length }, { prefix: 'BranchTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting branch translations', error, { prefix: 'BranchTranslationService' });
      throw this.handleError(error, 'Error batch upserting branch translations');
    }
  }

  async deleteBranchTranslation(branchId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting branch translation', { branchId, languageCode }, { prefix: 'BranchTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${branchId}/${languageCode}`);
      logger.info('Branch translation deleted successfully', { branchId, languageCode }, { prefix: 'BranchTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting branch translation', error, { prefix: 'BranchTranslationService' });
      throw this.handleError(error, 'Error deleting branch translation');
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

export const branchTranslationService = new BranchTranslationService();
