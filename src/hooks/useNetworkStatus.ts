import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

interface NetworkStatus {
  isOnline: boolean;
  isConnecting: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isConnecting: false,
    lastOnline: null,
    lastOffline: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      logger.info('🌐 İnternet bağlantısı geri geldi');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        isConnecting: false,
        lastOnline: new Date(),
      }));
    };

    const handleOffline = () => {
      logger.warn('📡 İnternet bağlantısı kesildi');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastOffline: new Date(),
      }));
    };

    // Network bağlantısı değişikliklerini dinle
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Component unmount olduğunda event listener'ları temizle
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Network bağlantısını test et
  const testConnection = async (): Promise<boolean> => {
    try {
      setNetworkStatus(prev => ({ ...prev, isConnecting: true }));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://localhost:7001/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const isConnected = response.ok;
      
      if (isConnected) {
        logger.info('✅ Network bağlantısı test edildi - Başarılı');
      } else {
        logger.warn('⚠️ Network bağlantısı test edildi - Başarısız');
      }
      
      setNetworkStatus(prev => ({ 
        ...prev, 
        isOnline: isConnected,
        isConnecting: false 
      }));
      
      return isConnected;
    } catch (error) {
      logger.error('❌ Network bağlantısı test edilirken hata:', error);
      setNetworkStatus(prev => ({ 
        ...prev, 
        isOnline: false,
        isConnecting: false 
      }));
      return false;
    }
  };

  return {
    ...networkStatus,
    testConnection,
  };
}; 