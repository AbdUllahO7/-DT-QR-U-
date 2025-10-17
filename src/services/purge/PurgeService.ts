import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// Request DTOs
interface PurgeBranchDto {
  branchId: number;
}

interface PurgeRestaurantDto {
  restaurantId: number;
}

// Response types (adjust based on your actual API responses)
interface PurgeResponse {
  success: boolean;
  message?: string;
}

class PurgeService {
  private baseUrl = '/api/Purge';

  /**
   * Purge a branch by ID
   * @param branchId - The ID of the branch to purge
   * @returns Promise with purge operation result
   */
  async purgeBranch(branchId: number): Promise<PurgeResponse> {
    try {
      logger.info('Branch purge isteği gönderiliyor:', branchId);

      const data: PurgeBranchDto = {
        branchId
      };

      const response = await httpClient.post<PurgeResponse>(
        `${this.baseUrl}/branch`,
        data
      );

      logger.info('Branch başarıyla purge edildi:', response.data);
      return response.data;
    } catch (error: any) {
      logger.error('Branch purge edilirken hata oluştu:', error);
      throw error;
    }
  }

  /**
   * Purge a restaurant by ID
   * @param restaurantId - The ID of the restaurant to purge
   * @returns Promise with purge operation result
   */
  async purgeRestaurant(restaurantId: number): Promise<PurgeResponse> {
    try {
      logger.info('Restaurant purge isteği gönderiliyor:', restaurantId);

      const data: PurgeRestaurantDto = {
        restaurantId
      };

      const response = await httpClient.post<PurgeResponse>(
        `${this.baseUrl}/restaurant`,
        data
      );

      logger.info('Restaurant başarıyla purge edildi:', response.data);
      return response.data;
    } catch (error: any) {
      logger.error('Restaurant purge edilirken hata oluştu:', error);
      throw error;
    }
  }
}

export const purgeService = new PurgeService();
export const purgeServiceInstance = purgeService;