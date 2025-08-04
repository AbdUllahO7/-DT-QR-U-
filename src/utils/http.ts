import axios from 'axios';
import type { ApiError } from '../types/api';
import { logger } from './logger';
import { getUserFriendlyErrorMessage, shouldRetryRequest } from './errorHandler';

const BASE_URL = import.meta.env.DEV ? 'https://localhost:7001' : 'https://localhost:7001';

// Network bağlantısı kontrolü
const checkNetworkConnection = (): boolean => {
  return navigator.onLine;
};



// Offline durumu için özel hata mesajı
const getOfflineErrorMessage = (): string => {
  if (!checkNetworkConnection()) {
    return 'İnternet bağlantınız kesilmiş. Lütfen bağlantınızı kontrol edin.';
  }
  return 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
};

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 saniye timeout (daha makul bir süre)
  withCredentials: true, // CORS için gerekli
});

// Retry mekanizması - iyileştirildi
const MAX_RETRIES = 3; // 2'den 3'e çıkarıldı
const RETRY_DELAY = 2000; // 1 saniyeden 2 saniyeye çıkarıldı

async function retryRequest(config: any, error: any, retryCount = 0): Promise<any> {
  // Maksimum deneme sayısına ulaşıldıysa hata fırlat
  if (retryCount >= MAX_RETRIES) {
    return Promise.reject(error);
  }

  // Yeni error handler kullanarak retry kararı ver
  if (shouldRetryRequest(error)) {
    logger.info(`🔄 Retry attempt ${retryCount + 1}/${MAX_RETRIES} for ${config.method} ${config.url}`);
    
    // Yeniden denemeden önce bekle (exponential backoff)
    const delay = RETRY_DELAY * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // Yeni bir istek oluştur
      const newConfig = { ...config };
      delete newConfig._retry; // Sonsuz loop'u önle
      return await axios(newConfig);
    } catch (newError) {
      // Yeniden deneme başarısız olursa, tekrar dene
      return retryRequest(config, newError, retryCount + 1);
    }
  }
  
  // Yeniden deneme koşulları sağlanmıyorsa hata fırlat
  return Promise.reject(error);
}

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Network bağlantısını kontrol et
    if (!checkNetworkConnection()) {
      const offlineError: ApiError = {
        status: 0,
        message: getOfflineErrorMessage(),
        errors: undefined,
        response: undefined
      };
      return Promise.reject(offlineError);
    }

    // Sadece development'ta ve önemli isteklerde detaylı log göster
    if (import.meta.env.DEV) {
      // Dashboard endpoint'leri için daha az log
      if (config.url?.includes('/api/Dashboard')) {
        logger.debug('🚀 Dashboard Request:', {
          method: config.method?.toUpperCase(),
          url: config.url
        });
      } else {
        logger.info('🚀 Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          headers: config.headers
        });
      }
    }
    
    // Batch işlemler için özel timeout konfigürasyonu
    if (config.url?.includes('/batch') || config.headers?.['X-Request-Type'] === 'batch-operation') {
      config.timeout = 120000; // 2 dakika
      if (import.meta.env.DEV) {
        logger.info('⏱️ Batch işlem için uzun timeout ayarlandı');
      }
    }
    
    // Önce müşteri session token'ı kontrol et
    const customerSessionToken = localStorage.getItem('customerSessionToken');
    if (customerSessionToken) {
      config.headers.Authorization = `Bearer ${customerSessionToken}`;
      if (import.meta.env.DEV) {
        logger.debug('Customer session token kullanılıyor');
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (import.meta.env.DEV && !config.url?.includes('/api/Dashboard')) {
          logger.info('Token eklendi:', `Bearer ${token.substring(0, 15)}...`);
        }
        // Token'ın geçerlilik süresini kontrol et
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (tokenExpiry) {
          const expiryDate = new Date(tokenExpiry);
          if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
            logger.warn('⚠️ Token süresi dolmuş veya geçersiz!');
          }
        }
      } else {
        // Token yoksa hata fırlat
        if (config.url?.includes('/api/Restaurants/branches') || 
            config.url?.includes('/api/Branches') ||
            config.url?.includes('/api/Dashboard')) {
          logger.error('Token bulunamadı, API isteği yapılamıyor', { url: config.url });
          const authError: ApiError = {
            status: 401,
            message: 'Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.',
            errors: undefined,
            response: undefined
          };
          return Promise.reject(authError);
        }
      }
    }
    
    return config;
  },
  (error) => {
    logger.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  async (response) => {
    // Sadece development'ta ve önemli yanıtlarda detaylı log göster
    if (import.meta.env.DEV) {
      // Dashboard endpoint'leri için daha az log
      if (response.config.url?.includes('/api/Dashboard')) {
        logger.debug('✅ Dashboard Response:', {
          status: response.status,
          url: response.config.url
        });
      } else {
        logger.info('✅ Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers,
          url: response.config.url
        });
      }
    }
    
    // Users endpoint için özel kontrol
    if (response.config.url?.includes('/api/Users')) {
      if (import.meta.env.DEV) {
        logger.info('👤 Users endpoint response detected');
        logger.info('👤 Users response.data:', response.data);
      }
      
      // Users endpoint direkt UserProfileResponse döndürüyor, ApiResponse wrapper'ı yok
      if (response.data?.appUser && response.data?.appRoles) {
        return response;
      }
      
      // Nested format
      if (response.data?.data?.appUser && response.data?.data?.appRoles) {
        return response;
      }
      
      // Başarısız yanıt
      if (response.data?.success === false) {
        const apiError: ApiError = {
          status: response.status,
          message: response.data?.message || 'Kullanıcı bilgileri alınamadı',
          errors: response.data?.errors || undefined,
          response: response
        };
        return Promise.reject(apiError);
      }
    }
    
    // Login endpoint için özel kontrol
    if (response.config.url?.includes('/api/Auth/Login')) {
      if (response.data?.accessToken) {
        return response;
      }
      
      if (response.status === 200 && typeof response.data === 'object' && response.data !== null) {
        return response;
      }
    }
    
    // Register endpoint için özel kontrol
    if (response.config.url?.includes('/api/Auth/Register')) {
      if (response.status === 201 && response.data?.userId) {
        return response;
      }
    }
    
    // Başarılı yanıt ama data içinde success: false varsa hata olarak ele al
    if (response.data?.success === false) {
      const apiError: ApiError = {
        status: response.status,
        message: response.data?.message || 'İşlem başarısız oldu',
        errors: response.data?.errors || undefined,
        response: response
      };
      return Promise.reject(apiError);
    }
    
    return response;
  },
  async (error) => {
    // Dashboard endpoint'leri için daha sessiz hata logları
    if (error.config?.url?.includes('/api/Dashboard')) {
      if (error.response?.status === 404) {
        logger.debug('🔍 Dashboard endpoint mevcut değil:', error.config.url);
      } else {
        logger.error('❌ Dashboard Response Error:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        });
      }
    } else {
      logger.error('❌ Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
    }
    
    // Login endpoint için özel hata işleme
    if (error.config?.url?.includes('/api/Auth/Login')) {
      if (error.response?.status === 200 && error.response.data?.accessToken) {
        const modifiedResponse = {
          ...error.response,
          data: error.response.data
        };
        return Promise.resolve(modifiedResponse);
      }
    }
    
    // Retry mekanizması için orijinal config'i kaydet
    const originalConfig = error.config;
    
    // Network hataları için özel işleme
    if (error.message && (error.message.includes('Network Error') || error.message.includes('CORS') || error.message.includes('ERR_EMPTY_RESPONSE'))) {
      logger.warn('⚠️ Network veya CORS hatası, retry yapılmıyor');
      
      const apiError: ApiError = {
        status: 0,
        message: getUserFriendlyErrorMessage(error),
        errors: undefined,
        response: error.response
      };
      return Promise.reject(apiError);
    }
    
    // Timeout hatası için özel mesaj
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      logger.warn('⚠️ İstek zaman aşımına uğradı');
      
      // Batch işlemler için özel timeout mesajı
      const isBatchOperation = error.config?.url?.includes('/batch') || 
                              error.config?.headers?.['X-Request-Type'] === 'batch-operation';
      
      if (isBatchOperation) {
        logger.warn('⚠️ Batch işlem zaman aşımına uğradı - daha uzun süre bekleniyor');
        // Batch işlemler için daha uzun timeout süresi
        if (originalConfig && !originalConfig._retry) {
          originalConfig._retry = true;
          originalConfig.timeout = 180000; // 3 dakika
          return retryRequest(originalConfig, error);
        }
      }
      
      if (originalConfig && !originalConfig._retry) {
        originalConfig._retry = true;
        return retryRequest(originalConfig, error);
      }
      
      const apiError: ApiError = {
        status: error.response?.status || 408,
        message: getUserFriendlyErrorMessage(error),
        errors: undefined,
        response: error.response
      };
      return Promise.reject(apiError);
    }
    
    // Retry mekanizması için kontrol
    if (originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;
      return retryRequest(originalConfig, error);
    }
    
    const apiError: ApiError = {
      status: error.response?.status || 0,
      message: getUserFriendlyErrorMessage(error),
      errors: error.response?.data?.errors || undefined,
      response: error.response
    };
    return Promise.reject(apiError);
  }
);

// JWT Token decode utility
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode hatası:', error);
    return null;
  }
};

// Get restaurant ID from token
export const getRestaurantIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = decodeToken(token);
    return decoded?.restaurant_id || null;
  } catch (error) {
    console.error('Restaurant ID alınırken hata:', error);
    return null;
  }
};

// Get branch ID from token
export const getBranchIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = decodeToken(token);
    return decoded?.branch_id || null;
  } catch (error) {
    console.error('Branch ID alınırken hata:', error);
    return null;
  }
};

// Check if user is branch-only user (has branch_id but no restaurant_id)
export const isBranchOnlyUser = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decoded = decodeToken(token);
    const hasRestaurantId = decoded?.restaurant_id && decoded?.restaurant_id !== "" && decoded?.restaurant_id !== null && decoded?.restaurant_id !== undefined;
    const hasBranchId = decoded?.branch_id && decoded?.branch_id !== "" && decoded?.branch_id !== null && decoded?.branch_id !== undefined;
    
    return !hasRestaurantId && hasBranchId;
  } catch (error) {
    console.error('Kullanıcı tipi kontrol edilirken hata:', error);
    return false;
  }
}; 