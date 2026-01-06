import { httpClient, getEffectiveBranchId } from "../../utils/http";
import { logger } from "../../utils/logger";

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

// Interface for the complete branch preferences response
export interface BranchPreferences {
  id: number;
  branchId: number;
  autoConfirmOrders: boolean;
  useWhatsappForOrders: boolean;
  showProductDescriptions: boolean;
  enableAllergenDisplay: boolean;
  enableIngredientDisplay: boolean;
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptOnlinePayment: boolean;
  defaultCurrency: string;
  supportedLanguages: string[];
  defaultLanguage: string;
  timeZoneId: string;
  availableLanguages: LanguageOption[];
  availableCurrencies: CurrencyOption[];
  sessionTimeoutMinutes: number;
  cleanupMode: number;
  cleanupDelayAfterCloseMinutes: number;
  createdAt: string;
  updatedAt: string;
  rowVersion: string;
}

// Interface for updating branch preferences (without readonly fields)
export interface UpdateBranchPreferencesDto {
  autoConfirmOrders: boolean;
  useWhatsappForOrders: boolean;
  showProductDescriptions: boolean;
  enableAllergenDisplay: boolean;
  enableIngredientDisplay: boolean;
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptOnlinePayment: boolean;
  defaultCurrency: string;
  supportedLanguages: string[];
  defaultLanguage: string;
  timeZoneId: string;
  sessionTimeoutMinutes: number;
  cleanupMode: number;
  cleanupDelayAfterCloseMinutes: number;
  rowVersion: string;
}

// Interface for session settings update
export interface UpdateSessionSettingsDto {
  cleanupMode: number;
  sessionTimeoutMinutes: number;
  cleanupDelayAfterCloseMinutes: number;
}

// Interface for payment settings update
export interface UpdatePaymentSettingsDto {
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptOnlinePayment: boolean;
}

class BranchPreferencesService {
  private baseUrl = '/api/BranchPreferences';
  private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }
  // UPDATED: Now accepts branchId parameter
  async getBranchPreferences(branchId?: number): Promise<BranchPreferences> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();
        const language = this.getLanguageFromStorage();

      logger.info('Branch preferences bilgileri getirme isteği gönderiliyor', { branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      const url = effectiveBranchId
        ? `${this.baseUrl}?branchId=${effectiveBranchId}`
        : this.baseUrl;

      const params = {
        language
      };

      const response = await httpClient.get<BranchPreferences>(url, { params });

      logger.info('Branch Preferences API Response:', response.data, { prefix: 'BranchPreferencesService' });
      logger.info('Branch preferences bilgileri başarıyla alındı', { branchId }, { prefix: 'BranchPreferencesService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Branch preferences bilgileri getirme hatası', error, { prefix: 'BranchPreferencesService' });
      logger.error('Error response:', error?.response, { prefix: 'BranchPreferencesService' });
      logger.error('Error response data:', error?.response?.data, { prefix: 'BranchPreferencesService' });
      
      // Enhanced error handling
      if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Branch preferences bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Branch preferences bilgileri getirilirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  // UPDATED: Now accepts branchId parameter
  async updateBranchPreferences(data: UpdateBranchPreferencesDto, branchId?: number): Promise<BranchPreferences> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Branch preferences güncelleme isteği gönderiliyor', { data, branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      // Clean and trim string values
      const updateData: UpdateBranchPreferencesDto = {
        autoConfirmOrders: data.autoConfirmOrders,
        useWhatsappForOrders: data.useWhatsappForOrders,
        showProductDescriptions: data.showProductDescriptions,
        enableAllergenDisplay: data.enableAllergenDisplay,
        enableIngredientDisplay: data.enableIngredientDisplay,
        acceptCash: data.acceptCash,
        acceptCreditCard: data.acceptCreditCard,
        acceptOnlinePayment: data.acceptOnlinePayment,
        defaultCurrency: data.defaultCurrency?.trim() || '',
        supportedLanguages: data.supportedLanguages,
        defaultLanguage: data.defaultLanguage?.trim() || '',
        timeZoneId: data.timeZoneId?.trim() || '',
        sessionTimeoutMinutes: data.sessionTimeoutMinutes,
        cleanupMode: data.cleanupMode,
        cleanupDelayAfterCloseMinutes: data.cleanupDelayAfterCloseMinutes,
        rowVersion: data.rowVersion
      };

      logger.info('Cleaned update data:', updateData, { prefix: 'BranchPreferencesService' });

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      const response = await httpClient.put<BranchPreferences>(this.baseUrl, updateData, { params });

      logger.info('Branch Preferences Update API Response alındı', response.data, { prefix: 'BranchPreferencesService' });
      logger.info('Branch preferences başarıyla güncellendi', { branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      return response.data;
    } catch (error: any) {
      logger.error('Branch preferences güncelleme hatası', error, { prefix: 'BranchPreferencesService' });
      
      // Enhanced error handling with validation errors
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchPreferencesService' });
        
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else if (error?.response?.status === 400) {
        throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Branch preferences bulunamadı.');
      } else if (error?.response?.status === 409) {
        throw new Error('Veriler güncel değil. Sayfayı yenileyip tekrar deneyin.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Branch preferences güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  // UPDATED: Now accepts branchId parameter
  async updateSessionSettings(data: UpdateSessionSettingsDto, branchId?: number): Promise<BranchPreferences> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Session settings güncelleme isteği gönderiliyor', { data, branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      const updateData: UpdateSessionSettingsDto = {
        cleanupMode: data.cleanupMode,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes,
        cleanupDelayAfterCloseMinutes: data.cleanupDelayAfterCloseMinutes
      };

      logger.info('Session settings update data:', updateData, { prefix: 'BranchPreferencesService' });

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      const response = await httpClient.put<BranchPreferences>(`${this.baseUrl}/session-settings`, updateData, { params });

      logger.info('Session Settings Update API Response alındı', response.data, { prefix: 'BranchPreferencesService' });
      logger.info('Session settings başarıyla güncellendi', { branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      return response.data;
    } catch (error: any) {
      logger.error('Session settings güncelleme hatası', error, { prefix: 'BranchPreferencesService' });
      
      // Enhanced error handling
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchPreferencesService' });
        
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else if (error?.response?.status === 400) {
        throw new Error('Geçersiz session ayarları. Lütfen değerleri kontrol edin.');
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Branch preferences bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Session ayarları güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }

  // UPDATED: Now accepts branchId parameter
  async updatePaymentSettings(data: UpdatePaymentSettingsDto, branchId?: number): Promise<BranchPreferences> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Payment settings güncelleme isteği gönderiliyor', { data, branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      const updateData: UpdatePaymentSettingsDto = {
        acceptCash: data.acceptCash,
        acceptCreditCard: data.acceptCreditCard,
        acceptOnlinePayment: data.acceptOnlinePayment
      };

      logger.info('Payment settings update data:', updateData, { prefix: 'BranchPreferencesService' });

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      const response = await httpClient.put<BranchPreferences>(`${this.baseUrl}/payment-settings`, updateData, { params });

      logger.info('Payment Settings Update API Response alındı', response.data, { prefix: 'BranchPreferencesService' });
      logger.info('Payment settings başarıyla güncellendi', { branchId: effectiveBranchId }, { prefix: 'BranchPreferencesService' });

      return response.data;
    } catch (error: any) {
      logger.error('Payment settings güncelleme hatası', error, { prefix: 'BranchPreferencesService' });
      
      // Enhanced error handling
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchPreferencesService' });
        
        const validationErrors = Object.values(error.response.data.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else if (error?.response?.status === 400) {
        throw new Error('Geçersiz ödeme ayarları. En az bir ödeme yöntemi seçilmelidir.');
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Branch preferences bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Ödeme ayarları güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }
}

export const branchPreferencesService = new BranchPreferencesService();