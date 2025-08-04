import { logger } from './logger';
import type { ApiError } from '../types/api';

export interface ErrorInfo {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  retryable: boolean;
  userFriendlyMessage: string;
}

export const parseApiError = (error: any): ErrorInfo => {
  logger.error('Error parsing:', error);

  // Network hataları
  if (error.status === 0 || 
      error.message?.includes('Network Error') || 
      error.message?.includes('ERR_EMPTY_RESPONSE') ||
      error.message?.includes('ERR_CONNECTION_REFUSED')) {
    return {
      message: error.message || 'Network Error',
      type: 'network',
      retryable: true,
      userFriendlyMessage: 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.'
    };
  }

  // Timeout hataları
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      message: error.message || 'Request timeout',
      type: 'network',
      retryable: true,
      userFriendlyMessage: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
    };
  }

  // CORS hataları
  if (error.message?.includes('CORS')) {
    return {
      message: error.message || 'CORS Error',
      type: 'network',
      retryable: false,
      userFriendlyMessage: 'Sunucu erişim hatası. Lütfen daha sonra tekrar deneyin.'
    };
  }

  // HTTP hata kodları
  if (error.response?.status) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return {
          message: error.response.data?.message || 'Bad Request',
          type: 'validation',
          retryable: false,
          userFriendlyMessage: error.response.data?.message || 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.'
        };
      
      case 401:
        return {
          message: error.response.data?.message || 'Unauthorized',
          type: 'auth',
          retryable: false,
          userFriendlyMessage: 'Giriş bilgileriniz hatalı. Lütfen tekrar deneyin.'
        };
      
      case 403:
        return {
          message: error.response.data?.message || 'Forbidden',
          type: 'auth',
          retryable: false,
          userFriendlyMessage: 'Bu işlem için yetkiniz bulunmuyor.'
        };
      
      case 404:
        return {
          message: error.response.data?.message || 'Not Found',
          type: 'server',
          retryable: false,
          userFriendlyMessage: 'İstenen kaynak bulunamadı.'
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: error.response.data?.message || 'Server Error',
          type: 'server',
          retryable: true,
          userFriendlyMessage: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        };
      
      default:
        return {
          message: error.response.data?.message || `HTTP ${status}`,
          type: 'server',
          retryable: status >= 500,
          userFriendlyMessage: error.response.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
        };
    }
  }

  // Bilinmeyen hatalar
  return {
    message: error.message || 'Unknown Error',
    type: 'unknown',
    retryable: false,
    userFriendlyMessage: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
  };
};

export const shouldRetryRequest = (error: any): boolean => {
  const errorInfo = parseApiError(error);
  return errorInfo.retryable;
};

export const getUserFriendlyErrorMessage = (error: any): string => {
  const errorInfo = parseApiError(error);
  return errorInfo.userFriendlyMessage;
};

export const logError = (error: any, context?: string): void => {
  const errorInfo = parseApiError(error);
  
  logger.error(`❌ ${context || 'Error'}:`, {
    message: errorInfo.message,
    type: errorInfo.type,
    retryable: errorInfo.retryable,
    originalError: error
  });
}; 