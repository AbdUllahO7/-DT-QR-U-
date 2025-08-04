import { httpClient } from '../utils/http';
import { Order } from '../types/dashboard';

// Sipariş servis işlemleri
export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await httpClient.get('/api/Orders');
      // API'ın döndürdüğü veri doğrudan dizi ise
      if (Array.isArray(response.data)) {
        return response.data as Order[];
      }
      // Eğer ApiResponse sarmalında ise
      if (Array.isArray(response.data?.data)) {
        return response.data.data as Order[];
      }
      return [];
    } catch (error) {
      console.error('Siparişler alınamadı:', error);
      return [];
    }
  },
}; 