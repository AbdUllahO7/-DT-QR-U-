import { httpClient } from '../utils/http';
import { logger } from '../utils/logger';

export interface OverviewChartsResponse {
  weeklyViews: any[];
  popularProducts: any[];
  monthlyRevenue: any[];
}

class DashboardService {
  private baseUrl = '/api/Dashboard';
  private hasCheckedEndpoints = false;
  private availableEndpoint: string | null = null;

  // Genel bakış grafikleri
  async getOverviewCharts(): Promise<OverviewChartsResponse> {
    try {
      // Endpoint'leri sadece bir kez kontrol et
      if (!this.hasCheckedEndpoints) {
        await this.checkAvailableEndpoints();
      }

      // Eğer hiçbir endpoint mevcut değilse, boş veri döndür
      if (!this.availableEndpoint) {
        logger.warn('Dashboard endpoint\'leri mevcut değil, boş veri döndürülüyor', null, { prefix: 'DashboardService' });
        return {
          weeklyViews: [],
          popularProducts: [],
          monthlyRevenue: []
        };
      }

      // Mevcut endpoint'i kullan
      const response = await httpClient.get<OverviewChartsResponse>(`${this.baseUrl}/${this.availableEndpoint}`);
      logger.debug(`Dashboard verileri başarıyla alındı: ${this.availableEndpoint}`, null, { prefix: 'DashboardService' });
      return response.data;
    } catch (error: any) {
      // 404 hatalarını sessizce işle
      if (error.response?.status === 404) {
        logger.warn('Dashboard endpoint mevcut değil, boş veri döndürülüyor', null, { prefix: 'DashboardService' });
        return {
          weeklyViews: [],
          popularProducts: [],
          monthlyRevenue: []
        };
      }

      // Diğer hatalar için log göster
      logger.error('Overview grafik verileri alınırken hata:', error, { prefix: 'DashboardService' });
      
      // Hata durumunda boş veri döndür
      return {
        weeklyViews: [],
        popularProducts: [],
        monthlyRevenue: []
      };
    }
  }

  // Mevcut endpoint'leri kontrol et (sessizce)
  private async checkAvailableEndpoints(): Promise<void> {
    const endpoints = ['overview-charts', 'charts', 'overview'];
    
    for (const endpoint of endpoints) {
      try {
        await httpClient.get(`${this.baseUrl}/${endpoint}`);
        this.availableEndpoint = endpoint;
        logger.debug(`Dashboard endpoint bulundu: ${endpoint}`, null, { prefix: 'DashboardService' });
        break;
      } catch (error: any) {
        if (error.response?.status === 404) {
          // 404 hatalarını sessizce geç
          continue;
        }
        // 404 dışındaki hatalar için endpoint'i kullanmaya devam et
        this.availableEndpoint = endpoint;
        logger.debug(`Dashboard endpoint kullanılacak: ${endpoint}`, null, { prefix: 'DashboardService' });
        break;
      }
    }
    
    this.hasCheckedEndpoints = true;
    
    if (!this.availableEndpoint) {
      logger.debug('Hiçbir dashboard endpoint\'i mevcut değil', null, { prefix: 'DashboardService' });
    }
  }

  // Dashboard genel verilerini al (alternatif)
  async getDashboardStats(): Promise<any> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      logger.error('Dashboard istatistikleri alınırken hata:', error, { prefix: 'DashboardService' });
      return null;
    }
  }
}

export const dashboardService = new DashboardService(); 