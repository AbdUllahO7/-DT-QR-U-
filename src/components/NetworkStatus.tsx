import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface NetworkStatusProps {
  showAlways?: boolean;
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  showAlways = false, 
  className = '' 
}) => {
  const { isOnline, isConnecting, testConnection } = useNetworkStatus();

  // Sadece offline durumunda veya showAlways true ise göster
  if (!showAlways && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300
        ${isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
        }
        ${isConnecting ? 'animate-pulse' : ''}
      `}>
        {isConnecting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        
        <span className="text-sm font-medium">
          {isConnecting 
            ? 'Bağlantı test ediliyor...' 
            : isOnline 
              ? 'Çevrimiçi' 
              : 'Çevrimdışı'
          }
        </span>
        
        {!isOnline && (
          <button
            onClick={testConnection}
            className="ml-2 px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
            disabled={isConnecting}
          >
            Yenile
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus; 