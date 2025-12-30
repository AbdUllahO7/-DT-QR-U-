import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import {
  OnlineMenuResponse,
  onlineMenuService,
  ProductAddon,
  StartSessionDto,
  BasketResponse,
} from '../../../../services/Branch/Online/OnlineMenuService';
import OnlineCartSidebar from './OnlineCartSidebar';
import ProductGrid from '../Menu/MneuProductGrid';
import { MenuProduct } from '../../../../types/menu/type';
import { basketService } from '../../../../services/Branch/BasketService';
import PriceChangeModal from '../Menu/CartSideBar/PriceChangeModal';
import Header from '../Menu/MenuHeaderComponent';
import CategoriesSidebar from '../Menu/MenuCategoriesSidebar';
import Footer from '../Menu/MneuFooter';
import SearchBar from '../Menu/MenuSearchBar';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { OnlineMenuProductModal } from './OnlineMenuProductModal';

// Re-export interfaces for use in other components
export interface SelectedAddon {
  addonBranchProductId: number;
  branchProductAddonId?: number;
  quantity: number;
  addon: ProductAddon;
}

export interface SelectedExtra {
  branchProductExtraId: number;
  extraId: number;
  extraName: string;
  extraCategoryName?: string;
  quantity: number;
  isRemoval: boolean;
  unitPrice: number;
  maxQuantity?: number;
  minQuantity?: number;
  selectionMode?: number;
  isRequired?: boolean;
}

const OnlineMenu: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const location = useLocation();
  const { t } = useLanguage();

  // ───── UI States ─────
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [menuData, setMenuData] = useState<OnlineMenuResponse | null>(null);

  // ───── ProductGrid States ─────
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // ───── Product Modal ─────
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [isAddingToBasket, setIsAddingToBasket] = useState<boolean>(false);

  // ───── Basket & Session ─────
  const [basket, setBasket] = useState<BasketResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // ───── Price Change Detection ─────
  const [showPriceChangeModal, setShowPriceChangeModal] = useState<boolean>(false);
  const [priceChanges, setPriceChanges] = useState<any>(null);
  const [confirmingPriceChanges, setConfirmingPriceChanges] = useState<boolean>(false);
  const [productPriceCache, setProductPriceCache] = useState<Map<number, number>>(new Map());

  // ==========================================
  // API & INITIALIZATION HANDLERS
  // ==========================================

  const fetchOnlineMenu = async (pid: string) => {
    try {
      setIsLoadingMenu(true);
      const menu = await onlineMenuService.getOnlineMenu(pid);
      setMenuData(menu);
      buildPriceCache(menu);
    } catch (err: any) {
      console.error('Menu fetch error:', err);
      setError(t('menu.error.fetchMenu'));
    } finally {
      setIsLoadingMenu(false);
    }
  };

 const loadBasket = async () => {
  try {
    const data = await onlineMenuService.getMyBasket();
    setBasket(data);
    await checkBasketPriceChanges(data);
  } catch (err: any) {
    // ❌ REMOVE THIS - Don't reset session!
    // if (err?.response?.status === 401) setIsSessionInitialized(false);
    
    // ✅ Just log and set basket to null
    console.error('Failed to load basket:', err);
    setBasket(null);
  }
};

  const initializeSession = async (pid: string) => {
    try {
      setIsSessionInitialized(false);

      const isFirstLoad = !sessionStorage.getItem('online_menu_initialized');
      if (isFirstLoad) {
        sessionStorage.setItem('online_menu_initialized', 'true');
      }

      // Check for existing session
      const existingSessionId = localStorage.getItem('online_menu_session_id');
      const existingToken = localStorage.getItem('token');
      const existingPublicId = localStorage.getItem('online_menu_public_id');

      if (existingSessionId && existingToken && existingPublicId === pid) {
        setSessionId(existingSessionId);
        setIsSessionInitialized(true);

        try {
          await loadBasket();
          return;
        } catch (error: any) {
          console.warn('⚠️ Existing session failed, creating new session:', error);
          localStorage.removeItem('online_menu_session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('online_menu_public_id');
          localStorage.removeItem('tokenExpiry');
        }
      }

      // Create new session
      const customerIdentifier =
        localStorage.getItem('customer_identifier') ||
        `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('customer_identifier', customerIdentifier);

      const deviceFingerprint = `${navigator.userAgent}_${navigator.language}_${screen.width}x${screen.height}`;

      const session = await onlineMenuService.startSession({
        publicId: pid,
        customerIdentifier,
        deviceFingerprint,
        preferredLanguage: 'en',
      } as StartSessionDto);

      setSessionId(session.sessionId);
      localStorage.setItem('online_menu_session_id', session.sessionId);
      localStorage.setItem('token', session.sessionToken);
      localStorage.setItem('online_menu_public_id', pid);
      localStorage.setItem('online_menu_branch_id', session.branchId.toString());
      localStorage.setItem('tokenExpiry', session.expiresAt);

      setIsSessionInitialized(true);
      await loadBasket();
    } catch (err: any) {
      console.error('❌ Session init error:', err);
      throw new Error(t('menu.error.initializeSession'));
    }
  };

const initializeMenu = async () => {
  try {
    setIsLoading(true);
    setError('');
    
    // ✅ Fetch menu first
    await fetchOnlineMenu(publicId!);
    
    // ✅ Then initialize session ONCE
    await initializeSession(publicId!);
    
  } catch (err: any) {
    setError(err.message || t('menu.error.initialization'));
  } finally {
    setIsLoading(false);
  }
};


  const buildPriceCache = (menu: OnlineMenuResponse) => {
    const cache = new Map<number, number>();
    menu.categories.forEach((cat) => {
      cat.products.forEach((prod) => {
        cache.set(prod.branchProductId, prod.price);
      });
    });
    setProductPriceCache(cache);
  };

  const checkBasketPriceChanges = async (basketData: BasketResponse) => {
    if (!menuData || !basketData?.items?.length) return;

    const currentPrices = new Map<number, number>();
    let hasChanges = false;
    const changedItems: any[] = [];

    menuData.categories.forEach((cat) => {
      cat.products.forEach((prod) => {
        currentPrices.set(prod.branchProductId, prod.price);
      });
    });

    basketData.items?.forEach((item) => {
      if (!item.isAddon) {
        const currentPrice = currentPrices.get(item.branchProductId);
        const basketItemPrice = item.price;

        if (currentPrice !== undefined && currentPrice !== basketItemPrice) {
          hasChanges = true;
          changedItems.push({
            basketItemId: item.basketItemId,
            productName: item.productName,
            oldPrice: basketItemPrice,
            newPrice: currentPrice,
            priceDifference: currentPrice - basketItemPrice,
          });
        }
      }
    });

    if (hasChanges) {
      const priceChangeMessage = changedItems
        .map(
          (item) =>
            `${item.productName}: ${formatPrice(item.oldPrice)} → ${formatPrice(
              item.newPrice
            )} (${item.priceDifference > 0 ? '+' : ''}${formatPrice(item.priceDifference)})`
        )
        .join('\n');

      setPriceChanges({
        message: priceChangeMessage,
        items: changedItems,
        requiresConfirmation: true,
      });
      setShowPriceChangeModal(true);
    }
  };

  const handlePriceChangeConfirm = async () => {
    setConfirmingPriceChanges(true);
    try {
      const currentSessionId = localStorage.getItem('online_menu_session_id');

      if (currentSessionId) {
        try {
          await basketService.confirmSessionPriceChanges(currentSessionId);
        } catch (err) {
          console.warn('Price confirmation API call failed, refreshing basket anyway:', err);
        }
      }

      await loadBasket();
      setShowPriceChangeModal(false);
      setPriceChanges(null);
    } catch (err: any) {
      console.error('Failed to confirm price changes:', err);
      alert(t('menu.error.updatePrices'));
    } finally {
      setConfirmingPriceChanges(false);
    }
  };

  const handlePriceChangeCancel = () => {
    setShowPriceChangeModal(false);
    setPriceChanges(null);
    setIsCartOpen(true);
  };

  const openProductModal = (product: MenuProduct) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // ==========================================
  // BASKET OPERATIONS
  // ==========================================

  const addToBasket = async (
  product: MenuProduct,
  quantity: number,
  addons: SelectedAddon[] = [],
  extras: SelectedExtra[] = []
) => {
  try {
    setIsAddingToBasket(true);

    // ❌ REMOVE THIS CHECK - Don't re-initialize session here!
    // if (!isSessionInitialized) {
    //   await initializeSession(publicId!);
    // }

    // ✅ Just add to basket directly
    const extrasPayload = extras.map((se) => ({
      branchProductExtraId: se.branchProductExtraId,
      extraId: se.extraId,
      quantity: se.isRemoval ? 1 : se.quantity,
      isRemoval: se.isRemoval,
    }));

    if (addons.length || extras.length) {
      const main = await onlineMenuService.addUnifiedItemToMyBasket({
        branchProductId: product.branchProductId,
        quantity,
        isAddon: false,
        extras: extrasPayload.length > 0 ? extrasPayload : undefined,
      });

      if (main.basketItemId && addons.length) {
        const addonPayloads = addons.map((sa) => {
          const avail = product.availableAddons?.find(
            (a) => a.branchProductAddonId === sa.branchProductAddonId
          );
          return {
            branchProductId: avail?.addonBranchProductId ?? sa.branchProductAddonId,
            quantity: sa.quantity * quantity,
            parentBasketItemId: main.basketItemId,
            isAddon: true,
          };
        });
        await onlineMenuService.batchAddItemsToMyBasket(addonPayloads);
      }
    } else {
      await onlineMenuService.addUnifiedItemToMyBasket({
        branchProductId: product.branchProductId,
        quantity,
        isAddon: false,
        extras: extrasPayload.length > 0 ? extrasPayload : undefined,
      });
    }

    await loadBasket();
    closeProductModal();
  } catch (err: any) {
    // ✅ If session expired, show error to user
    if (err?.response?.status === 401) {
      alert(t('menu.error.sessionExpired') || 'Your session has expired. Please refresh the page.');
    } else {
      throw new Error(err.message || t('menu.error.addToBasket'));
    }
  } finally {
    setIsAddingToBasket(false);
  }
};

  const handleAddToBasket = async (
    product: MenuProduct,
    quantity: number,
    addons: SelectedAddon[],
    extras: SelectedExtra[]
  ) => {
    try {
      await addToBasket(product, quantity, addons, extras);
    } catch (e: any) {
      alert(e.message || t('menu.error.addToBasket'));
    }
  };

  const handleProductGridAddToCart = async (
    product: MenuProduct
  ) => {
    // Check if product has extras
    const hasExtras =
      product.availableExtras &&
      product.availableExtras.length > 0 &&
      product.availableExtras.some((cat) => cat.extras && cat.extras.length > 0);

    // If product has addons or extras, force open modal
    if ((product.availableAddons && product.availableAddons.length > 0) || hasExtras) {
      openProductModal(product);
      return;
    }

    // Otherwise add directly to cart
    try {
      await addToBasket(product, 1, [], []);
    } catch (e: any) {
      alert(e.message || t('menu.error.addToBasket'));
    }
  };

  const handleRemoveFromCart = async (branchProductId: number) => {
    try {
      const item = basket?.items?.find(
        (i) => i.branchProductId === branchProductId && !i.isAddon
      );
      if (item?.basketItemId) {
        await onlineMenuService.deleteBasketItem(item.basketItemId);
        await loadBasket();
      }
    } catch (e: any) {
      // ✅ Handle expired session
      if (e?.response?.status === 401) {
        alert(t('menu.error.sessionExpired') || 'Your session has expired. Please refresh the page.');
      } else {
        alert(e.message || t('menu.error.removeFromBasket'));
      }
    }
  };

  const handleToggleFavorite = (branchProductId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(branchProductId)) {
        newFavorites.delete(branchProductId);
      } else {
        newFavorites.add(branchProductId);
      }
      localStorage.setItem('menu_favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const getCartItemQuantity = async (branchProductId: number): Promise<number> => {
    if (!basket || !basket.items) return 0;

    const item = basket.items.find(
      (i) => i.branchProductId === branchProductId && !i.isAddon
    );
    return item?.quantity || 0;
  };


  useEffect(() => {
    if (publicId) {
      initializeMenu(); // This calls initializeSession
    }
    // ✅ Empty dependency array = runs only once on mount
  }, [publicId]);

  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('menu_favorites');
    if (storedFavorites) {
      try {
        const favArray = JSON.parse(storedFavorites);
        setFavorites(new Set(favArray));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!basket || !menuData) return;

    const interval = setInterval(() => {
      checkBasketPriceChanges(basket);
    }, 30000);

    return () => clearInterval(interval);
  }, [basket, menuData]);

  const formatPrice = (price: number, currency: string = 'TRY') =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(price);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg ${theme.text.secondary}`}>{t('menu.loadingOnline')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-20 sm:pb-0">
      {/* Header */}
      {menuData && (
        <Header
          menuData={menuData}
          totalItems={basket?.itemCount || 0}
          onCartToggle={() => setIsCartOpen(true)}
        />
      )}

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Floating basket button (Mobile Only mostly) */}
          {basket && basket.totalPrice > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 flex items-center gap-2 hover:scale-105"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="font-bold">{basket.itemCount}</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline font-bold">
                {formatPrice(basket.totalPrice, menuData?.preferences.defaultCurrency)}
              </span>
            </button>
          )}

          {/* Cart sidebar */}
          <OnlineCartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            basket={basket}
            onBasketUpdate={loadBasket}
            currency={menuData?.preferences.defaultCurrency ?? 'TRY'}
            menuData={menuData}
          />

          {/* Price Change Modal */}
          <PriceChangeModal
            isVisible={showPriceChangeModal}
            priceChanges={priceChanges}
            confirmingPriceChanges={confirmingPriceChanges}
            onCancel={handlePriceChangeCancel}
            onConfirm={handlePriceChangeConfirm}
          />

          {/* Main Content Area */}
          {isLoadingMenu ? (
            <div
              className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8`}
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className={`text-lg ${theme.text.secondary}`}>
                  {t('menu.loadingPreview')}
                </p>
              </div>
            </div>
          ) : menuData ? (
            <div
              className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-xl dark:border-slate-700/50 overflow-hidden min-h-[80vh]`}
            >
              <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 h-full">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-transparent mt-6">
                  {/* Categories Sidebar */}
                  {!searchTerm && menuData.categories.length > 0 && (
                    <div className="hidden lg:block">
                      <CategoriesSidebar
                        categories={menuData.categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className={!searchTerm ? 'lg:col-span-3' : 'lg:col-span-4'}>
                    <ProductGrid
                      categories={menuData.categories}
                      selectedCategory={selectedCategory}
                      searchTerm={searchTerm}
                      cart={basket?.items || []}
                      favorites={favorites}
                      onAddToCart={handleProductGridAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      onToggleFavorite={handleToggleFavorite}
                      onCategorySelect={handleCategorySelect}
                      restaurantName={menuData.restaurantName}
                      onCustomize={openProductModal}
                      getCartItemQuantity={getCartItemQuantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Product Detail Modal */}
      <OnlineMenuProductModal
        product={selectedProduct}
        onClose={closeProductModal}
        onAddToCart={handleAddToBasket}
        isAddingToBasket={isAddingToBasket}
        currency={menuData?.preferences.defaultCurrency}
      />

      <Footer />
    </div>
  );
};

export default OnlineMenu;