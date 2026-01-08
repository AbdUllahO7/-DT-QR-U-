import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  OrderTypeTranslation,
  UpsertOrderTypeTranslationDto,
  BatchUpsertOrderTypeTranslationsDto,
} from '../../types/Translations/type';

class OrderTypeTranslationService {
  private baseUrl = '/api/order-type-translations';

  async getOrderTypeTranslations(orderTypeId: number): Promise<OrderTypeTranslation[]> {
    try {
      logger.info('Fetching order type translations', { orderTypeId }, { prefix: 'OrderTypeTranslationService' });
      const response = await httpClient.get<OrderTypeTranslation[]>(`${this.baseUrl}/${orderTypeId}`);
      logger.info('Order type translations fetched successfully', { orderTypeId, count: response.data.length }, { prefix: 'OrderTypeTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching order type translations', error, { prefix: 'OrderTypeTranslationService' });
      throw this.handleError(error, 'Error fetching order type translations');
    }
  }

  async getOrderTypeTranslation(orderTypeId: number, languageCode: string): Promise<OrderTypeTranslation> {
    try {
      logger.info('Fetching order type translation', { orderTypeId, languageCode }, { prefix: 'OrderTypeTranslationService' });
      const response = await httpClient.get<OrderTypeTranslation>(`${this.baseUrl}/${orderTypeId}/${languageCode}`);
      logger.info('Order type translation fetched successfully', { orderTypeId, languageCode }, { prefix: 'OrderTypeTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching order type translation', error, { prefix: 'OrderTypeTranslationService' });
      throw this.handleError(error, 'Error fetching order type translation');
    }
  }

  async upsertOrderTypeTranslation(data: UpsertOrderTypeTranslationDto): Promise<OrderTypeTranslation> {
    try {
      logger.info('Upserting order type translation', { data }, { prefix: 'OrderTypeTranslationService' });
      const response = await httpClient.put<OrderTypeTranslation>(`${this.baseUrl}`, data);
      logger.info('Order type translation upserted successfully', { data }, { prefix: 'OrderTypeTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting order type translation', error, { prefix: 'OrderTypeTranslationService' });
      throw this.handleError(error, 'Error upserting order type translation');
    }
  }

  async batchUpsertOrderTypeTranslations(data: BatchUpsertOrderTypeTranslationsDto): Promise<OrderTypeTranslation[]> {
    try {
      logger.info('Batch upserting order type translations', { count: data.translations.length }, { prefix: 'OrderTypeTranslationService' });
      const response = await httpClient.put<OrderTypeTranslation[]>(`${this.baseUrl}/batch`, data);
      logger.info('Order type translations batch upserted successfully', { count: data.translations.length }, { prefix: 'OrderTypeTranslationService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting order type translations', error, { prefix: 'OrderTypeTranslationService' });
      throw this.handleError(error, 'Error batch upserting order type translations');
    }
  }

  async deleteOrderTypeTranslation(orderTypeId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting order type translation', { orderTypeId, languageCode }, { prefix: 'OrderTypeTranslationService' });
      await httpClient.delete(`${this.baseUrl}/${orderTypeId}/${languageCode}`);
      logger.info('Order type translation deleted successfully', { orderTypeId, languageCode }, { prefix: 'OrderTypeTranslationService' });
    } catch (error: any) {
      logger.error('Error deleting order type translation', error, { prefix: 'OrderTypeTranslationService' });
      throw this.handleError(error, 'Error deleting order type translation');
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

export const orderTypeTranslationService = new OrderTypeTranslationService();
