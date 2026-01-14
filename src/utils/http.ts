import axios, { AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';
import { logger } from './logger';
import { shouldRetryRequest } from './errorHandler';
import { authStorage } from './authStorage';

// Extend AxiosRequestConfig to include skipAuth flag
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

const BASE_URL = import.meta.env.DEV ? 'http://localhost:7001' : 'https://api.mertcode.com';
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
  (config: CustomAxiosRequestConfig) => {
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
          skipAuth: config.skipAuth
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

    // Skip adding auth token if this is marked as a public request
    if (config.skipAuth === true) {
      if (import.meta.env.DEV) {
        logger.info('🔓 Public request - NO authentication token will be sent for:', config.url);
      }
      return config;
    }

    // Context-aware token selection based on current page and request URL
    // This prevents session conflicts between Dashboard, OnlineMenu, and TableQR
    const currentPath = window.location.pathname;
    const requestUrl = config.url || '';

    let token: string | null = null;
    let tokenSource = '';

    // 1. TableQR context - uses table_session_token
    if (currentPath.includes('/table/qr/') || requestUrl.includes('/api/session/') || requestUrl.includes('/api/table/')) {
      token = localStorage.getItem('table_session_token');
      tokenSource = 'TableQR';
    }
    // 2. OnlineMenu context - uses online_menu_token
    else if (currentPath.includes('/OnlineMenu') || requestUrl.includes('/api/online/')) {
      token = localStorage.getItem('online_menu_token');
      tokenSource = 'OnlineMenu';
    }
    // 3. Dashboard/Admin context - uses dashboard_token via authStorage
    else {
      token = authStorage.getRawToken();
      tokenSource = 'Dashboard';
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV && !config.url?.includes('/api/Dashboard')) {
        logger.info(`🔑 Token added (${tokenSource}):`, `Bearer ${token.substring(0, 15)}...`);
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
  (response) => {
    // Başarılı yanıtları logla
    if (import.meta.env.DEV) {
      if (response.config.url?.includes('/api/Dashboard')) {
        logger.debug('✅ Dashboard Response:', {
          status: response.status,
          url: response.config.url
        });
      } else {
        logger.info('✅ Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
      }

      // Special logging for login endpoint
      if (response.config.url?.includes('/api/Auth/Login')) {
    
        logger.info('🔐 Login Response Details:', {
          status: response.status,
          dataType: typeof response.data,
          dataKeys: response.data ? Object.keys(response.data) : 'null',
          hasAccessToken: !!(response.data?.accessToken),
          data: response.data
        });
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network bağlantısı hatası
    if (!error.response) {
      logger.error('❌ Network Error:', {
        message: error.message,
        url: originalRequest?.url
      });

      const networkError: ApiError = {
        status: 0,
        message: getOfflineErrorMessage(),
        errors: undefined,
        response: undefined
      };

      // Retry mekanizması
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        return retryRequest(originalRequest, error);
      }

      return Promise.reject(networkError);
    }

    // API hata yanıtını logla
    if (import.meta.env.DEV) {
      logger.error('❌ API Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        data: error.response?.data
      });
    }

    // 401 Unauthorized - Token geçersiz veya süresi dolmuş
    if (error.response?.status === 401) {
      // Don't redirect to login for public pages and auth endpoints
      const isAuthEndpoint = originalRequest?.url?.includes('/api/Auth/');
      const isOnboardingEndpoint = originalRequest?.url?.includes('/api/Restaurant') ||
                                   originalRequest?.url?.includes('/api/Branch/CreateOnboardingBranch');
      const isOnboardingPage = window.location.pathname.includes('/onboarding');
      const isPublicMenuPage = window.location.pathname.includes('/table/qr/') ||
                               window.location.pathname.includes('/OnlineMenu');
      const isPublicEndpoint = originalRequest?.url?.includes('/api/Table/') ||
                              originalRequest?.url?.includes('/api/OnlineMenu/');
      // Don't logout on currency API failures - currency is not critical
      const isCurrencyEndpoint = originalRequest?.url?.includes('/api/Currencies/');

      if (!isAuthEndpoint && !isOnboardingEndpoint && !isOnboardingPage && !isPublicMenuPage && !isPublicEndpoint && !isCurrencyEndpoint) {
        logger.warn('⚠️ 401 Unauthorized - Token geçersiz, kullanıcı oturumu kapatılıyor');

        // SECURITY FIX: Use authStorage for centralized auth clearing
        authStorage.clearAuth();

        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // ApiError formatında hata döndür
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.errorMessage ||
               error.response?.data?.message ||
               error.message ||
               'Bir hata oluştu',
      errors: error.response?.data?.errors,
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

// Get restaurant ID from token (uses dashboard token)
export const getRestaurantIdFromToken = (): number | null => {
  try {
    const token = authStorage.getRawToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded?.restaurant_id || null;
  } catch (error) {
    console.error('Restaurant ID alınırken hata:', error);
    return null;
  }
};

// Get branch ID from token (uses dashboard token)
export const getBranchIdFromToken = (): number | null => {
  try {
    const token = authStorage.getRawToken();
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
    const token = authStorage.getRawToken();
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

/**
 * Get the effective branch ID to use for API calls.
 * Priority:
 * 1. Selected branch from localStorage (when restaurant user selects a branch)
 * 2. Branch ID from JWT token (for branch-only users)
 * 3. null if neither exists
 */
export const getEffectiveBranchId = (): number | null => {
  try {
    // First, check if there's a selected branch in localStorage (restaurant user selection)
    const selectedBranchId = localStorage.getItem('selectedBranchId');
    if (selectedBranchId) {
      const parsed = parseInt(selectedBranchId, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    // Fall back to branch ID from token (for branch-only users)
    return getBranchIdFromToken();
  } catch (error) {
    console.error('Effective branch ID alınırken hata:', error);
    return getBranchIdFromToken();
  }
}; 

