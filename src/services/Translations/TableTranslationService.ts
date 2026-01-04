import { httpClient, getEffectiveBranchId } from '../../utils/http';
import { logger } from '../../utils/logger';

export interface TableTranslation {
  menuTableId: number;
  languageCode: string;
  menuTableName?: string;
}

export interface TableTranslationResponse {
  baseValues: {
    menuTableId: number;
    branchId: number;
    originalLanguage: string;
    menuTableName: string;
  };
  translations: TableTranslation[];
}

export interface UpsertTableTranslationDto {
  menuTableId: number;
  languageCode: string;
  menuTableName?: string;
}

export interface BatchUpsertTableTranslationsDto {
  translations: UpsertTableTranslationDto[];
}

class TableTranslationService {
  private baseUrl = '/api/menu-table-translations';

  async getTableTranslations(menuTableId: number): Promise<TableTranslationResponse> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Fetching table translations', { menuTableId, branchId }, { prefix: 'TableTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<TableTranslationResponse>(`${this.baseUrl}/${menuTableId}`, { params });
      logger.info('Table translations fetched successfully', { menuTableId, count: response.data.translations?.length || 0 }, { prefix: 'TableTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching table translations', error, { prefix: 'TableTranslationService' });
      throw this.handleError(error, 'Error fetching table translations');
    }
  }

  async getTableTranslation(menuTableId: number, languageCode: string): Promise<TableTranslation> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Fetching table translation', { menuTableId, languageCode, branchId }, { prefix: 'TableTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<TableTranslation>(`${this.baseUrl}/${menuTableId}/${languageCode}`, { params });
      logger.info('Table translation fetched successfully', { menuTableId, languageCode }, { prefix: 'TableTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching table translation', error, { prefix: 'TableTranslationService' });
      throw this.handleError(error, 'Error fetching table translation');
    }
  }

  async upsertTableTranslation(data: UpsertTableTranslationDto): Promise<TableTranslation> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Upserting table translation', { data, branchId }, { prefix: 'TableTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<TableTranslation>(`${this.baseUrl}`, data, { params });
      logger.info('Table translation upserted successfully', { data }, { prefix: 'TableTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting table translation', error, { prefix: 'TableTranslationService' });
      throw this.handleError(error, 'Error upserting table translation');
    }
  }

  async batchUpsertTableTranslations(data: BatchUpsertTableTranslationsDto): Promise<TableTranslation[]> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Batch upserting table translations', { count: data.translations.length, branchId }, { prefix: 'TableTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<TableTranslation[]>(`${this.baseUrl}/batch`, data, { params });
      logger.info('Table translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TableTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting table translations', error, { prefix: 'TableTranslationService' });
      throw this.handleError(error, 'Error batch upserting table translations');
    }
  }

  async deleteTableTranslation(menuTableId: number, languageCode: string): Promise<void> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Deleting table translation', { menuTableId, languageCode, branchId }, { prefix: 'TableTranslationService' });

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/${menuTableId}/${languageCode}`, { params });
      logger.info('Table translation deleted successfully', { menuTableId, languageCode }, { prefix: 'TableTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting table translation', error, { prefix: 'TableTranslationService' });
      throw this.handleError(error, 'Error deleting table translation');
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

export const tableTranslationService = new TableTranslationService();
