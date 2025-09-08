import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";

// Updated interfaces based on your actual API response
export interface BasketAddonItem {
  id: number;
  basketItemId: number;
  branchProductId: number;
  productName: string;
  categoryName: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string | null;
  description: string | null;
  isAddon: boolean;
  parentBasketItemId: number;
  addonItems: BasketAddonItem[];
  addonPrice: number | null;
  addonNote: string | null;
}

// Main basket item interface based on your API response
export interface BasketItem {
  id: number;
  basketItemId: number;
  branchProductId: number;
  productName: string;
  categoryName: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string | null;
  description: string | null;
  isAddon: boolean;
  parentBasketItemId: number | null;
  addonItems: BasketAddonItem[];
  addonPrice: number | null;
  addonNote: string | null;
  maxQuantity:number;
  minQuantity:number;
}

// Basket interface
export interface Basket {
  basketId: string;
  items: BasketItem[];
  totalAmount: number;
  totalQuantity: number;
  createdDate?: string;
  modifiedDate?: string;
}

// Recommended addons interface
export interface RecommendedAddon {
  branchProductId: number;
  productName: string;
  productDescription: string;
  imageUrl: string;
  price: number;
  categoryName: string;
  isRecommended: boolean;
  marketingText: string;
}

// Table summary interface
export interface TableSummary {
  totalAmount: number;
  totalQuantity: number;
  itemsCount: number;
  tables?: any[];
}

// Add unified item interface
export interface AddUnifiedItemDto {
  branchProductId: number;
  quantity: number;
}

// Batch add items interface
export interface BatchAddItemDto {
  branchProductId: number;
  quantity: number;
  parentBasketItemId?: number;
}

// Update basket item interface
export interface UpdateBasketItemDto {
  basketItemId: number;
  basketId: string;
  branchProductId: number;
  quantity: number;
}

// Price change interfaces
export interface PriceChange {
  branchProductId: number;
  productName: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
  basketItemId: number;
}

export interface BasketResponse {
  basketId: string;
  basketItems: BasketItem[];
  totalPrice: number;
  totalQuantity: number;
}

class BasketService {
  private baseUrl = '/api/Basket';

  // GET /api/Basket/{basketId}
  async getBasket(basketId: string): Promise<Basket> {
    try {
      logger.info('Basket getirme isteği gönderiliyor', { basketId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/${basketId}`;
      const response = await httpClient.get<BasketItem[]>(url);
      
      // Convert response array to Basket object
      const items = Array.isArray(response.data) ? response.data : [];
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      
      const basket: Basket = {
        basketId,
        items,
        totalAmount,
        totalQuantity
      };
      
      logger.info('Basket başarıyla alındı', { 
        basketId,
        itemsCount: items.length,
        totalAmount
      }, { prefix: 'BasketService' });
      
      return basket;
    } catch (error: any) {
      logger.error('Basket getirme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Basket getirilirken hata oluştu');
    }
  }

  // DELETE /api/Basket/{basketId}
  async deleteBasket(basketId: string): Promise<void> {
    try {
      logger.info('Basket silme isteği gönderiliyor', { basketId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/${basketId}`;
      await httpClient.delete(url);
      
      logger.info('Basket başarıyla silindi', { basketId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Basket silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Basket silinirken hata oluştu');
    }
  }

  // GET /api/Basket/my-basket
  async getMyBasket(): Promise<Basket> {
    try {
      logger.info('My basket getirme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket`;
      const response = await httpClient.get(url);
      
      // Let's see the exact structure
      console.log("Full Response:", response);
      console.log("Response.data:", response.data);
      console.log("Response.data.data:", response.data.data);
      
      // Try to access the basket data safely
      let basketData;
      
      // Check if the data is directly in response.data
      if (response.data && response.data.basketId) {
        basketData = response.data;
        console.log("Found basket data in response.data");
      }
      // Check if the data is nested in response.data.data
      else if (response.data && response.data.data && response.data.data.basketId) {
        basketData = response.data.data;
        console.log("Found basket data in response.data.data");
      }
      // If no basket exists, return empty basket
      else {
        console.log("No basket found, returning empty basket");
        return {
          basketId: 'empty',
          items: [],
          totalAmount: 0,
          totalQuantity: 0
        };
      }
      
      console.log("Final basketData:", basketData);
      
      const basket: Basket = {
        basketId: basketData.basketId || 'unknown',
        items: basketData.basketItems || [],
        totalAmount: basketData.totalPrice || 0,
        totalQuantity: basketData.totalQuantity || 0
      };
      
      logger.info('My basket başarıyla alındı', { 
        basketId: basket.basketId,
        itemsCount: basket.items.length,
        totalAmount: basket.totalAmount,
        totalQuantity: basket.totalQuantity
      }, { prefix: 'BasketService' });
      
      console.log("Final basket:", basket);
      return basket;
    } catch (error: any) {
      logger.error('My basket getirme hatası', error, { prefix: 'BasketService' });
      
      // Instead of throwing error, return empty basket when basket doesn't exist
      if (error?.response?.status === 404) {
        console.log("Basket not found (404), returning empty basket");
        return {
          basketId: 'empty',
          items: [],
          totalAmount: 0,
          totalQuantity: 0
        };
      }
      
      this.handleError(error, 'My basket getirilirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket
  async deleteMyBasket(): Promise<void> {
    try {
      logger.info('My basket silme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket`;
      await httpClient.delete(url);
      
      logger.info('My basket başarıyla silindi', {}, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('My basket silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket silinirken hata oluştu');
    }
  }

  // POST /api/Basket/session/{sessionId}/confirm-price-changes
  async confirmSessionPriceChanges(sessionId: string): Promise<void> {
    try {
      logger.info('Session price changes onaylama isteği gönderiliyor', { sessionId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/session/${sessionId}/confirm-price-changes`;
      await httpClient.post(url);
      
      logger.info('Session price changes başarıyla onaylandı', { sessionId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('Session price changes onaylama hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Price changes onaylanırken hata oluştu');
    }
  }



  // GET /api/Basket/products/{branchProductId}/recommended-addons
  async getRecommendedAddons(branchProductId: number): Promise<RecommendedAddon[]> {
    try {
      logger.info('Recommended addons getirme isteği gönderiliyor', { branchProductId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/products/${branchProductId}/recommended-addons`;
      const response = await httpClient.get<RecommendedAddon[]>(url);
      
      const addonsData = Array.isArray(response.data) ? response.data : [];
      
      logger.info('Recommended addons başarıyla alındı', { 
        branchProductId,
        addonsCount: addonsData.length 
      }, { prefix: 'BasketService' });
      
      return addonsData;
    } catch (error: any) {
      logger.error('Recommended addons getirme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Recommended addons getirilirken hata oluştu');
    }
  }

  // GET /api/Basket/table-summary
  async getTableSummary(): Promise<TableSummary> {
    try {
      logger.info('Table summary getirme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/table-summary`;
      const response = await httpClient.get<TableSummary>(url);
      
      logger.info('Table summary başarıyla alındı', { 
        totalAmount: response.data.totalAmount,
        totalQuantity: response.data.totalQuantity,
        itemsCount: response.data.itemsCount
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Table summary getirme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Table summary getirilirken hata oluştu');
    }
  }

  // POST /api/Basket/{basketId}/unified-items
  async addUnifiedItemToBasket(basketId: string, data: AddUnifiedItemDto): Promise<BasketItem> {
    try {
      logger.info('Unified item ekleme isteği gönderiliyor', { basketId, data }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/${basketId}/unified-items`;
      const response = await httpClient.post<BasketItem>(url, data);
      
      logger.info('Unified item başarıyla eklendi', { basketId }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Unified item ekleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Unified item eklenirken hata oluştu');
    }
  }

  // POST /api/Basket/my-basket/unified-items
  async addUnifiedItemToMyBasket(data: AddUnifiedItemDto): Promise<BasketItem> {
    try {
      logger.info('My basket unified item ekleme isteği gönderiliyor', { data }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/unified-items`;
      const response = await httpClient.post<BasketItem>(url, data);
      
      logger.info('My basket unified item başarıyla eklendi', {}, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('My basket unified item ekleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket unified item eklenirken hata oluştu');
    }
  }

  // POST /api/Basket/my-basket/items/batch
  async batchAddItemsToMyBasket(items: BatchAddItemDto[]): Promise<any> {
    try {
      logger.info('My basket batch items ekleme isteği gönderiliyor', { 
        itemsCount: items.length 
      }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/items/batch`;
      const response = await httpClient.post(url, items);
      
      logger.info('My basket batch items başarıyla eklendi', { 
        response: response.data 
      }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('My basket batch items ekleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket batch items eklenirken hata oluştu');
    }
  }

  // PUT /api/Basket/my-basket/items/{basketItemId}
  async updateMyBasketItem(basketItemId: number, data: UpdateBasketItemDto): Promise<BasketItem> {
    try {
      logger.info('My basket item güncelleme isteği gönderiliyor', { basketItemId, data }, { prefix: 'BasketService' });
      console.log("Updating basket item:", basketItemId, data);
      
      const url = `${this.baseUrl}/my-basket/items/${basketItemId}`;
      
      // The API expects basketId at the top level and the rest in updateDto
      const requestBody = {
        basketId: data.basketId,  // basketId at top level
        updateDto: {
          basketItemId: data.basketItemId,
          branchProductId: data.branchProductId,
          quantity: data.quantity
        }
      };
      
      console.log("Request body:", requestBody);
      
      const response = await httpClient.put<BasketItem>(url, requestBody);
      
      logger.info('My basket item başarıyla güncellendi', { basketItemId }, { prefix: 'BasketService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('My basket item güncelleme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket item güncellenirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/items/{basketItemId}
  async deleteMyBasketItem(basketItemId: number): Promise<void> {
    try {
      logger.info('My basket item silme isteği gönderiliyor', { basketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/items/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('My basket item başarıyla silindi', { basketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('My basket item silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket item silinirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/products/{basketItemId}
  async deleteMyBasketProduct(basketItemId: number): Promise<void> {
    try {
      logger.info('My basket product silme isteği gönderiliyor', { basketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/products/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('My basket product başarıyla silindi', { basketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('My basket product silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket product silinirken hata oluştu');
    }
  }

  // DELETE /api/Basket/my-basket/addons/{addonBasketItemId}
  async deleteMyBasketAddon(addonBasketItemId: number): Promise<void> {
    try {
      logger.info('My basket addon silme isteği gönderiliyor', { addonBasketItemId }, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/my-basket/addons/${addonBasketItemId}`;
      await httpClient.delete(url);
      
      logger.info('My basket addon başarıyla silindi', { addonBasketItemId }, { prefix: 'BasketService' });
    } catch (error: any) {
      logger.error('My basket addon silme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'My basket addon silinirken hata oluştu');
    }
  }

  // GET /api/Basket/active
  async getActiveBasket(): Promise<Basket> {
    try {
      logger.info('Active basket getirme isteği gönderiliyor', {}, { prefix: 'BasketService' });
      
      const url = `${this.baseUrl}/active`;
      const response = await httpClient.get<BasketResponse>(url);
      
      // Convert response to normalized Basket object
      const basketData = response.data;
      const basket: Basket = {
        basketId: basketData.basketId,
        items: basketData.basketItems || [],
        totalAmount: basketData.totalPrice,
        totalQuantity: basketData.totalQuantity
      };
      
      logger.info('Active basket başarıyla alındı', { 
        basketId: basket.basketId,
        itemsCount: basket.items.length,
        totalAmount: basket.totalAmount,
        totalQuantity: basket.totalQuantity
      }, { prefix: 'BasketService' });
      
      return basket;
    } catch (error: any) {
      logger.error('Active basket getirme hatası', error, { prefix: 'BasketService' });
      this.handleError(error, 'Active basket getirilirken hata oluştu');
    }
  }

  // Enhanced error handling helper
  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        // Validation error'ları göster
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
      } else {
        throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
      }
    } else if (error?.response?.status === 401) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    } else if (error?.response?.status === 403) {
      throw new Error('Bu işlem için yetkiniz bulunmuyor.');
    } else if (error?.response?.status === 404) {
      throw new Error('Sepet bulunamadı.');
    } else if (error?.response?.status === 409) {
      throw new Error('Bu kayıt zaten mevcut.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }
}

export const basketService = new BasketService();