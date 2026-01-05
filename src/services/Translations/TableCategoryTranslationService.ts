import { httpClient, getEffectiveBranchId } from '../../utils/http';
import { logger } from '../../utils/logger';

export interface TableCategoryTranslation {
  menuTableCategoryId: number;
  languageCode: string;
  categoryName?: string;
  description?: string;
}

export interface TableCategoryTranslationResponse {
  baseValues: {
    menuTableCategoryId: number;
    branchId: number;
    originalLanguage: string;
    categoryName: string;
    description?: string;
  };
  translations: TableCategoryTranslation[];
}

export interface UpsertTableCategoryTranslationDto {
  menuTableCategoryId: number;
  languageCode: string;
  categoryName?: string;
  description?: string;
}

export interface BatchUpsertTableCategoryTranslationsDto {
  translations: UpsertTableCategoryTranslationDto[];
}

class TableCategoryTranslationService {
  private baseUrl = '/api/menu-table-category-translations';

  async getTableCategoryTranslations(menuTableCategoryId: number): Promise<TableCategoryTranslationResponse> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Fetching table category translations', { menuTableCategoryId, branchId }, { prefix: 'TableCategoryTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<TableCategoryTranslationResponse>(`${this.baseUrl}/${menuTableCategoryId}`, { params });
      logger.info('Table category translations fetched successfully', { menuTableCategoryId, count: response.data.translations?.length || 0 }, { prefix: 'TableCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching table category translations', error, { prefix: 'TableCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching table category translations');
    }
  }

  async getTableCategoryTranslation(menuTableCategoryId: number, languageCode: string): Promise<TableCategoryTranslation> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Fetching table category translation', { menuTableCategoryId, languageCode, branchId }, { prefix: 'TableCategoryTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<TableCategoryTranslation>(`${this.baseUrl}/${menuTableCategoryId}/${languageCode}`, { params });
      logger.info('Table category translation fetched successfully', { menuTableCategoryId, languageCode }, { prefix: 'TableCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching table category translation', error, { prefix: 'TableCategoryTranslationService' });
      throw this.handleError(error, 'Error fetching table category translation');
    }
  }

  async upsertTableCategoryTranslation(data: UpsertTableCategoryTranslationDto): Promise<TableCategoryTranslation> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Upserting table category translation', { data, branchId }, { prefix: 'TableCategoryTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<TableCategoryTranslation>(`${this.baseUrl}`, data, { params });
      logger.info('Table category translation upserted successfully', { data }, { prefix: 'TableCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting table category translation', error, { prefix: 'TableCategoryTranslationService' });
      throw this.handleError(error, 'Error upserting table category translation');
    }
  }

  async batchUpsertTableCategoryTranslations(data: BatchUpsertTableCategoryTranslationsDto): Promise<TableCategoryTranslation[]> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Batch upserting table category translations', { count: data.translations.length, branchId }, { prefix: 'TableCategoryTranslationService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<TableCategoryTranslation[]>(`${this.baseUrl}/batch`, data, { params });
      logger.info('Table category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TableCategoryTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting table category translations', error, { prefix: 'TableCategoryTranslationService' });
      throw this.handleError(error, 'Error batch upserting table category translations');
    }
  }

  async deleteTableCategoryTranslation(menuTableCategoryId: number, languageCode: string): Promise<void> {
    try {
      const branchId = getEffectiveBranchId();
      logger.info('Deleting table category translation', { menuTableCategoryId, languageCode, branchId }, { prefix: 'TableCategoryTranslationService' });

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/${menuTableCategoryId}/${languageCode}`, { params });
      logger.info('Table category translation deleted successfully', { menuTableCategoryId, languageCode }, { prefix: 'TableCategoryTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting table category translation', error, { prefix: 'TableCategoryTranslationService' });
      throw this.handleError(error, 'Error deleting table category translation');
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

export const tableCategoryTranslationService = new TableCategoryTranslationService();
