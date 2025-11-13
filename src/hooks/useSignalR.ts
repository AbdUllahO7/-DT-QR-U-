import { useEffect, useRef, useCallback } from 'react';
import signalRService from '../services/signalRService';
import { logger } from '../utils/logger';
import { SignalRCallbacks, SignalRServiceReturn } from '../types/signalR';

export const useSignalR = (
  token: string, 
  branchId: number, 
  callbacks: SignalRCallbacks = {}
): SignalRServiceReturn => {
  const isInitialized = useRef(false);
  const currentBranchId = useRef<number | null>(null);

  const initializeSignalR = useCallback(async () => {
    // Token veya branchId yoksa SignalR başlatma
    if (!token || !branchId) {
      logger.signalR('warn', "Başlatılamıyor: token veya branchId eksik", { token: !!token, branchId });
      return false;
    }

    // Zaten başlatılmışsa tekrar başlatma
    if (isInitialized.current && currentBranchId.current === branchId) {
      logger.signalR('info', "Zaten başlatılmış");
      return true;
    }

    try {
      logger.signalR('info', "Başlatılıyor", { branchId });
      await signalRService.startConnection(token);
      
      // Bağlantı başarılıysa branch grubuna katıl
      if (signalRService.isConnected()) {
        // Önceki branch'ten ayrıl
        if (currentBranchId.current && currentBranchId.current !== branchId) {
          await signalRService.leaveBranchGroup(currentBranchId.current);
        }
        
        // Yeni branch'e katıl
        await signalRService.joinBranchGroup(branchId);
        
        // Masa durumu iste (ilk yükleme için)
        await signalRService.requestTableStatus(branchId);
        
        // Event listener'ları kaydet
        if (callbacks.onTableChanged) {
          signalRService.onTableChanged(callbacks.onTableChanged);
        }
        
        if (callbacks.onTablesBatchCreated) {
          signalRService.onTablesBatchCreated(callbacks.onTablesBatchCreated);
        }
        
        if (callbacks.onTableCategoryChanged) {
          signalRService.onTableCategoryChanged(callbacks.onTableCategoryChanged);
        }
        
        if (callbacks.onTableStatusChanged) {
          signalRService.onTableStatusChanged(callbacks.onTableStatusChanged);
        }
        
        if (callbacks.onRefreshTableList) {
          signalRService.onRefreshTableList(callbacks.onRefreshTableList);
        }
        
        if (callbacks.onError) {
          signalRService.onError((message) => {
            callbacks.onError!({ message, code: undefined, details: undefined });
          });
        } else {
          // Default error handler
          signalRService.onError((message) => {
            logger.signalR('error', "Sunucu hatası", message);
          });
        }
        
        isInitialized.current = true;
        currentBranchId.current = branchId;
        logger.signalR('info', "Başarıyla başlatıldı", { branchId });
        return true;
      } else {
        logger.signalR('warn', "Bağlantısı kurulamadı", { branchId });
        return false;
      }
    } catch (error) {
      logger.signalR('error', "Başlatma hatası", error);
      return false;
    }
  }, [token, branchId, callbacks]);

  useEffect(() => {
    initializeSignalR();

    // Cleanup function
    return () => {
      if (isInitialized.current) {
        logger.signalR('info', "Temizleniyor", { branchId });
        signalRService.stopConnection();
        isInitialized.current = false;
        currentBranchId.current = null;
      }
    };
  }, [initializeSignalR]);

  // Branch değiştiğinde grubu değiştir
  useEffect(() => {
    if (signalRService.isConnected() && branchId && currentBranchId.current !== branchId) {
      const updateBranch = async () => {
        try {
          // Önceki branch'ten ayrıl
          if (currentBranchId.current) {
            await signalRService.leaveBranchGroup(currentBranchId.current);
          }
          
          // Yeni branch'e katıl
          await signalRService.joinBranchGroup(branchId);
          
          // Masa durumu iste
          await signalRService.requestTableStatus(branchId);
          
          currentBranchId.current = branchId;
          logger.signalR('info', "Branch değiştirildi", { branchId });
        } catch (error) {
          logger.signalR('error', "Branch değiştirme hatası", { branchId, error });
        }
      };
      
      updateBranch();
    }
  }, [branchId]);

  return {
    isConnected: signalRService.isConnected(),
    connectionState: signalRService.getConnectionState() as any,
    reconnect: () => {
      isInitialized.current = false;
      currentBranchId.current = null;
      initializeSignalR();
    },
    requestTableStatus: () => {
      if (branchId) {
        signalRService.requestTableStatus(branchId);
      }
    }
  };
}; 