import { httpClient } from "../utils/http";
import { logger } from "../utils/logger";
import type { AxiosRequestConfig } from "axios";

// Currency source enum
export enum CurrencySource {
  Restaurant = 0,
  Branch = 1
}

// Interface for session currency response
export interface SessionCurrency {
  code: string;
  displayName: string;
  symbol: string;
  iconKey: string;
  source: CurrencySource;
  sourceId: number;
}

class CurrencyService {
  private baseUrl = '/api/Currencies';

  /**
   * Gets the current session's currency
   * This will return either the restaurant or branch currency depending on the current session context
   * This endpoint is public and doesn't require authentication (for guest users on online menu)
   */
  async getSessionCurrency(): Promise<SessionCurrency> {
    try {
      logger.info('Fetching session currency', {}, { prefix: 'CurrencyService' });

      // Use skipAuth flag to make this a public request (no authentication required)
      // This prevents the Authorization header from being added
      const config: AxiosRequestConfig & { skipAuth?: boolean } = {
        skipAuth: true
      };

      const response = await httpClient.get<SessionCurrency>(
        `${this.baseUrl}/session-current`,
        config
      );

      logger.info('Session currency fetched successfully:', response.data, { prefix: 'CurrencyService' });

      return response.data;
    } catch (error: any) {
      logger.error('Error fetching session currency:', error, { prefix: 'CurrencyService' });

      // Enhanced error handling
      if (error?.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      } else if (error?.response?.status === 403) {
        throw new Error('You do not have permission to access currency information.');
      } else if (error?.response?.status === 404) {
        throw new Error('Currency information not found.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('Please check your internet connection.');
      } else {
        throw new Error(`Failed to fetch currency: ${error?.message || 'Unknown error'}`);
      }
    }
  }
}

export const currencyService = new CurrencyService();
