import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Loader2,
  CheckCircle,
  X,
  Plus,
  Minus,
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



interface SelectedAddon {
  addonBranchProductId: number;
  branchProductAddonId?: number;
  quantity: number;
  addon: ProductAddon;
}

interface SelectedExtra {
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

// ==========================================
// COMPONENT
// ==========================================

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
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
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

  // ==========================================
  // PRICE CHANGE DETECTION
  // ==========================================

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

  // ==========================================
  // PRODUCT MODAL & CUSTOMIZATION
  // ==========================================

  const openProductModal = (product: MenuProduct) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setSelectedAddons([]);
    setSelectedExtras([]);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductQuantity(1);
    setSelectedAddons([]);
    setSelectedExtras([]);
  };

  const handleAddonToggle = (addon: ProductAddon) => {
    setSelectedAddons((prev) => {
      const idx = prev.findIndex(
        (a) => a.branchProductAddonId === addon.branchProductAddonId
      );
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [
        ...prev,
        {
          addonBranchProductId: addon.branchProductAddonId,
          branchProductAddonId: addon.branchProductAddonId,
          quantity: 1,
          addon,
        },
      ];
    });
  };

  const updateAddonQuantity = (branchProductAddonId: number, delta: number) => {
    setSelectedAddons((prev) =>
      prev.map((a) => {
        if (a.branchProductAddonId !== branchProductAddonId) return a;
        // Safety check for maxQuantity
        const maxQty = a.addon.maxQuantity || 99;
        const newQty = Math.max(1, Math.min(maxQty, a.quantity + delta));
        return { ...a, quantity: newQty };
      })
    );
  };

  const handleExtraToggle = (extra: any) => {
    if (extra.isRemoval) {
      // Toggle removal extras on/off
      setSelectedExtras((prev) => {
        const idx = prev.findIndex(
          (e) => e.branchProductExtraId === extra.branchProductExtraId
        );
        if (idx >= 0) {
          return prev.filter((_, i) => i !== idx);
        }
        return [
          ...prev,
          {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            extraName: extra.extraName,
            extraCategoryName: extra.categoryName, // Now we ensure this is passed correctly
            quantity: 1,
            isRemoval: true,
            unitPrice: extra.unitPrice || 0,
            maxQuantity: extra.maxQuantity,
            minQuantity: extra.minQuantity,
            selectionMode: extra.selectionMode,
            isRequired: extra.isRequired,
          },
        ];
      });
    } else {
      // Add quantity extras
      setSelectedExtras((prev) => {
        const idx = prev.findIndex(
          (e) => e.branchProductExtraId === extra.branchProductExtraId
        );
        if (idx >= 0) return prev; // Already selected, do nothing
        return [
          ...prev,
          {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            extraName: extra.extraName,
            extraCategoryName: extra.categoryName,
            quantity: 1,
            isRemoval: false,
            unitPrice: extra.unitPrice || 0,
            maxQuantity: extra.maxQuantity,
            minQuantity: extra.minQuantity,
            selectionMode: extra.selectionMode,
            isRequired: extra.isRequired,
          },
        ];
      });
    }
  };

  const updateExtraQuantity = (branchProductExtraId: number, delta: number) => {
    setSelectedExtras((prev) =>
      prev.map((e) => {
        if (e.branchProductExtraId !== branchProductExtraId) return e;
        if (e.isRemoval) return e;

        const newQty = Math.max(
          e.minQuantity || 1,
          Math.min(e.maxQuantity || 10, e.quantity + delta)
        );
        return { ...e, quantity: newQty };
      })
    );
  };

  const removeExtra = (branchProductExtraId: number) => {
    setSelectedExtras((prev) =>
      prev.filter((e) => e.branchProductExtraId !== branchProductExtraId)
    );
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    let total = selectedProduct.price * productQuantity;

    // Add addons price
    selectedAddons.forEach((sa) => {
      const price = sa.addon.specialPrice ?? sa.addon.price;
      total += price * sa.quantity * productQuantity;
    });

    // Add extras price (only non-removal ones usually have a price addition)
    selectedExtras.forEach((se) => {
      if (!se.isRemoval) {
        total += se.unitPrice * se.quantity * productQuantity;
      }
    });

    return total;
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

  const handleAddToBasket = async () => {
    if (!selectedProduct) return;
    try {
      await addToBasket(selectedProduct, productQuantity, selectedAddons, selectedExtras);
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

      {/* ==========================================
          PRODUCT DETAIL MODAL (Redesigned)
          ========================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Container changes: 
            1. flex flex-col: To stack Header, Body, Footer vertically.
            2. max-h-[95vh] or h-[90vh]: Limits height to viewport.
            3. w-full sm:max-w-2xl: Responsive width.
          */}
          <div
            className={`${theme.background.card} w-full sm:max-w-3xl h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* 1. STICKY HEADER */}
            <div className="shrink-0 relative">
              {/* Product Image Background for Header */}
              <div className="h-48 sm:h-56 w-full relative">
                 <img
                  src={selectedProduct.productImageUrl}
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                   <h3 className="text-2xl sm:text-3xl font-bold shadow-sm">{selectedProduct.productName}</h3>
                   {selectedProduct.productDescription && (
                    <p className="text-white/90 text-sm mt-1 line-clamp-2">
                      {selectedProduct.productDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              
              {/* Ingredients */}
              {selectedProduct.ingredients?.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${theme.text.secondary}`}>
                    {t('menu.ingredients')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((i) => (
                      <span
                        key={i.ingredientId}
                        className="text-sm bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600"
                      >
                        {i.ingredientName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

               {/* Allergens */}
              {selectedProduct.allergens?.length > 0 && (
                <div className="space-y-3">
                   <h4 className={`font-bold text-sm uppercase tracking-wider ${theme.text.secondary}`}>
                    {t('menu.allergens')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.allergens.map((a) => (
                      <span
                        key={a.id}
                        className="text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-800/50 flex items-center gap-1"
                      >
                        {a.icon} {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Extras Section */}
              {selectedProduct.availableExtras && selectedProduct.availableExtras.length > 0 && (
                <div className="space-y-6">
                  {selectedProduct.availableExtras.map(
                    (extraCategory) =>
                      extraCategory.extras &&
                      extraCategory.extras.length > 0 && (
                        <div key={extraCategory.categoryId} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-bold text-lg ${theme.text.primary}`}>
                              {extraCategory.categoryName}
                            </h5>
                             {extraCategory.isRequired && (
                                <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                                  {t('menu.required') || 'Required'}
                                </span>
                              )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            {extraCategory.extras.map((extra) => {
                              const isSelected = selectedExtras.some(
                                (s) => s.branchProductExtraId === extra.branchProductExtraId
                              );
                              const selectedExtra = selectedExtras.find(
                                (s) => s.branchProductExtraId === extra.branchProductExtraId
                              );

                              return (
                                <div
                                  key={extra.branchProductExtraId}
                                  onClick={() =>
                                    handleExtraToggle({
                                      ...extra,
                                      categoryName: extraCategory.categoryName,
                                    })
                                  }
                                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                    extra.isRemoval
                                      ? isSelected
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                                      : isSelected
                                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm ring-1 ring-emerald-500/20'
                                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Selection Indicator */}
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                            isSelected 
                                            ? (extra.isRemoval ? 'bg-red-500 border-red-500' : 'bg-emerald-500 border-emerald-500') 
                                            : 'border-slate-300 dark:border-slate-500'
                                        }`}>
                                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                        </div>

                                      <span className={`font-medium ${theme.text.primary}`}>
                                        {extra.extraName}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {!extra.isRemoval && extra.unitPrice > 0 && (
                                        <span className={`font-medium ${theme.text.primary}`}>
                                          +{formatPrice(extra.unitPrice, menuData?.preferences.defaultCurrency)}
                                        </span>
                                      )}
                                      {extra.isRemoval && (
                                        <span className="text-xs font-bold text-red-500 uppercase">
                                          {t('menu.remove') || 'Remove'}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Quantity Controls inside card */}
                                  {isSelected && !extra.isRemoval && (
                                    <div
                                      className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                                        <button
                                          onClick={() => updateExtraQuantity(extra.branchProductExtraId, -1)}
                                          disabled={selectedExtra?.quantity === (extra.minQuantity || 1)}
                                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-6 text-center text-sm">
                                          {selectedExtra?.quantity || 1}
                                        </span>
                                        <button
                                          onClick={() => updateExtraQuantity(extra.branchProductExtraId, 1)}
                                          disabled={selectedExtra && selectedExtra.quantity >= (extra.maxQuantity || 10)}
                                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}

              {/* Addons Section */}
              {selectedProduct.availableAddons && selectedProduct.availableAddons.length > 0 && (
                <div className="space-y-4">
                  <h4 className={`font-bold text-lg ${theme.text.primary}`}>{t('menu.addons')}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProduct.availableAddons.map((addon) => {
                      const isSelected = selectedAddons.some(
                        (a) => a.branchProductAddonId === addon.branchProductAddonId
                      );
                      const currentAddon = selectedAddons.find(
                        (a) => a.branchProductAddonId === addon.branchProductAddonId
                      );

                      return (
                        <div
                          key={addon.branchProductAddonId}
                          onClick={() => handleAddonToggle(addon)}
                           className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm ring-1 ring-emerald-500/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-slate-300 dark:border-slate-500'
                                }`}
                              >
                                {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-medium ${theme.text.primary}`}>
                                {addon.addonProductName}
                              </span>
                            </div>
                            <span className="font-medium text-emerald-600">
                              +{formatPrice(addon.specialPrice ?? addon.price, menuData?.preferences.defaultCurrency)}
                            </span>
                          </div>

                          {/* Addon Quantity */}
                          {isSelected && currentAddon && (
                             <div
                                className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5"
                                onClick={(e) => e.stopPropagation()}
                              >
                              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                                <button
                                  onClick={() => updateAddonQuantity(addon.branchProductAddonId, -1)}
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-6 text-center text-sm">
                                  {currentAddon.quantity}
                                </span>
                                <button
                                  onClick={() => updateAddonQuantity(addon.branchProductAddonId, 1)}
                                  disabled={currentAddon.quantity >= (addon.maxQuantity || 99)}
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. STICKY FOOTER */}
            <div className={`shrink-0 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 ${theme.background.card} z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}>
              <div className="flex flex-col gap-4">
                 {/* Main Quantity Selector (Centered) */}
                 <div className="flex items-center justify-center gap-6 mb-2">
                    <button
                      onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                    <span className="text-3xl font-bold min-w-[3rem] text-center">
                      {productQuantity}
                    </span>
                    <button
                      onClick={() => setProductQuantity(productQuantity + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToBasket}
                    disabled={isAddingToBasket}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="flex-1 text-left">
                      {isAddingToBasket ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('menu.adding')}
                        </span>
                      ) : (
                        t('menu.addToOrder')
                      )}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                      {formatPrice(
                        calculateTotalPrice(),
                        menuData?.preferences.defaultCurrency
                      )}
                    </span>
                  </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OnlineMenu;