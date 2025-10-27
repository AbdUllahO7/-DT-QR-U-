import { httpClient } from "../../../utils/http";
import { logger } from "../../../utils/logger";


// Public branch ID response interface
export interface PublicBranchIdResponse {
  branchName: string;
  publicId: string;
}

// Start session request interface
export interface StartSessionDto {
  publicId: string;
  customerIdentifier: string;
  deviceFingerprint: string;
  preferredLanguage: string;
}

// Start session response interface
export interface SessionResponse {
  sessionId: string;
  sessionToken: string; // Changed from 'token' to 'sessionToken'
  branchId: number;
  branchName: string;
  expiresAt: string;
}

// Update basket item interface
export interface UpdateBasketItemDto {
  basketItemId: number;
  basketId: string;
  branchProductId: number;
  quantity: number;
}

// Basket item addon interface
export interface BasketItemAddon {
  id: number;
  basketItemId: number;
  branchProductId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  maxQuantity: number | null;
  minQuantity: number | null;
  imageUrl: string | null;
  description: string | null;
  isAddon: boolean;
  parentBasketItemId: number | null;
  addonBasketItemId?: number; // For compatibility
  addonName?: string; // For compatibility
  specialPrice?: number | null;
}

// Basket item interface
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
  addonItems: BasketItemAddon[];
  addonPrice: number | null;
  addonNote: string | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  
  // Computed/mapped fields for compatibility
  productImageUrl?: string;
  unitPrice?: number;
  addons?: BasketItemAddon[];
  specialInstructions?: string | null;
}

// Basket response interface
export interface BasketResponse {
  basketId: string;
  basketItems: BasketItem[];
  totalPrice: number;
  productTotal: number | null;
  previewServiceFee: number | null;
  previewMinOrderAmount: number | null;
  previewTotal: number | null;
  meetsMinimumAmount: boolean | null;
  shortfallToMin: number | null;
  itemCount: number;
  totalQuantity: number;
  menuTableId: number;
  menuTable: any | null;
  branchId: number;
  branch: any | null;
  hasUnconfirmedPriceChange: boolean;
  lastPriceChangeAt: string | null;
  totalPriceDifference: number | null;
  priceChangeDetails: any | null;
  
  // Computed/mapped fields for compatibility
  items?: BasketItem[];
  total?: number;
  subtotal?: number;
  tax?: number;
  priceChangesDetected?: boolean;
}

// Ingredient interface
export interface Ingredient {
  id: number;
  productId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergens: any[];
}

// Allergen interface
export interface Allergen {
  allergenId: number;
  code: string;
  name: string;
  icon: string;
  presence: number;
  note: string;
}

// Addon interface
export interface ProductAddon {
  branchProductAddonId: number;
  addonBranchProductId: number;
  addonName: string;
  addonDescription: string;
  addonImageUrl: string;
  price: number;
  specialPrice: number;
  isRecommended: boolean;
  marketingText: string;
  maxQuantity: number;
  minQuantity: number;
  groupTag: string;
  isGroupRequired: boolean;
  ingredients: Ingredient[];
  allergens: Allergen[];
}

// Product interface
export interface Product {
  branchProductId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  price: number;
  ingredients: Ingredient[];
  allergens: Allergen[];
  availableAddons: ProductAddon[];
}

// Category interface
export interface Category {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
  products: Product[];
}

// Preferences interface
export interface MenuPreferences {
  showProductDescriptions: boolean;
  enableAllergenDisplay: boolean;
  enableIngredientDisplay: boolean;
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptOnlinePayment: boolean;
  defaultCurrency: string;
  supportedLanguages: number;
  defaultLanguage: string;
  useWhatsappForOrders: boolean;
  whatsAppPhoneNumber: string;
}

// Online menu response interface
export interface OnlineMenuResponse {
  branchId: number;
  branchName: string;
  restaurantName: string;
  branchAddress: string;
  isOpen: boolean;
  isTemporarilyClosed: boolean;
  isPreviewMode: boolean;
  statusMessage: string;
  categories: Category[];
  preferences: MenuPreferences;
}
export interface AddUnifiedItemDto {
  branchProductId: number;
  quantity: number;
  parentBasketItemId?: number;
  isAddon?: boolean;
}

// Batch item interface
export interface BatchAddItemDto {
  branchProductId: number;
  quantity: number;
  parentBasketItemId?: number;
  isAddon?: boolean;
}

// Add item response interface
export interface AddItemResponse {
  basketItemId: number;
  basketId: string;
  branchProductId: number;
  quantity: number;
}
class OnlineMenuService {
  private anonymousUrl = '/api/Branches/Anonymus';
  private onlineUrl = '/api/online';

  // GET /api/Branches/Anonymus/GetPublicId
  async getPublicBranchId(branchId: number): Promise<PublicBranchIdResponse> {
    try {
      logger.info('Public branch ID getirme isteği gönderiliyor', { branchId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.anonymousUrl}/GetPublicId`;
      const response = await httpClient.get<{ [key: string]: string }>(url, {
        params: { branchId }
      });
      
      // Response format: { "branch of winig": "54eef469-cc22-4d7e-b442-a90a33ef7107" }
      const branchName = Object.keys(response.data)[0] || '';
      const publicId = Object.values(response.data)[0] || '';
      
      logger.info('Public branch ID başarıyla alındı', { 
        branchId,
        branchName,
        publicId 
      }, { prefix: 'OnlineMenuService' });
      
      return {
        branchName,
        publicId
      };
    } catch (error: any) {
      logger.error('Public branch ID getirme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Public branch ID getirilirken hata oluştu');
    }
  }

  // GET /api/online/menu/{publicId}
  async getOnlineMenu(publicId: string): Promise<OnlineMenuResponse> {
    try {
      logger.info('Online menu getirme isteği gönderiliyor', { publicId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/menu/${publicId}`;
      const response = await httpClient.get<OnlineMenuResponse>(url);
      
      logger.info('Online menu başarıyla alındı', { 
        publicId,
        branchName: response.data.branchName,
        restaurantName: response.data.restaurantName,
        categoriesCount: response.data.categories?.length || 0,
        isOpen: response.data.isOpen
      }, { prefix: 'OnlineMenuService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Online menu getirme hatası', error, { prefix: 'OnlineMenuService' });
      
      if (error?.response?.status === 404) {
        throw new Error('Menü bulunamadı. Geçersiz veya süresi dolmuş link.');
      }
      
      this.handleError(error, 'Online menü getirilirken hata oluştu');
    }
  }

  // POST /api/online/start-session
// POST /api/online/start-session
async startSession(data: StartSessionDto): Promise<SessionResponse> {
  try {
    logger.info('Session başlatma isteği gönderiliyor', { 
      publicId: data.publicId,
      customerIdentifier: data.customerIdentifier,
      preferredLanguage: data.preferredLanguage
    }, { prefix: 'OnlineMenuService' });
    
    const url = `${this.onlineUrl}/start-session`;
    const response = await httpClient.post<SessionResponse>(url, data);
    
    // Log the actual response structure
    logger.info('Session başlatma yanıtı alındı', { 
      sessionId: response.data.sessionId,
      branchId: response.data.branchId,
      branchName: response.data.branchName,
      hasToken: !!response.data.sessionToken,
      expiresAt: response.data.expiresAt
    }, { prefix: 'OnlineMenuService' });
    
    // Validate response structure
    if (!response.data) {
      throw new Error('Session response is empty');
    }
    
    if (!response.data.sessionId) {
      logger.error('Session response missing sessionId', { response: response.data });
      throw new Error('Session response missing sessionId');
    }
    
    if (!response.data.sessionToken) {
      logger.error('Session response missing sessionToken', { response: response.data });
      throw new Error('Session response missing sessionToken');
    }
    
    logger.info('Session başarıyla başlatıldı', { 
      sessionId: response.data.sessionId,
      branchId: response.data.branchId,
      tokenPreview: response.data.sessionToken.substring(0, 20) + '...',
      expiresAt: response.data.expiresAt
    }, { prefix: 'OnlineMenuService' });
    
    return response.data;
  } catch (error: any) {
    logger.error('Session başlatma hatası', error, { prefix: 'OnlineMenuService' });
    
    // Log more details about the error
    if (error.response) {
      logger.error('Error response details', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    this.handleError(error, 'Session başlatılırken hata oluştu');
  }
}

  // GET /api/online/my-basket
async getMyBasket(): Promise<BasketResponse> {
  try {
    logger.info('Sepet bilgileri getiriliyor', {}, { prefix: 'OnlineMenuService' });
    
    const url = `${this.onlineUrl}/my-basket`;
    const response = await httpClient.get<BasketResponse>(url);
    
    logger.info('Sepet bilgileri başarıyla getirildi', { 
      itemCount: response.data.basketItems?.length || 0,
      totalPrice: response.data.totalPrice
    }, { prefix: 'OnlineMenuService' });
    
    // Map the response to include computed fields for compatibility
    const mappedBasket: BasketResponse = {
      ...response.data,
      // Map basketItems to items
      items: response.data.basketItems?.map(item => ({
        ...item,
        productImageUrl: item.imageUrl,
        unitPrice: item.price,
        addons: item.addonItems?.map(addon => ({
          ...addon,
          addonBasketItemId: addon.basketItemId,
          addonName: addon.productName,
          specialPrice: addon.price
        })) || [],
        specialInstructions: item.addonNote
      })) || [],
      // Map totalPrice to total
      total: response.data.totalPrice,
      subtotal: response.data.productTotal || response.data.totalPrice,
      tax: 0, // Calculate if you have tax info
      // Calculate real item count and quantity
      itemCount: response.data.basketItems?.length || 0,
      totalQuantity: response.data.basketItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      // Map price change flag
      priceChangesDetected: response.data.hasUnconfirmedPriceChange
    };
    
    return mappedBasket;
  } catch (error: any) {
    logger.error('Sepet bilgileri getirme hatası', error, { prefix: 'OnlineMenuService' });
    this.handleError(error, 'Sepet bilgileri getirilirken hata oluştu');
  }
}

  // DELETE /api/online/my-basket
  async clearBasket(): Promise<void> {
    try {
      logger.info('Sepet temizleme isteği gönderiliyor', {}, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket`;
      await httpClient.delete(url);
      
      logger.info('Sepet başarıyla temizlendi', {}, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Sepet temizleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet temizlenirken hata oluştu');
    }
  }

  // DELETE /api/online/my-basket/items/{basketItemId}
  async deleteBasketItem(basketItemId: number): Promise<void> {
    try {
      logger.info('Sepet ürünü silme isteği gönderiliyor', { basketItemId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/items/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet ürünü başarıyla silindi', { basketItemId }, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Sepet ürünü silme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet ürünü silinirken hata oluştu');
    }
  }

  // DELETE /api/online/my-basket/products/{basketItemId}
  async deleteBasketProduct(basketItemId: number): Promise<void> {
    try {
      logger.info('Sepet ürünü (products) silme isteği gönderiliyor', { basketItemId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/products/${basketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet ürünü (products) başarıyla silindi', { basketItemId }, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Sepet ürünü (products) silme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet ürünü silinirken hata oluştu');
    }
  }

  // DELETE /api/online/my-basket/addons/{addonBasketItemId}
  async deleteBasketAddon(addonBasketItemId: number): Promise<void> {
    try {
      logger.info('Sepet addon silme isteği gönderiliyor', { addonBasketItemId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/addons/${addonBasketItemId}`;
      await httpClient.delete(url);
      
      logger.info('Sepet addon başarıyla silindi', { addonBasketItemId }, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Sepet addon silme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet addon silinirken hata oluştu');
    }
  }

  // PUT /api/online/my-basket/items/{basketItemId}
  async updateBasketItem(basketItemId: number, data: UpdateBasketItemDto): Promise<BasketResponse> {
    try {
      logger.info('Sepet ürünü güncelleme isteği gönderiliyor', { 
        basketItemId,
        quantity: data.quantity 
      }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/items/${basketItemId}`;
      const response = await httpClient.put<BasketResponse>(url, data);
      
      logger.info('Sepet ürünü başarıyla güncellendi', { 
        basketItemId,
        itemCount: response.data.itemCount
      }, { prefix: 'OnlineMenuService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Sepet ürünü güncelleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet ürünü güncellenirken hata oluştu');
    }
  }

  // POST /api/online/my-basket/confirm-price-changes
  async confirmPriceChanges(): Promise<BasketResponse> {
    try {
      logger.info('Fiyat değişikliklerini onaylama isteği gönderiliyor', {}, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/confirm-price-changes`;
      const response = await httpClient.post<BasketResponse>(url);
      
      logger.info('Fiyat değişiklikleri başarıyla onaylandı', {}, { prefix: 'OnlineMenuService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Fiyat değişikliklerini onaylama hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Fiyat değişiklikleri onaylanırken hata oluştu');
    }
  }

  // POST /api/online/my-basket/unified-items
  async addUnifiedItemToMyBasket(data: AddUnifiedItemDto): Promise<AddItemResponse> {
    try {
      logger.info('Sepete ürün ekleme isteği gönderiliyor', { 
        branchProductId: data.branchProductId,
        quantity: data.quantity,
        isAddon: data.isAddon 
      }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/unified-items`;
      const response = await httpClient.post<AddItemResponse>(url, data);
      
      logger.info('Ürün sepete başarıyla eklendi', { 
        basketItemId: response.data.basketItemId
      }, { prefix: 'OnlineMenuService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Sepete ürün ekleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Ürün sepete eklenirken hata oluştu');
    }
  }

  // POST /api/online/my-basket/items/batch
  async batchAddItemsToMyBasket(items: BatchAddItemDto[]): Promise<void> {
    try {
      logger.info('Toplu ürün ekleme isteği gönderiliyor', { 
        itemsCount: items.length 
      }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/items/batch`;
      await httpClient.post(url, items);
      
      logger.info('Ürünler toplu olarak sepete başarıyla eklendi', {}, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Toplu ürün ekleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Ürünler sepete eklenirken hata oluştu');
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
      throw new Error('Kayıt bulunamadı.');
    } else if (error?.response?.status === 409) {
      throw new Error('Bu kayıt zaten mevcut.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }
}

export const onlineMenuService = new OnlineMenuService();