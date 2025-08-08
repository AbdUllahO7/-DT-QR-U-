import { httpClient } from "../utils/http";
import { logger } from "../utils/logger";

// Types/Interfaces - Updated to match your exact API response
interface APIAllergen {
  id: number;
  code: string;
  name: string;
  icon: string;
  displayOrder: number;
  description: string;
}

interface Allergen {
  id: number;
  code: string;
  name: string;
  icon: string;
  displayOrder: number;
  description: string;
}

// Allergen Service Class
class AllergenService {
  private baseUrl = '/api';

  // Allergen listesini getir
  async getAllergens(): Promise<Allergen[]> {
    try {
      logger.info('Allergen listesi getiriliyor');
      
      const response = await httpClient.get<APIAllergen[]>(`${this.baseUrl}/Allergen`);
      
      logger.info('Allergen listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // Transform API response to internal format (in this case, they're identical)
      const transformedAllergens: Allergen[] = response.data
        .map((apiAllergen: APIAllergen) => ({
          id: apiAllergen.id,
          code: apiAllergen.code,
          name: apiAllergen.name,
          icon: apiAllergen.icon,
          displayOrder: apiAllergen.displayOrder,
          description: apiAllergen.description,
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder); // Sort by displayOrder
      
      return transformedAllergens;
    } catch (error: any) {
      logger.error('❌ Allergen listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Belirli bir alerjeni getir
  async getAllergenById(id: number): Promise<Allergen> {
    try {
      logger.info('Allergen detayı getiriliyor', { id });
      
      const response = await httpClient.get<APIAllergen>(`${this.baseUrl}/Allergen/${id}`);
      
      logger.info('Allergen detayı başarıyla getirildi', { data: response.data });
      
      const transformedAllergen: Allergen = {
        id: response.data.id,
        code: response.data.code,
        name: response.data.name,
        icon: response.data.icon,
        displayOrder: response.data.displayOrder,
        description: response.data.description,
      };
      
      return transformedAllergen;
    } catch (error: any) {
      logger.error('❌ Allergen detayı getirilirken hata:', error);
      throw error;
    }
  }

  // Aktif alerjenleri getir (eğer API'de aktif/pasif durumu varsa)
  async getActiveAllergens(): Promise<Allergen[]> {
    try {
      const allAllergens = await this.getAllergens();
      // Tüm alerjenler aktif olarak kabul ediliyor, ancak ihtiyaç halinde filtreleme yapılabilir
      return allAllergens;
    } catch (error: any) {
      logger.error('❌ Aktif allergen listesi getirilirken hata:', error);
      throw error;
    }
  }

  // Allergen koduna göre getir
  async getAllergenByCode(code: string): Promise<Allergen | null> {
    try {
      const allAllergens = await this.getAllergens();
      const allergen = allAllergens.find(a => a.code === code);
      return allergen || null;
    } catch (error: any) {
      logger.error('❌ Allergen koda göre getirilirken hata:', error);
      throw error;
    }
  }
}

// Usage example
export { AllergenService, type Allergen, type APIAllergen };