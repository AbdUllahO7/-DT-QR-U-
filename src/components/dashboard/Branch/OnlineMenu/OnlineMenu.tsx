import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Copy, ExternalLink, Loader2, ArrowLeft, CheckCircle, AlertCircle, ShoppingBag, UtensilsCrossed, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import { 
  OnlineMenuResponse, 
  onlineMenuService, 
  Product, 
  Category, 
  ProductAddon,
  StartSessionDto,
  BasketResponse
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
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [publicBranchData, setPublicBranchData] = useState<PublicBranchData | null>(null);
  const [menuData, setMenuData] = useState<OnlineMenuResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Product Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [isAddingToBasket, setIsAddingToBasket] = useState<boolean>(false);

  // Basket States
  const [basket, setBasket] = useState<BasketResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchPublicBranchId();
    }
  }, [id]);

  const fetchPublicBranchId = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await onlineMenuService.getPublicBranchId(Number(id));
      setPublicBranchData(data);
      
      // Automatically fetch the menu after getting public ID
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
        
        // Check if we already have a session in localStorage
        const existingSessionId = localStorage.getItem('online_menu_session_id');
        const existingToken = localStorage.getItem('online_menu_token');
        const existingPublicId = localStorage.getItem('online_menu_public_id');

        // If we have an existing session for the same publicId, use it
        if (existingSessionId && existingToken && existingPublicId === publicId) {
        console.log('✅ Using existing session:', existingSessionId);
        setSessionId(existingSessionId);
        setIsSessionInitialized(true);
        
        // Try to load basket with existing session
        try {
            await loadBasket();
            console.log('✅ Existing session is valid, basket loaded');
            return;
        } catch (err: any) {
            console.log('⚠️ Existing session invalid, creating new session');
            // Clear old session data
            localStorage.removeItem('online_menu_session_id');
            localStorage.removeItem('online_menu_token');
            localStorage.removeItem('online_menu_public_id');
        }
        }

        // Generate a unique customer identifier
        let customerIdentifier = localStorage.getItem('customer_identifier');
        if (!customerIdentifier) {
        customerIdentifier = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('customer_identifier', customerIdentifier);
        }

        // Generate device fingerprint
        const deviceFingerprint = `${navigator.userAgent}_${navigator.language}_${screen.width}x${screen.height}`;
        
        const sessionData: StartSessionDto = {
        publicId,
        customerIdentifier,
        deviceFingerprint,
        preferredLanguage: 'en'
        };

        console.log('🚀 Starting new online menu session...', { 
        publicId, 
        customerIdentifier
        });

        const session = await onlineMenuService.startSession(sessionData);
        
        console.log('✅ Session started successfully:', {
        sessionId: session.sessionId,
        branchId: session.branchId,
        branchName: session.branchName,
        tokenPreview: session.sessionToken.substring(0, 20) + '...',
        expiresAt: session.expiresAt
        });

        // Store session information in localStorage
        setSessionId(session.sessionId);
        localStorage.setItem('online_menu_session_id', session.sessionId);
        localStorage.setItem('online_menu_token', session.sessionToken); 
        localStorage.setItem('online_menu_public_id', publicId);
        localStorage.setItem('online_menu_branch_id', session.branchId.toString());
        localStorage.setItem('online_menu_expires_at', session.expiresAt);
        
        setIsSessionInitialized(true);
        
        console.log('📦 Session initialized successfully!');
        
        // Try to load basket (might be empty on first visit)
        try {
        await loadBasket();
        } catch (basketErr) {
        console.log('⚠️ Could not load basket on initialization (might be empty):', basketErr);
        // Don't fail initialization if basket is empty
        }
        
    } catch (err: any) {
        console.error('❌ Failed to initialize session:', err);
        console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
        });
        setIsSessionInitialized(false);
        setError('Failed to initialize session. Please refresh the page.');
    }
    };
    const loadBasket = async () => {
        try {
        console.log('📦 Loading basket...');
        const basketData = await onlineMenuService.getMyBasket();
        console.log('✅ Basket loaded successfully:', basketData);
        setBasket(basketData);
        } catch (err: any) {
        console.error('⚠️ Failed to load basket:', err);
        if (err?.response?.status === 401) {
            console.log('🔄 Session invalid (401), will need to reinitialize');
            setIsSessionInitialized(false);
        }
        setBasket(null);
        }
    };

  const fetchOnlineMenu = async (publicId: string) => {
    try {
      setIsLoadingMenu(true);
      const menu = await onlineMenuService.getOnlineMenu(publicId);
      setMenuData(menu);
    } catch (err: any) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const openProductModal = (product: Product) => {
    // Check if session is initialized before allowing add to cart
    if (!isSessionInitialized) {
      alert('Please wait while we set up your session...');
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
  setSelectedAddons(prev => {
    // Use branchProductAddonId consistently
    const existingIndex = prev.findIndex(
      a => a.branchProductAddonId === addon.branchProductAddonId
    );
    
    if (existingIndex >= 0) {
      // Remove addon
      console.log('Removing addon:', addon.addonName);
      return prev.filter((_, index) => index !== existingIndex);
    } else {
      // Add addon with quantity 1
      console.log('Adding addon:', addon.addonName);
      return [...prev, {
        branchProductAddonId: addon.branchProductAddonId,
        quantity: 1,
        addon
      }];
    }
  });
};

const updateAddonQuantity = (branchProductAddonId: number, change: number) => {
  setSelectedAddons(prev => {
    return prev.map(selectedAddon => {
      if (selectedAddon.branchProductAddonId === branchProductAddonId) {
        const newQuantity = Math.max(1, Math.min(selectedAddon.addon.maxQuantity, selectedAddon.quantity + change));
        return { ...selectedAddon, quantity: newQuantity };
      }
      return selectedAddon;
    });
  });
};

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    
    let total = selectedProduct.price * productQuantity;
    
    selectedAddons.forEach(selectedAddon => {
      const addonPrice = selectedAddon.addon.specialPrice || selectedAddon.addon.price;
      total += addonPrice * selectedAddon.quantity * productQuantity;
    });
    
    return total;
  };

    const addToBasket = async (product: Product, quantity: number, addons: SelectedAddon[] = []) => {
    if (!isSessionInitialized) {
        throw new Error('Session not initialized. Please refresh the page.');
    }

    try {
        setIsAddingToBasket(true);

        console.log('Adding to basket:', {
        product: product.productName,
        quantity,
        addons: addons.map(a => ({
            id: a.branchProductAddonId,
            name: a.addon.addonName,
            quantity: a.quantity
        }))
        });

        if (addons.length > 0) {
        // First, add the main product with specified quantity
        console.log('Adding main product...');
        const mainItem = await onlineMenuService.addUnifiedItemToMyBasket({
            branchProductId: product.branchProductId,
            quantity: quantity,
            isAddon: false
        });

        console.log('Main product added:', mainItem);

        // Then add addons with the main item as parent
        if (mainItem.basketItemId) {
            const addonItems = addons.map(selectedAddon => {
            // Find the corresponding available addon to get the correct addonBranchProductId
            const availableAddon = product.availableAddons?.find(
                a => a.branchProductAddonId === selectedAddon.branchProductAddonId
            );
            
            console.log('Mapping addon:', {
                selectedAddonId: selectedAddon.branchProductAddonId,
                foundAddon: availableAddon,
                addonBranchProductId: availableAddon?.addonBranchProductId
            });
            
            return {
                branchProductId: availableAddon?.addonBranchProductId || selectedAddon.branchProductAddonId,
                quantity: selectedAddon.quantity * quantity, // Multiply addon quantity by product quantity
                parentBasketItemId: mainItem.basketItemId,
                isAddon: true
            };
            });
            
            console.log('Adding addons in batch:', addonItems);
            await onlineMenuService.batchAddItemsToMyBasket(addonItems);
            console.log('Addons added successfully');
        }
        } else {
        // Simple add for items without addons
        console.log('Adding simple product without addons...');
        await onlineMenuService.addUnifiedItemToMyBasket({
            branchProductId: product.branchProductId,
            quantity: quantity,
            isAddon: false
        });
        console.log('Product added successfully');
        }

        // Reload basket after adding
        await loadBasket();
        
        // Close modal
        closeProductModal();

        console.log('Item successfully added to basket');

    } catch (err: any) {
        console.error('Error adding to basket:', err);
        throw err;
    } finally {
        setIsAddingToBasket(false);
    }
    };

  const handleAddToBasket = async () => {
    if (!selectedProduct) return;
    
    try {
      await addToBasket(selectedProduct, productQuantity, selectedAddons);
    } catch (err: any) {
      alert(err.message || 'Failed to add to basket. Please try again.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPublicMenuUrl = () => {
    if (!publicBranchData) return '';
    return `${window.location.origin}/menu/${publicBranchData.publicId}`;
  };

  const formatPrice = (price: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg ${theme.text.secondary}`}>Loading online menu...</p>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Floating Basket Button */}
      {basket && basket.totalPrice > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center gap-2 hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-bold">{basket.itemCount}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline font-bold">
              {formatPrice(basket.totalPrice, menuData?.preferences.defaultCurrency)}
            </span>
          </button>
        )}
        <OnlineCartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            basket={basket}
            onBasketUpdate={loadBasket}
            currency={menuData?.preferences.defaultCurrency}
      />
        {/* Menu Preview Section */}
        {isLoadingMenu ? (
          <div className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8`}>
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className={`text-lg ${theme.text.secondary}`}>Loading menu preview...</p>
            </div>
          </div>
        ) : menuData ? (
          <div className={`${theme.background.card} backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden`}>
            
            {/* Menu Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{menuData.restaurantName}</h2>
                  <p className="text-emerald-100 mt-1">{menuData.branchName}</p>
                  {menuData.branchAddress && (
                    <p className="text-emerald-100 text-sm mt-1">{menuData.branchAddress}</p>
                  )}
                </div>
                <div className={`px-4 py-2 rounded-xl font-semibold ${
                  menuData.isOpen && !menuData.isTemporarilyClosed
                    ? 'bg-green-500/30 text-white'
                    : 'bg-red-500/30 text-white'
                }`}>
                  {menuData.isOpen && !menuData.isTemporarilyClosed ? '🟢 Open' : '🔴 Closed'}
                </div>
              </div>
              {menuData.statusMessage && (
                <p className="text-emerald-100 mt-4">{menuData.statusMessage}</p>
              )}
            </div>

            {/* Menu Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                <h3 className={`text-2xl font-bold ${theme.text.primary}`}>Menu</h3>
              </div>

              {/* Categories */}
              <div className="space-y-8">
                {menuData.categories.map((category: Category) => (
                  <div key={category.categoryId} className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-500">
                      <h4 className={`text-xl font-bold ${theme.text.primary}`}>
                        {category.categoryName}
                      </h4>
                      <span className={`text-sm ${theme.text.secondary}`}>
                        ({category.products.length} items)
                      </span>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.products.map((product: Product) => (
                        <div 
                          key={product.branchProductId}
                          onClick={() => openProductModal(product)}
                          className={` rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                        >
                          {/* Product Image */}
                          <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                            <img
                              src={product.productImageUrl}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                              }}
                            />
                            {product.allergens && product.allergens.length > 0 && (
                              <div className="absolute top-2 right-2 flex gap-1">
                                {product.allergens.slice(0, 3).map((allergen) => (
                                  <span 
                                    key={allergen.allergenId}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                                    title={allergen.name}
                                  >
                                    {allergen.icon}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className={`font-bold ${theme.text.primary} line-clamp-1`}>
                                {product.productName}
                              </h5>
                              <span className="text-emerald-600 font-bold whitespace-nowrap">
                                {formatPrice(product.price, menuData.preferences.defaultCurrency)}
                              </span>
                            </div>

                            {product.productDescription && menuData.preferences.showProductDescriptions && (
                              <p className={`text-sm ${theme.text.secondary} line-clamp-2`}>
                                {product.productDescription}
                              </p>
                            )}

                            {/* Ingredients */}
                            {product.ingredients && product.ingredients.length > 0 && menuData.preferences.enableIngredientDisplay && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {product.ingredients.slice(0, 3).map((ingredient) => (
                                  <span 
                                    key={ingredient.ingredientId}
                                    className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full"
                                  >
                                    {ingredient.ingredientName}
                                  </span>
                                ))}
                                {product.ingredients.length > 3 && (
                                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                    +{product.ingredients.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Addons Badge */}
                            {product.availableAddons && product.availableAddons.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <ShoppingBag className="w-3 h-3" />
                                <span>{product.availableAddons.length} add-ons available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preferences Info */}
              {menuData.preferences.useWhatsappForOrders && (
                <div className="mt-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📱</span>
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className={`${theme.background.card} w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img
                  src={selectedProduct.productImageUrl}
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                  }}
                />
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className={`text-lg ${theme.text.secondary}`}>Base Price</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatPrice(selectedProduct.price, menuData?.preferences.defaultCurrency)}
                </span>
              </div>

              {/* Ingredients */}
              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`font-bold ${theme.text.primary}`}>Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ingredient) => (
                      <span 
                        key={ingredient.ingredientId}
                        className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full"
                      >
                        {ingredient.ingredientName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`font-bold ${theme.text.primary}`}>Allergen Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.allergens.map((allergen) => (
                      <span 
                        key={allergen.allergenId}
                        className="text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800"
                      >
                        {allergen.icon} {allergen.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <h4 className={`font-bold ${theme.text.primary}`}>Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">{productQuantity}</span>
                  <button
                    onClick={() => setProductQuantity(productQuantity + 1)}
                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Addons */}
{selectedProduct.availableAddons && selectedProduct.availableAddons.length > 0 && (
  <div className="space-y-4">
    <h4 className={`font-bold ${theme.text.primary}`}>Add-ons (Optional)</h4>
    <div className="space-y-3">
      {selectedProduct.availableAddons.map((addon) => {
        // Check if addon is selected using branchProductAddonId
        const isSelected = selectedAddons.some(
          a => a.branchProductAddonId === addon.branchProductAddonId
        );
        const selectedAddon = selectedAddons.find(
          a => a.branchProductAddonId === addon.branchProductAddonId
        );

        console.log('Addon:', addon.addonName, 'ID:', addon.branchProductAddonId, 'Selected:', isSelected);

        return (
          <div 
            key={addon.branchProductAddonId}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              isSelected 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
            }`}
            onClick={() => handleAddonToggle(addon)}
          >
            <div className="flex items-start gap-3">
              {/* Addon Image */}
              <img
                src={addon.addonImageUrl}
                alt={addon.addonName}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                }}
              />
              
              {/* Addon Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className={`font-bold ${theme.text.primary}`}>{addon.addonName}</h5>
                    {addon.addonDescription && (
                      <p className={`text-sm ${theme.text.secondary} mt-1`}>{addon.addonDescription}</p>
                    )}
                    {addon.marketingText && (
                      <p className="text-sm text-emerald-600 mt-1">{addon.marketingText}</p>
                    )}
                  </div>
                  <span className="font-bold text-emerald-600 whitespace-nowrap">
                    {formatPrice(addon.specialPrice || addon.price, menuData?.preferences.defaultCurrency)}
                  </span>
                </div>

                {/* Addon Quantity Controls (shown when selected) */}
                {isSelected && selectedAddon && (
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
                    <span className="font-bold min-w-[2rem] text-center">{selectedAddon.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateAddonQuantity(addon.branchProductAddonId, 1);
                      }}
                      disabled={selectedAddon.quantity >= addon.maxQuantity}
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

              {/* Checkbox Indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

              {/* Total Price Summary */}
              <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.text.secondary}>
                    Product ({productQuantity}x)
                  </span>
                  <span className={theme.text.primary}>
                    {formatPrice(selectedProduct.price * productQuantity, menuData?.preferences.defaultCurrency)}
                  </span>
                </div>
                
                {selectedAddons.map(selectedAddon => (
                  <div key={selectedAddon.addonBranchProductId} className="flex items-center justify-between text-sm">
                    <span className={theme.text.secondary}>
                      {selectedAddon.addon.addonName} ({selectedAddon.quantity}x)
                    </span>
                    <span className={theme.text.primary}>
                      {formatPrice(
                        (selectedAddon.addon.specialPrice || selectedAddon.addon.price) * selectedAddon.quantity,
                        menuData?.preferences.defaultCurrency
                      )}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between text-lg font-bold pt-2">
                  <span className={theme.text.primary}>Total</span>
                  <span className="text-emerald-600">
                    {formatPrice(calculateTotalPrice(), menuData?.preferences.defaultCurrency)}
                  </span>
                </div>
              </div>

              {/* Add to Basket Button */}
              <button
                onClick={handleAddToBasket}
                disabled={isAddingToBasket}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToBasket ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding to Basket...</span>
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