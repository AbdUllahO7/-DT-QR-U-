import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe,
  Copy,
  ExternalLink,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  UtensilsCrossed,
  X,
  Plus,
  Minus,
  ShoppingCart,
} from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import {
  OnlineMenuResponse,
  onlineMenuService,
  Product,
  Category,
  ProductAddon,
  StartSessionDto,
  BasketResponse,
} from '../../../../services/Branch/Online/OnlineMenuService';
import OnlineCartSidebar from './OnlineCartSidebar';

interface PublicBranchData {
  branchName: string;
  publicId: string;
}

interface SelectedAddon {
  addonBranchProductId: number;
  branchProductAddonId?: number;
  quantity: number;
  addon: ProductAddon;
}

const OnlineMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ───── UI States ─────
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [publicBranchData, setPublicBranchData] = useState<PublicBranchData | null>(null);
  const [menuData, setMenuData] = useState<OnlineMenuResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // ───── Product Modal ─────
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [isAddingToBasket, setIsAddingToBasket] = useState<boolean>(false);

  // ───── Basket & Session ─────
  const [basket, setBasket] = useState<BasketResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // ───── Load branch id → menu → session ─────
  useEffect(() => {
    if (id) fetchPublicBranchId();
  }, [id]);

  const fetchPublicBranchId = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await onlineMenuService.getPublicBranchId(Number(id));
      setPublicBranchData(data);

      if (data.publicId) {
        await fetchOnlineMenu(data.publicId);
        await initializeSession(data.publicId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch public branch ID');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSession = async (publicId: string) => {
    try {
      setIsSessionInitialized(false);

      // ---- reuse existing session if possible ----
      const existingSessionId = localStorage.getItem('online_menu_session_id');
      const existingToken = localStorage.getItem('token');
      const existingPublicId = localStorage.getItem('online_menu_public_id');

      if (existingSessionId && existingToken && existingPublicId === publicId) {
        setSessionId(existingSessionId);
        setIsSessionInitialized(true);
        try {
          await loadBasket();
          return;
        } catch {
          localStorage.removeItem('online_menu_session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('online_menu_public_id');
        }
      }

      // ---- create new session ----
      const customerIdentifier =
        localStorage.getItem('customer_identifier') ||
        `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('customer_identifier', customerIdentifier);

      const deviceFingerprint = `${navigator.userAgent}_${navigator.language}_${screen.width}x${screen.height}`;

      const session = await onlineMenuService.startSession({
        publicId,
        customerIdentifier,
        deviceFingerprint,
        preferredLanguage: 'en',
      } as StartSessionDto);

      setSessionId(session.sessionId);
      localStorage.setItem('online_menu_session_id', session.sessionId);
      localStorage.setItem('token', session.sessionToken);
      localStorage.setItem('online_menu_public_id', publicId);
      localStorage.setItem('online_menu_branch_id', session.branchId.toString());
      localStorage.setItem('online_menu_expires_at', session.expiresAt);

      setIsSessionInitialized(true);
      await loadBasket();
    } catch (err: any) {
      console.error('Session init error:', err);
      setError('Failed to initialize session. Please refresh.');
    }
  };

  const loadBasket = async () => {
    try {
      const data = await onlineMenuService.getMyBasket();
      setBasket(data);
    } catch (err: any) {
      if (err?.response?.status === 401) setIsSessionInitialized(false);
      setBasket(null);
    }
  };

  const fetchOnlineMenu = async (publicId: string) => {
    try {
      setIsLoadingMenu(true);
      const menu = await onlineMenuService.getOnlineMenu(publicId);
      setMenuData(menu);
    } catch (err: any) {
      console.error('Menu fetch error:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // ───── Product modal helpers ─────
  const openProductModal = (product: Product) => {
    if (!isSessionInitialized) {
      alert('Session is being prepared…');
      return;
    }
    setSelectedProduct(product);
    setProductQuantity(1);
    setSelectedAddons([]);
  };
  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductQuantity(1);
    setSelectedAddons([]);
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
        const newQty = Math.max(
          1,
          Math.min(a.addon.maxQuantity, a.quantity + delta)
        );
        return { ...a, quantity: newQty };
      })
    );
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    let total = selectedProduct.price * productQuantity;
    selectedAddons.forEach((sa) => {
      const price = sa.addon.specialPrice ?? sa.addon.price;
      total += price * sa.quantity * productQuantity;
    });
    return total;
  };

  // ───── Add to basket (main + addons) ─────
  const addToBasket = async (
    product: Product,
    quantity: number,
    addons: SelectedAddon[] = []
  ) => {
    if (!isSessionInitialized) throw new Error('Session not ready');

    try {
      setIsAddingToBasket(true);

      if (addons.length) {
        // ---- main product ----
        const main = await onlineMenuService.addUnifiedItemToMyBasket({
          branchProductId: product.branchProductId,
          quantity,
          isAddon: false,
        });

        // ---- addons (parent = main) ----
        if (main.basketItemId) {
          const addonPayloads = addons.map((sa) => {
            const avail = product.availableAddons?.find(
              (a) => a.branchProductAddonId === sa.branchProductAddonId
            );
            return {
              branchProductId:
                avail?.addonBranchProductId ?? sa.branchProductAddonId,
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
        });
      }

      await loadBasket();
      closeProductModal();
    } catch (e: any) {
      throw e;
    } finally {
      setIsAddingToBasket(false);
    }
  };

  const handleAddToBasket = async () => {
    if (!selectedProduct) return;
    try {
      await addToBasket(selectedProduct, productQuantity, selectedAddons);
    } catch (e: any) {
      alert(e.message || 'Failed to add to basket');
    }
  };

  // ───── Misc helpers ─────
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getPublicMenuUrl = () =>
    publicBranchData
      ? `${window.location.origin}/menu/${publicBranchData.publicId}`
      : '';

  const formatPrice = (price: number, currency: string = 'TRY') =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(
      price
    );

  // ───── Loading UI ─────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg ${theme.text.secondary}`}>Loading online menu…</p>
        </div>
      </div>
    );
  }

  // ───── Main render ─────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Floating basket button */}
        {basket && basket.totalPrice > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center gap-2 hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-bold">{basket.itemCount}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline font-bold">
              {formatPrice(
                basket.totalPrice,
                menuData?.preferences.defaultCurrency
              )}
            </span>
          </button>
        )}

        {/* Cart sidebar – all props come from component state */}
        <OnlineCartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          basket={basket}
          onBasketUpdate={loadBasket}
          currency={menuData?.preferences.defaultCurrency ?? 'TRY'}
          menuData={menuData}
          restaurantPreferences={menuData?.preferences}
          orderTypes={menuData?.orderTypes ?? []}
          tableId={undefined} // set if you have a table id elsewhere
        />

        {/* Menu preview */}
        {isLoadingMenu ? (
          <div className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8`}>
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className={`text-lg ${theme.text.secondary}`}>Loading menu preview…</p>
            </div>
          </div>
        ) : menuData ? (
          <div className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden`}>

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{menuData.restaurantName}</h2>
                  <p className="text-emerald-100 mt-1">{menuData.branchName}</p>
                  {menuData.branchAddress && (
                    <p className="text-emerald-100 text-sm mt-1">{menuData.branchAddress}</p>
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    menuData.isOpen && !menuData.isTemporarilyClosed
                      ? 'bg-green-500/30 text-white'
                      : 'bg-red-500/30 text-white'
                  }`}
                >
                  {menuData.isOpen && !menuData.isTemporarilyClosed ? 'Open' : 'Closed'}
                </div>
              </div>
              {menuData.statusMessage && (
                <p className="text-emerald-100 mt-4">{menuData.statusMessage}</p>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                <h3 className={`text-2xl font-bold ${theme.text.primary}`}>Menu</h3>
              </div>

              {/* Categories */}
              <div className="space-y-8">
                {menuData.categories.map((cat: Category) => (
                  <div key={cat.categoryId} className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-500">
                      <h4 className={`text-xl font-bold ${theme.text.primary}`}>
                        {cat.categoryName}
                      </h4>
                      <span className={`text-sm ${theme.text.secondary}`}>
                        ({cat.products.length} items)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.products.map((prod: Product) => (
                        <div
                          key={prod.branchProductId}
                          onClick={() => openProductModal(prod)}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                        >
                          {/* Image */}
                          <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                            <img
                              src={prod.productImageUrl}
                              alt={prod.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                              }}
                            />
                            {prod.allergens?.length ? (
                              <div className="absolute top-2 right-2 flex gap-1">
                                {prod.allergens.slice(0, 3).map((a) => (
                                  <span
                                    key={a.allergenId}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                                    title={a.name}
                                  >
                                    {a.icon}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          {/* Info */}
                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className={`font-bold ${theme.text.primary} line-clamp-1`}>
                                {prod.productName}
                              </h5>
                              <span className="text-emerald-600 font-bold whitespace-nowrap">
                                {formatPrice(
                                  prod.price,
                                  menuData.preferences.defaultCurrency
                                )}
                              </span>
                            </div>

                            {prod.productDescription &&
                              menuData.preferences.showProductDescriptions && (
                                <p
                                  className={`text-sm ${theme.text.secondary} line-clamp-2`}
                                >
                                  {prod.productDescription}
                                </p>
                              )}

                            {/* Ingredients */}
                            {prod.ingredients?.length &&
                              menuData.preferences.enableIngredientDisplay && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {prod.ingredients.slice(0, 3).map((i) => (
                                    <span
                                      key={i.ingredientId}
                                      className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full"
                                    >
                                      {i.ingredientName}
                                    </span>
                                  ))}
                                  {prod.ingredients.length > 3 && (
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                      +{prod.ingredients.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                            {/* Add-ons badge */}
                            {prod.availableAddons?.length ? (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <ShoppingBag className="w-3 h-3" />
                                <span>{prod.availableAddons.length} add-ons available</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp info */}
              {menuData.preferences.useWhatsappForOrders && (
                <div className="mt-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">Phone</span>
                    <div>
                      <p className={`font-semibold ${theme.text.primary}`}>Order via WhatsApp</p>
                      <p className={`text-sm ${theme.text.secondary} mt-1`}>
                        Contact: {menuData.preferences.whatsAppPhoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ───── Product Detail Modal ───── */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className={`${theme.background.card} w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white flex items-start justify-between z-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{selectedProduct.productName}</h3>
                {selectedProduct.productDescription && (
                  <p className="text-emerald-100 mt-2">{selectedProduct.productDescription}</p>
                )}
              </div>
              <button
                onClick={closeProductModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img
                  src={selectedProduct.productImageUrl}
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                  }}
                />
              </div>

              {/* Base price */}
              <div className="flex items-center justify-between">
                <span className={`text-lg ${theme.text.secondary}`}>Base Price</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatPrice(
                    selectedProduct.price,
                    menuData?.preferences.defaultCurrency
                  )}
                </span>
              </div>

              {/* Ingredients */}
              {selectedProduct.ingredients?.length ? (
                <div className="space-y-2">
                  <h4 className={`font-bold ${theme.text.primary}`}>Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((i) => (
                      <span
                        key={i.ingredientId}
                        className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full"
                      >
                        {i.ingredientName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Allergens */}
              {selectedProduct.allergens?.length ? (
                <div className="space-y-2">
                  <h4 className={`font-bold ${theme.text.primary}`}>Allergen Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.allergens.map((a) => (
                      <span
                        key={a.allergenId}
                        className="text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800"
                      >
                        {a.icon} {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quantity */}
              <div className="space-y-2">
                <h4 className={`font-bold ${theme.text.primary}`}>Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">
                    {productQuantity}
                  </span>
                  <button
                    onClick={() => setProductQuantity(productQuantity + 1)}
                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add-ons */}
              {selectedProduct.availableAddons?.length ? (
                <div className="space-y-4">
                  <h4 className={`font-bold ${theme.text.primary}`}>Add-ons (Optional)</h4>
                  <div className="space-y-3">
                    {selectedProduct.availableAddons.map((addon) => {
                      const isSel = selectedAddons.some(
                        (s) => s.branchProductAddonId === addon.branchProductAddonId
                      );
                      const sel = selectedAddons.find(
                        (s) => s.branchProductAddonId === addon.branchProductAddonId
                      );

                      return (
                        <div
                          key={addon.branchProductAddonId}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSel
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                          }`}
                          onClick={() => handleAddonToggle(addon)}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={addon.addonImageUrl}
                              alt={addon.addonName}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className={`font-bold ${theme.text.primary}`}>
                                    {addon.addonName}
                                  </h5>
                                  {addon.addonDescription && (
                                    <p className={`text-sm ${theme.text.secondary} mt-1`}>
                                      {addon.addonDescription}
                                    </p>
                                  )}
                                  {addon.marketingText && (
                                    <p className="text-sm text-emerald-600 mt-1">
                                      {addon.marketingText}
                                    </p>
                                  )}
                                </div>
                                <span className="font-bold text-emerald-600 whitespace-nowrap">
                                  {formatPrice(
                                    addon.specialPrice ?? addon.price,
                                    menuData?.preferences.defaultCurrency
                                  )}
                                </span>
                              </div>

                              {isSel && sel && (
                                <div className="flex items-center gap-2 mt-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAddonQuantity(addon.branchProductAddonId, -1);
                                    }}
                                    className="p-1 bg-emerald-200 dark:bg-emerald-800 rounded-full hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-bold min-w-[2rem] text-center">
                                    {sel.quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAddonQuantity(addon.branchProductAddonId, 1);
                                    }}
                                    disabled={sel.quantity >= addon.maxQuantity}
                                    className="p-1 bg-emerald-200 dark:bg-emerald-800 rounded-full hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <span className="text-xs text-slate-500 ml-2">
                                    (Max: {addon.maxQuantity})
                                  </span>
                                </div>
                              )}
                            </div>

                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSel
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isSel && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Total summary */}
              <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.text.secondary}>
                    Product ({productQuantity}x)
                  </span>
                  <span className={theme.text.primary}>
                    {formatPrice(
                      selectedProduct.price * productQuantity,
                      menuData?.preferences.defaultCurrency
                    )}
                  </span>
                </div>

                {selectedAddons.map((sa) => (
                  <div
                    key={sa.addonBranchProductId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className={theme.text.secondary}>
                      {sa.addon.addonName} ({sa.quantity}x)
                    </span>
                    <span className={theme.text.primary}>
                      {formatPrice(
                        (sa.addon.specialPrice ?? sa.addon.price) * sa.quantity,
                        menuData?.preferences.defaultCurrency
                      )}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between text-lg font-bold pt-2">
                  <span className={theme.text.primary}>Total</span>
                  <span className="text-emerald-600">
                    {formatPrice(
                      calculateTotalPrice(),
                      menuData?.preferences.defaultCurrency
                    )}
                  </span>
                </div>
              </div>

              {/* Add to basket button */}
              <button
                onClick={handleAddToBasket}
                disabled={isAddingToBasket}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToBasket ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding to Basket…</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Basket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineMenu;