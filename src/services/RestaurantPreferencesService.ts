import { httpClient } from "../utils/http";
import { logger } from "../utils/logger";

// Interface for language option
export interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

// Interface for currency option
export interface CurrencyOption {
  code: string;
  displayName: string;
  symbol: string;
  iconKey: string;
}

// Interface for the complete restaurant preferences response
export interface RestaurantPreferences {
  id: number;
  restaurantId: number;
  supportedLanguages: string[];
  defaultLanguage: string;
  defaultCurrency: string;
  availableLanguages: LanguageOption[];
  availableCurrencies: CurrencyOption[];
  createdAt: string;
  updatedAt: string | null;
  rowVersion: string | null;
}

// Interface for updating restaurant preferences
export interface UpdateRestaurantPreferencesDto {
  supportedLanguages?: string[];
  defaultLanguage?: string;
  defaultCurrency?: string;
  rowVersion?: string | null;
}

class RestaurantPreferencesService {
  private baseUrl = '/api/RestaurantPreferences';

  /**
   * Gets restaurant preferences (language settings)
   * Restaurant-scoped users only
   */
  async getRestaurantPreferences(): Promise<RestaurantPreferences> {
    try {
      logger.info('Restaurant preferences bilgileri getirme isteği gönderiliyor', {}, { prefix: 'RestaurantPreferencesService' });

      const response = await httpClient.get<RestaurantPreferences>(this.baseUrl);

      logger.info('Restaurant Preferences API Response:', response.data, { prefix: 'RestaurantPreferencesService' });
      logger.info('Restaurant preferences bilgileri başarıyla alındı', {}, { prefix: 'RestaurantPreferencesService' });

      // Convert byte array to base64 string if needed
      if (response.data.rowVersion && Array.isArray(response.data.rowVersion)) {
        const uint8Array = new Uint8Array(response.data.rowVersion as any);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        response.data.rowVersion = base64String;
      }

      return response.data;
    } catch (error: any) {
      logger.error('Restaurant preferences bilgileri getirme hatası', error, { prefix: 'RestaurantPreferencesService' });
      logger.error('Error response:', error?.response, { prefix: 'RestaurantPreferencesService' });
      logger.error('Error response data:', error?.response?.data, { prefix: 'RestaurantPreferencesService' });

      // Enhanced error handling
      if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Restaurant preferences bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Restaurant preferences bilgileri getirilirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  /**
   * Updates restaurant preferences (language settings)
   * Restaurant-scoped users only. Supports partial update.
   *
   * IMPORTANT: When reducing supported languages, branch preferences are automatically cascaded:
   * - Branches can only support languages that the restaurant supports
   * - If a branch's default language is removed, it will be updated to the restaurant's default
   *
   * Validation Rules:
   * - At least one language must be supported
   * - Default language must be within supported languages
   */
  async updateRestaurantPreferences(data: UpdateRestaurantPreferencesDto): Promise<{ message: string }> {
    try {
      logger.info('Restaurant preferences güncelleme isteği gönderiliyor', { data }, { prefix: 'RestaurantPreferencesService' });

      // Clean and validate data
      const updateData: any = {};

      if (data.supportedLanguages !== undefined) {
        updateData.supportedLanguages = data.supportedLanguages;
      }

      if (data.defaultLanguage !== undefined) {
        updateData.defaultLanguage = data.defaultLanguage?.trim() || '';
      }

      if (data.defaultCurrency !== undefined) {
        updateData.defaultCurrency = data.defaultCurrency?.trim() || '';
      }

      if (data.rowVersion !== undefined) {
        updateData.rowVersionString = data.rowVersion;
      }

      logger.info('Cleaned update data:', updateData, { prefix: 'RestaurantPreferencesService' });

      const response = await httpClient.put<{ message: string }>(this.baseUrl, updateData);

      logger.info('Restaurant Preferences Update API Response alındı', response.data, { prefix: 'RestaurantPreferencesService' });
      logger.info('Restaurant preferences başarıyla güncellendi', {}, { prefix: 'RestaurantPreferencesService' });

      return response.data;
    } catch (error: any) {
      logger.error('Restaurant preferences güncelleme hatası', error, { prefix: 'RestaurantPreferencesService' });

      // Enhanced error handling with validation errors
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'RestaurantPreferencesService' });

        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else if (error?.response?.status === 400) {
        throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Restaurant preferences bulunamadı.');
      } else if (error?.response?.status === 409) {
        throw new Error('Veriler güncel değil. Sayfayı yenileyip tekrar deneyin.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Restaurant preferences güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }
}

export const restaurantPreferencesService = new RestaurantPreferencesService();
