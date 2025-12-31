import { httpClient, getEffectiveBranchId } from '../utils/http';
import { logger } from '../utils/logger';
import { BranchLanguagesDto } from '../types/Language/type';

class LanguageService {
  private baseUrl = '/api/Languages';

  async getLanguages(branchId?: number): Promise<BranchLanguagesDto> {
    try {
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Fetching languages', { branchId: effectiveBranchId }, { prefix: 'LanguageService' });

      const params: any = {};
      if (effectiveBranchId) {
        params.branchId = effectiveBranchId;
      }

      const response = await httpClient.get<BranchLanguagesDto>(this.baseUrl, { params });

      logger.info('Languages fetched successfully', {
        branchId: effectiveBranchId,
        languageCount: response.data.availableLanguages?.length || 0,
        defaultLanguage: response.data.defaultLanguage
      }, { prefix: 'LanguageService' });

      return response.data;
    } catch (error: any) {
      logger.error('Error fetching languages', error, { prefix: 'LanguageService' });
      throw this.handleError(error, 'Error fetching languages');
    }
  }

  async getBranchLanguages(branchId: number): Promise<BranchLanguagesDto> {
    try {
      logger.info('Fetching branch languages', { branchId }, { prefix: 'LanguageService' });

      const response = await httpClient.get<BranchLanguagesDto>(`${this.baseUrl}/branch/${branchId}`);

      logger.info('Branch languages fetched successfully', {
        branchId,
        languageCount: response.data.availableLanguages?.length || 0,
        defaultLanguage: response.data.defaultLanguage
      }, { prefix: 'LanguageService' });

      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch languages', error, { prefix: 'LanguageService' });
      throw this.handleError(error, 'Error fetching branch languages');
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
      throw new Error('Languages not found.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('Please check your internet connection.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Unknown error'}`);
    }
  }
}

export const languageService = new LanguageService();
