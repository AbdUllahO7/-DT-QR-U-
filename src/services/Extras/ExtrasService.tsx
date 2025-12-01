import { 
  APIExtra, 
  Extra, 
  CreateExtraData, 
  UpdateExtraData,
  ReorderExtrasData
} from '../../types/Extras/type';
import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

class ExtrasService {
  private baseUrl = '/api/Extras';

  // GET - Get all extras
  async getExtras(): Promise<Extra[]> {
    try {
      logger.info('Extra listesi getiriliyor');
      
      const response = await httpClient.get<APIExtra[]>(`${this.baseUrl}`);
      
      logger.info('Extra listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra listesi getirilirken hata:', error);
      throw error;
    }
  }

  // GET - Get extra by ID
  async getExtraById(id: number): Promise<Extra> {
    try {
      logger.info('Extra detayı getiriliyor', { id });
      
      const response = await httpClient.get<APIExtra>(`${this.baseUrl}/${id}`);
      
      logger.info('Extra detayı başarıyla getirildi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra detayı getirilirken hata:', error);
      throw error;
    }
  }

  // POST - Create new extra
  async createExtra(extraData: CreateExtraData): Promise<Extra> {
    try {
      const payload = {
        extraCategoryId: extraData.extraCategoryId,
        name: extraData.name,
        description: extraData.description,
        basePrice: extraData.basePrice,
        isRemoval: extraData.isRemoval,
        imageUrl: extraData.imageUrl,
        status: extraData.status
      };
      
      logger.info('Extra ekleme isteği gönderiliyor', { payload });
      console.log("Creating Extra with payload:", payload);
      
      const response = await httpClient.post<APIExtra>(`${this.baseUrl}`, payload);
      
      logger.info('Extra başarıyla eklendi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra eklenirken hata:', error);
      throw error;
    }
  }

  // PUT - Update extra
  async updateExtra(extraData: UpdateExtraData): Promise<Extra> {
    try {
      const payload = {
        extraCategoryId: extraData.extraCategoryId,
        name: extraData.name,
        description: extraData.description,
        basePrice: extraData.basePrice,
        isRemoval: extraData.isRemoval,
        imageUrl: extraData.imageUrl,
        status: extraData.status
      };
      
      logger.info('Extra güncelleme isteği gönderiliyor', { 
        id: extraData.id, 
        payload 
      });
      
      const response = await httpClient.put<APIExtra>(
        `${this.baseUrl}/${extraData.id}`, 
        payload
      );
      
      logger.info('Extra başarıyla güncellendi', { data: response.data });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Extra güncellenirken hata:', error);
      throw error;
    }
  }

  // DELETE - Delete extra
  async deleteExtra(id: number): Promise<void> {
    try {
      logger.info('Extra silme isteği gönderiliyor', { id });
      
      await httpClient.delete(`${this.baseUrl}/${id}`);
      
      logger.info('Extra başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Extra silinirken hata:', error);
      throw error;
    }
  }

  // GET - Get deleted extras
  async getDeletedExtras(): Promise<Extra[]> {
    try {
      logger.info('Silinmiş extra listesi getiriliyor');
      
      const response = await httpClient.get<APIExtra[]>(`${this.baseUrl}/deleted`);
      
      logger.info('Silinmiş extra listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      return response.data;
    } catch (error: any) {
      logger.error('❌ Silinmiş extra listesi getirilirken hata:', error);
      throw error;
    }
  }

  // POST - Reorder extras
  async reorderExtras(reorderData: ReorderExtrasData): Promise<void> {
    try {
      logger.info('Extra sıralama isteği gönderiliyor', { reorderData });
      
      await httpClient.post(`${this.baseUrl}/reorder`, reorderData);
      
      logger.info('Extralar başarıyla sıralandı');
    } catch (error: any) {
      logger.error('❌ Extralar sıralanırken hata:', error);
      throw error;
    }
  }

  // POST - Restore deleted extra
  async restoreExtra(id: number): Promise<void> {
    try {
      logger.info('Extra geri yükleme isteği gönderiliyor', { id });
      
      await httpClient.post(`${this.baseUrl}/${id}/restore`);
      
      logger.info('Extra başarıyla geri yüklendi', { id });
    } catch (error: any) {
      logger.error('❌ Extra geri yüklenirken hata:', error);
      throw error;
    }
  }
}

export const extrasService = new ExtrasService();