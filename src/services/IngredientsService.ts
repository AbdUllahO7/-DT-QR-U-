import { APIIngredient, CreateIngredientData, Ingredient, UpdateIngredientData, AllergenDetail } from '../types/dashboard';
import { httpClient } from "../utils/http";
import { logger } from "../utils/logger";

// Ingredients Service Class
class IngredientsService {
   private baseUrl = '/api';

  async createIngredient(ingredientData: CreateIngredientData): Promise<Ingredient> {
    try {
      const payload = {
        name: ingredientData.name,
        isAllergenic: ingredientData.isAllergenic,
        isAvailable: ingredientData.isAvailable,
        allergenIds: ingredientData.allergenIds,
        allergenDetails: ingredientData.allergenDetails,
      };
      
      logger.info('Malzeme ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post<APIIngredient>(`${this.baseUrl}/Ingredients`, payload);
      
      logger.info('Malzeme başarıyla eklendi', { data: response.data });
      
      // Transform API response to internal format
      const transformedIngredient: Ingredient = {
        id: response.data.ingredientId,
        name: response.data.name,
        isAllergenic: response.data.isAllergenic,
        isAvailable: response.data.isAvailable,
        // Transform allergens array to allergenIds and allergenDetails
        allergenIds: response.data.allergens?.map((allergen: any) => allergen.id) || [],
        allergenDetails: response.data.allergens?.map((allergen: any) => ({
          allergenId: allergen.id,
          containsAllergen: allergen.containsAllergen !== null ? allergen.containsAllergen : true,
          note: allergen.note || ''
        })) || []
      };
      
      return transformedIngredient;
    } catch (error: any) {
      logger.error('❌ Malzeme eklenirken hata:', error);
      throw error;
    }
  }

    // Malzeme güncelleme (PUT)
      async updateIngredient(ingredientData: UpdateIngredientData): Promise<Ingredient> {
      try {
          const payload = {
          ingredientId: ingredientData.id, // ← ADDED: Include ingredientId in payload
          name: ingredientData.name,
          isAllergenic: ingredientData.isAllergenic,
          isAvailable: ingredientData.isAvailable,
          allergenIds: ingredientData.allergenIds,
          allergenDetails: ingredientData.allergenDetails,
          };
          
          logger.info('Malzeme güncelleme isteği gönderiliyor', { 
          id: ingredientData.id, 
          payload 
          });
          
          const response = await httpClient.put<APIIngredient>(`${this.baseUrl}/Ingredients`, payload);
          
          logger.info('Malzeme başarıyla güncellendi', { data: response.data });
          
          // Transform API response to internal format
          const transformedIngredient: Ingredient = {
          id: response.data.ingredientId,
          name: response.data.name,
          isAllergenic: response.data.isAllergenic,
          isAvailable: response.data.isAvailable,
          // Transform allergens array to allergenIds and allergenDetails
          allergenIds: response.data.allergens?.map((allergen: any) => allergen.id) || [],
          allergenDetails: response.data.allergens?.map((allergen: any) => ({
              allergenId: allergen.id,
              containsAllergen: allergen.containsAllergen !== null ? allergen.containsAllergen : true,
              note: allergen.note || ''
          })) || []
          };
          
          return transformedIngredient;
      } catch (error: any) {
          logger.error('❌ Malzeme güncellenirken hata:', error);
          throw error;
      }
      }

  // Tüm malzemeleri getir (GET) - FIXED
  async getIngredients(): Promise<Ingredient[]> {
    try {
      logger.info('Malzeme listesi getiriliyor');
      
      const response = await httpClient.get<APIIngredient[]>(`${this.baseUrl}/Ingredients`, {
        params: {
          includes: 'allergens',
        }
      });

      
      logger.info('Malzeme listesi başarıyla getirildi', { 
        count: response.data.length 
      });
      
      // FIXED: Transform API response to internal format correctly
      const transformedIngredients: Ingredient[] = response.data.map((apiIngredient: any) => {
        
        return {
          id: apiIngredient.ingredientId,
          name: apiIngredient.name,
          isAllergenic: apiIngredient.isAllergenic,
          isAvailable: apiIngredient.isAvailable,
          // FIXED: Transform allergens array to allergenIds
          allergenIds: apiIngredient.allergens?.map((allergen: any) => allergen.id) || [],
          // FIXED: Transform allergens array to allergenDetails
          allergenDetails: apiIngredient.allergens?.map((allergen: any) => ({
            allergenId: allergen.id,
            containsAllergen: allergen.containsAllergen !== null ? allergen.containsAllergen : true,
            note: allergen.note || ''
          })) || []
        };
      });
      
      return transformedIngredients;
    } catch (error: any) {
      logger.error('❌ Malzeme listesi getirilirken hata:', error);
      throw error;
    }
  }

  // ID'ye göre malzeme getir (GET by ID)
  async getIngredientById(id: number): Promise<Ingredient> {
    try {
      logger.info('Malzeme detayı getiriliyor', { id });
      
      const response = await httpClient.get<APIIngredient>(`${this.baseUrl}/Ingredients/${id}`);
      
      logger.info('Malzeme detayı başarıyla getirildi', { data: response.data });
      
      // Transform API response to internal format
      const transformedIngredient: Ingredient = {
        id: response.data.ingredientId,
        name: response.data.name,
        isAllergenic: response.data.isAllergenic,
        isAvailable: response.data.isAvailable,
        allergenIds: response.data.allergens?.map((allergen: any) => allergen.id) || [],
        allergenDetails: response.data.allergens?.map((allergen: any) => ({
          allergenId: allergen.id,
          containsAllergen: allergen.containsAllergen !== null ? allergen.containsAllergen : true,
          note: allergen.note || ''
        })) || []
      };
      
      return transformedIngredient;
    } catch (error: any) {
      logger.error('❌ Malzeme detayı getirilirken hata:', error);
      throw error;
    }
  }

  // Malzeme silme (DELETE)
  async deleteIngredient(id: number): Promise<void> {
    try {
      logger.info('Malzeme silme isteği gönderiliyor', { id });
      
      await httpClient.delete(`${this.baseUrl}/Ingredients/${id}`);
      
      logger.info('Malzeme başarıyla silindi', { id });
    } catch (error: any) {
      logger.error('❌ Malzeme silinirken hata:', error);
      throw error;
    }
  }

 
}

// Usage example
export const ingredientsService = new IngredientsService();