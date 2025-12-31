import { MenuCategory } from "../../../types/menu/type";
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
  sessionToken: string;
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

// ✅ Product Extra Interface (matches API response)
export interface ProductExtra {
  branchProductExtraId: number;
  productExtraId: number;
  extraId: number;
  extraName: string;
  categoryName: string;
  selectionMode: number;
  unitPrice: number;
  finalPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequired: boolean;
  isRemoval: boolean;
  isRemovalAllowed: boolean;
  displayOrder: number;
}

// ✅ Extra Category (matches API response structure)
export interface ExtraCategory {
  categoryId: number;
  categoryName: string;
  extras: ProductExtra[];
  isRequired: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
}

// ✅ Basket Extra Item (for basket responses)
export interface BasketExtraItem {
  branchProductExtraId: number;
  productExtraId?: number;
  extraId: number;
  extraName: string;
  extraCategoryName?: string;
  selectionMode?: number;
  isRequired?: boolean;
  isRemoval: boolean;
  unitPrice: number;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  note?: string | null;
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
  addonBasketItemId?: number;
  addonName?: string;
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
  extras?: BasketExtraItem[];
  addonPrice: number | null;
  addonNote: string | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  customerPhone?: string;
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
  customerPhone: string;
  hasUnconfirmedPriceChange: boolean;
  lastPriceChangeAt: string | null;
  totalPriceDifference: number | null;
  priceChangeDetails: any | null;
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

// ✅ Product interface (availableExtras is array of categories)
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
  availableExtras?: ExtraCategory[];
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
  categories: MenuCategory[];
  preferences: MenuPreferences;
}

// ✅ Product Extra DTO for API calls
export interface ProductExtraDto {
  branchProductExtraId: number;
  extraId: number;
  quantity: number;
  isRemoval: boolean;
}

// ✅ Add unified item interface with extras
export interface AddUnifiedItemDto {
  branchProductId: number;
  quantity: number;
  parentBasketItemId?: number;
  isAddon?: boolean;
  extras?: ProductExtraDto[];
}

// ✅ Update basket item with extras
export interface UpdateBasketItemWithExtrasDto {
  basketItemId: number;
  branchProductId: number;
  quantity: number;
  extras: ProductExtraDto[];
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

  async getPublicBranchId(branchId: number): Promise<PublicBranchIdResponse> {
    try {
      logger.info('Public branch ID getirme isteği gönderiliyor', { branchId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.anonymousUrl}/GetPublicId`;
      const response = await httpClient.get<{ [key: string]: string }>(url, {
        params: { branchId }
      });
      
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

  async getOnlineMenu(publicId: string): Promise<OnlineMenuResponse> {
    try {
      logger.info('Online menu getirme isteği gönderiliyor', { publicId }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/menu/${publicId}`;
      const response = await httpClient.get<OnlineMenuResponse>(url);
      
      // Log extras information
      let totalExtrasCount = 0;
      let totalExtraCategoriesCount = 0;
      response.data.categories?.forEach(cat => {
        cat.products?.forEach(prod => {
          if (prod.availableExtras) {
            totalExtraCategoriesCount += prod.availableExtras.length;
            prod.availableExtras.forEach(extraCat => {
              totalExtrasCount += extraCat.extras?.length || 0;
            });
          }
        });
      });
      
      logger.info('Online menu başarıyla alındı', { 
        publicId,
        branchName: response.data.branchName,
        restaurantName: response.data.restaurantName,
        categoriesCount: response.data.categories?.length || 0,
        totalExtraCategoriesCount,
        totalExtrasCount,
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

  async startSession(data: StartSessionDto): Promise<SessionResponse> {
    try {
      logger.info('Session başlatma isteği gönderiliyor', { 
        publicId: data.publicId,
        customerIdentifier: data.customerIdentifier,
        preferredLanguage: data.preferredLanguage
      }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/start-session`;
      const response = await httpClient.post<SessionResponse>(url, data);
      
      logger.info('Session başlatma yanıtı alındı', { 
        sessionId: response.data.sessionId,
        branchId: response.data.branchId,
        branchName: response.data.branchName,
        hasToken: !!response.data.sessionToken,
        expiresAt: response.data.expiresAt
      }, { prefix: 'OnlineMenuService' });
      
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

  async getMyBasket(): Promise<BasketResponse> {
    try {
      logger.info('Sepet bilgileri getiriliyor', {}, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket`;
      const response = await httpClient.get<BasketResponse>(url);
      
      let totalExtrasInBasket = 0;
      response.data.basketItems?.forEach(item => {
        if (item.extras) {
          totalExtrasInBasket += item.extras.length;
        }
      });
      
      logger.info('Sepet bilgileri başarıyla getirildi', { 
        itemCount: response.data.basketItems?.length || 0,
        totalPrice: response.data.totalPrice,
        totalExtrasInBasket
      }, { prefix: 'OnlineMenuService' });
      
      const mappedBasket: BasketResponse = {
        ...response.data,
        items: response.data.basketItems?.map(item => ({
          ...item,
          productImageUrl: item.imageUrl || undefined,
          unitPrice: item.price,
          addons: item.addonItems?.map(addon => ({
            ...addon,
            addonBasketItemId: addon.basketItemId,
            addonName: addon.productName,
            specialPrice: addon.price
          })) || [],
          extras: item.extras || [],
          specialInstructions: item.addonNote
        })) || [],
        total: response.data.totalPrice,
        subtotal: response.data.productTotal || response.data.totalPrice,
        tax: 0,
        itemCount: response.data.basketItems?.length || 0,
        totalQuantity: response.data.basketItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        priceChangesDetected: response.data.hasUnconfirmedPriceChange
      };
      
      return mappedBasket;
    } catch (error: any) {
      logger.error('Sepet bilgileri getirme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Sepet bilgileri getirilirken hata oluştu');
    }
  }

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

  // ✅ Update basket item with new extras array
  async updateBasketItemExtras(
    basketItemId: number,
    branchProductId: number,
    quantity: number,
    extras: ProductExtraDto[]
  ): Promise<void> {
    try {
      logger.info('Basket item extras güncelleme isteği gönderiliyor', {
        basketItemId,
        branchProductId,
        quantity,
        extrasCount: extras.length
      }, { prefix: 'OnlineMenuService' });

      // ✅ STEP 1: Get current basket to find child addons
      const currentBasket = await this.getMyBasket();

      if (!currentBasket.items || currentBasket.items.length === 0) {
        throw new Error('Basket is empty');
      }

      const currentItem = currentBasket.items.find((item) => item.basketItemId === basketItemId);

      if (!currentItem) {
        throw new Error('Basket item not found');
      }

      // ✅ STEP 2: Find all child addons (items with this basketItemId as parent)
      const childAddons = currentBasket.items.filter(
        (item) => item.parentBasketItemId === basketItemId && item.isAddon
      );

      logger.info('Found child addons to preserve', {
        basketItemId,
        childAddonsCount: childAddons.length,
        childAddons: childAddons.map(addon => ({
          basketItemId: addon.basketItemId,
          branchProductId: addon.branchProductId,
          quantity: addon.quantity
        }))
      }, { prefix: 'OnlineMenuService' });

      // ✅ STEP 3: Delete child addons first (to avoid orphaned references)
      for (const addon of childAddons) {
        await this.deleteBasketItem(addon.basketItemId);
      }

      // ✅ STEP 4: Delete the main item
      await this.deleteBasketItem(basketItemId);

      // ✅ STEP 5: Add the main item back with new extras
      const addResponse = await this.addUnifiedItemToMyBasket({
        branchProductId,
        quantity,
        isAddon: false,
        extras: extras.length > 0 ? extras : undefined
      });

      const newBasketItemId = addResponse.basketItemId;

      logger.info('Main item re-added with new ID', {
        oldBasketItemId: basketItemId,
        newBasketItemId
      }, { prefix: 'OnlineMenuService' });

      // ✅ STEP 6: Re-add child addons with new parent ID
      for (const addon of childAddons) {
        await this.addUnifiedItemToMyBasket({
          branchProductId: addon.branchProductId,
          quantity: addon.quantity,
          parentBasketItemId: newBasketItemId,
          isAddon: true,
          extras: addon.extras && addon.extras.length > 0 ? addon.extras.map(e => ({
            branchProductExtraId: e.branchProductExtraId,
            extraId: e.extraId,
            quantity: e.quantity,
            isRemoval: e.isRemoval
          })) : undefined
        });
      }

      logger.info('Basket item extras başarıyla güncellendi', {
        basketItemId,
        newBasketItemId,
        extrasCount: extras.length,
        childAddonsReAdded: childAddons.length
      }, { prefix: 'OnlineMenuService' });
    } catch (error: any) {
      logger.error('Basket item extras güncelleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Basket item extras güncellenirken hata oluştu');
    }
  }

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

  async addUnifiedItemToMyBasket(data: AddUnifiedItemDto): Promise<AddItemResponse> {
    try {
      logger.info('Sepete ürün ekleme isteği gönderiliyor', { 
        branchProductId: data.branchProductId,
        quantity: data.quantity,
        isAddon: data.isAddon,
        extrasCount: data.extras?.length || 0
      }, { prefix: 'OnlineMenuService' });
      
      const url = `${this.onlineUrl}/my-basket/unified-items`;
      const response = await httpClient.post<AddItemResponse>(url, data);
      
      logger.info('Ürün sepete başarıyla eklendi', { 
        basketItemId: response.data.basketItemId,
        extrasCount: data.extras?.length || 0
      }, { prefix: 'OnlineMenuService' });
      
      return response.data;
    } catch (error: any) {
      logger.error('Sepete ürün ekleme hatası', error, { prefix: 'OnlineMenuService' });
      this.handleError(error, 'Ürün sepete eklenirken hata oluştu');
    }
  }

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

  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
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