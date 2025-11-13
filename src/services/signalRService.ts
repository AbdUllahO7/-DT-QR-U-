import * as signalR from "@microsoft/signalr";
import { logger } from "../utils/logger";

class SignalRService {
  public connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 saniye
  private connectionPromise: Promise<void> | null = null;

  async startConnection(token: string) {
    // Eğer zaten bağlanıyorsa, mevcut promise'i döndür
    if (this.isConnecting && this.connectionPromise) {
      logger.signalR('warn', "Bağlantısı zaten kuruluyor, bekleniyor...");
      return this.connectionPromise;
    }

    // Eğer zaten bağlıysa, yeni bağlantı kurma
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      logger.signalR('info', "Zaten bağlı");
      return Promise.resolve();
    }

    this.isConnecting = true;

    this.connectionPromise = this._startConnection(token);
    return this.connectionPromise;
  }

  private async _startConnection(token: string) {
    try {
      // Mevcut bağlantıyı temizle
      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
      }

      // Environment değişkenlerinden URL'yi al
      const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7001";
      const signalRUrl = import.meta.env.VITE_SIGNALR_URL || `${apiUrl}/hubs/table`;
      
      logger.signalR('info', "SignalR bağlantısı başlatılıyor", { 
        apiUrl, 
        signalRUrl,
        isDev: import.meta.env.DEV 
      });

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(signalRUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false, // Negotiation'ı etkinleştir
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) {
              return 0;
            }
            if (retryContext.previousRetryCount < this.maxRetries) {
              return this.retryDelay;
            }
            return null; // Yeniden bağlanmayı durdur
          }
        })
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      // Bağlantı durumu değişikliklerini dinle
      this.connection.onreconnecting((error) => {
        logger.signalR('warn', "Yeniden bağlanıyor...", error);
      });

      this.connection.onreconnected((connectionId) => {
        logger.signalR('info', "Yeniden bağlandı", { connectionId });
        this.retryCount = 0;
      });

      this.connection.onclose((error) => {
        logger.signalR('warn', "Bağlantısı kapandı", error);
        this.isConnecting = false;
        this.connectionPromise = null;
      });

      await this.connection.start();
      logger.signalR('info', "Başarıyla bağlandı");
      this.retryCount = 0;
    } catch (err) {
      this.retryCount++;
      logger.signalR('error', "Bağlantı hatası", err);
      
      // Retry mekanizması
      if (this.retryCount < this.maxRetries) {
        logger.signalR('info', `Yeniden deneniyor (${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => {
          this.isConnecting = false;
          this.connectionPromise = null;
          this.startConnection(token);
        }, this.retryDelay);
      } else {
        logger.signalR('error', "Maksimum deneme sayısına ulaştı, bağlantı kurulamadı");
        this.isConnecting = false;
        this.connectionPromise = null;
      }
    } finally {
      this.isConnecting = false;
    }
  }

  // TableHub Public Methods (Dokümantasyona göre)
  async joinBranchGroup(branchId: number) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("JoinBranchGroup", branchId);
        logger.signalR('info', "Branch grubuna katılındı", { branchId });
      } catch (error) {
        logger.signalR('error', "Branch grubuna katılma hatası", { branchId, error });
      }
    } else {
      logger.signalR('warn', "Bağlı değil, branch grubuna katılınamıyor", { branchId });
    }
  }

  async leaveBranchGroup(branchId: number) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeaveBranchGroup", branchId);
        logger.signalR('info', "Branch grubundan ayrılındı", { branchId });
      } catch (error) {
        logger.signalR('error', "Branch grubundan ayrılma hatası", { branchId, error });
      }
    }
  }

  async requestTableStatus(branchId: number) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("RequestTableStatus", branchId);
        logger.signalR('info', "Masa durumu istendi", { branchId });
      } catch (error) {
        logger.signalR('error', "Masa durumu isteme hatası", { branchId, error });
      }
    } else {
      logger.signalR('warn', "Bağlı değil, Masa durumu istenemiyor", { branchId });
    }
  }

  // TableHub Events (Dokümantasyona göre)
  onTableChanged(callback: (data: any) => void) {
    if (this.connection) {
      this.connection.on("TableChanged", (data) => {
        logger.signalR('info', "Masa değişikliği alındı", data);
        callback(data);
      });
    }
  }

  onTablesBatchCreated(callback: (data: any) => void) {
    if (this.connection) {
      this.connection.on("TablesBatchCreated", (data) => {
        logger.signalR('info', "Toplu Masa oluşturma alındı", data);
        callback(data);
      });
    }
  }

  onTableCategoryChanged(callback: (data: any) => void) {
    if (this.connection) {
      this.connection.on("TableCategoryChanged", (data) => {
        logger.signalR('info', "Masa kategorisi değişikliği alındı", data);
        callback(data);
      });
    }
  }

  onTableStatusChanged(callback: (data: any) => void) {
    if (this.connection) {
      this.connection.on("TableStatusChanged", (data) => {
        logger.signalR('info', "Masa durumu değişikliği alındı", data);
        callback(data);
      });
    }
  }

  onRefreshTableList(callback: (data: any) => void) {
    if (this.connection) {
      this.connection.on("RefreshTableList", (data) => {
        logger.signalR('info', "Masa listesi yenileme sinyali alındı", data);
        callback(data);
      });
    }
  }

  onError(callback: (message: string) => void) {
    if (this.connection) {
      this.connection.on("Error", (message) => {
        logger.signalR('error', "Sunucu hatası", message);
        callback(message);
      });
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        logger.signalR('info', "Bağlantısı durduruldu");
      } catch (error) {
        logger.signalR('error', "Bağlantısı durdurma hatası", error);
      }
    }
  }

  // Bağlantı durumunu kontrol et
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Bağlantı durumunu al
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }
}

export default new SignalRService(); 