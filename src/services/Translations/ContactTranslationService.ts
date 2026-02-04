import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  ContactTranslation,
  UpsertContactTranslationDto,
  BatchUpsertContactTranslationsDto,
} from '../../types/Translations/type';

class ContactTranslationService {
  private baseUrl = '/api/contact-translations';

  async getContactTranslations(contactId: number, branchId?: number): Promise<ContactTranslation[]> {
    try {
      logger.info('Fetching contact translations', { contactId, branchId }, { prefix: 'ContactTranslationService' });
      const response = await httpClient.get<ContactTranslation[]>(`${this.baseUrl}/${contactId}`, {
        params: branchId ? { branchId } : undefined
      });
      logger.info('Contact translations fetched successfully', { contactId, branchId, count: response.data.length }, { prefix: 'ContactTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching contact translations', error, { prefix: 'ContactTranslationService' });
      throw this.handleError(error, 'Error fetching contact translations');
    }
  }

  async getContactTranslation(contactId: number, languageCode: string, branchId?: number): Promise<ContactTranslation> {
    try {
      logger.info('Fetching contact translation', { contactId, languageCode, branchId }, { prefix: 'ContactTranslationService' });
      const response = await httpClient.get<ContactTranslation>(`${this.baseUrl}/${contactId}/${languageCode}`, {
        params: branchId ? { branchId } : undefined
      });
      logger.info('Contact translation fetched successfully', { contactId, languageCode, branchId }, { prefix: 'ContactTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching contact translation', error, { prefix: 'ContactTranslationService' });
      throw this.handleError(error, 'Error fetching contact translation');
    }
  }

  async upsertContactTranslation(data: UpsertContactTranslationDto, branchId?: number): Promise<ContactTranslation> {
    try {
      logger.info('Upserting contact translation', { data, branchId }, { prefix: 'ContactTranslationService' });
      const response = await httpClient.put<ContactTranslation>(`${this.baseUrl}`, data, {
        params: branchId ? { branchId } : undefined
      });
      logger.info('Contact translation upserted successfully', { data, branchId }, { prefix: 'ContactTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting contact translation', error, { prefix: 'ContactTranslationService' });
      throw this.handleError(error, 'Error upserting contact translation');
    }
  }

  async batchUpsertContactTranslations(data: BatchUpsertContactTranslationsDto, branchId?: number): Promise<ContactTranslation[]> {
    try {
      logger.info('Batch upserting contact translations', { count: data.translations.length, branchId }, { prefix: 'ContactTranslationService' });
      const response = await httpClient.put<ContactTranslation[]>(`${this.baseUrl}/batch`, data, {
        params: branchId ? { branchId } : undefined
      });
      logger.info('Contact translations batch upserted successfully', { count: data.translations.length, branchId }, { prefix: 'ContactTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting contact translations', error, { prefix: 'ContactTranslationService' });
      throw this.handleError(error, 'Error batch upserting contact translations');
    }
  }

  async deleteContactTranslation(contactId: number, languageCode: string, branchId?: number): Promise<void> {
    try {
      logger.info('Deleting contact translation', { contactId, languageCode, branchId }, { prefix: 'ContactTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${contactId}/${languageCode}`, {
        params: branchId ? { branchId } : undefined
      });
      logger.info('Contact translation deleted successfully', { contactId, languageCode, branchId }, { prefix: 'ContactTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting contact translation', error, { prefix: 'ContactTranslationService' });
      throw this.handleError(error, 'Error deleting contact translation');
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

export const contactTranslationService = new ContactTranslationService();
