import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import { BasketResponse, onlineMenuService, BasketItem } from '../../../../services/Branch/Online/OnlineMenuService';

interface OnlineCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketResponse | null;
  onBasketUpdate: () => Promise<void>;
  currency?: string;
  menuData?: any; // To access available addons
}

const OnlineCartSidebar: React.FC<OnlineCartSidebarProps> = ({
  isOpen,
  onClose,
  basket,
  onBasketUpdate,
  currency = 'TRY',
  menuData
}) => {
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [addingAddonToItem, setAddingAddonToItem] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Use basketItems directly, or items if mapped
  const items = basket?.items || basket?.basketItems || [];
  const itemCount = basket?.itemCount || items.length;
  const total = basket?.total || basket?.totalPrice || 0;
  const subtotal = basket?.subtotal || basket?.productTotal || basket?.totalPrice || 0;
  const tax = basket?.tax || 0;

  // Get available addons for a product
  const getAvailableAddonsForProduct = (item: BasketItem) => {
    if (!menuData?.categories) return [];
    
    for (const category of menuData.categories) {
      const product = category.products.find((p: any) => p.branchProductId === item.branchProductId);
      if (product && product.availableAddons) {
        // Filter out already added addons
        const existingAddonIds = (item.addons || item.addonItems || []).map((a: any) => 
          a.branchProductId || a.addonBranchProductId
        );
        return product.availableAddons.filter((addon: any) => 
          !existingAddonIds.includes(addon.addonBranchProductId)
        );
      }
    }
    return [];
  };

  const toggleItemExpanded = (basketItemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(basketItemId)) {
        newSet.delete(basketItemId);
      } else {
        newSet.add(basketItemId);
      }
      return newSet;
    });
  };

  const handleUpdateQuantity = async (basketItemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      await handleDeleteItem(basketItemId);
      return;
    }

    try {
      setUpdatingItemId(basketItemId);
      
      const item = items.find(i => i.basketItemId === basketItemId);
      if (!item) return;

      await onlineMenuService.updateBasketItem(basketItemId, {
        basketItemId,
        basketId: basket?.basketId || '',
        branchProductId: item.branchProductId,
        quantity: newQuantity
      });

      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      alert(err.message || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteItem = async (basketItemId: number) => {
    if (!confirm('Are you sure you want to remove this item?')) {
      return;
    }

    try {
      setDeletingItemId(basketItemId);
      await onlineMenuService.deleteBasketItem(basketItemId);
      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to delete item:', err);
      alert(err.message || 'Failed to delete item');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleUpdateAddonQuantity = async (addonBasketItemId: number, currentQuantity: number, change: number, maxQuantity: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      await handleDeleteAddon(addonBasketItemId);
      return;
    }

    if (newQuantity > maxQuantity) {
      return;
    }

    try {
      setUpdatingItemId(addonBasketItemId);
      
      await onlineMenuService.updateBasketItem(addonBasketItemId, {
        basketItemId: addonBasketItemId,
        basketId: basket?.basketId || '',
        branchProductId: 0, // Will be handled by backend
        quantity: newQuantity
      });

      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to update addon quantity:', err);
      alert(err.message || 'Failed to update addon quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteAddon = async (addonBasketItemId: number) => {
    if (!confirm('Remove this add-on?')) {
      return;
    }

    try {
      await onlineMenuService.deleteBasketItem(addonBasketItemId);
      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to delete addon:', err);
      alert(err.message || 'Failed to delete addon');
    }
  };

  const handleAddAddonToItem = async (parentBasketItemId: number, addon: any, parentQuantity: number) => {
    try {
      setAddingAddonToItem(parentBasketItemId);
      
      await onlineMenuService.addUnifiedItemToMyBasket({
        branchProductId: addon.addonBranchProductId,
        quantity: parentQuantity, // Match parent quantity
        parentBasketItemId: parentBasketItemId,
        isAddon: true
      });

      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to add addon:', err);
      alert(err.message || 'Failed to add addon');
    } finally {
      setAddingAddonToItem(null);
    }
  };

  const handleClearBasket = async () => {
    if (!confirm('Are you sure you want to clear your entire basket?')) {
      return;
    }

    try {
      setIsClearing(true);
      await onlineMenuService.clearBasket();
      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to clear basket:', err);
      alert(err.message || 'Failed to clear basket');
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] ${theme.background.card} shadow-2xl z-50 transform transition-transform duration-300 flex flex-col`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Basket</h2>
              <p className="text-emerald-100 text-sm">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {itemCount === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className={`text-lg font-bold ${theme.text.primary} mb-2`}>
                Your basket is empty
              </h3>
              <p className={`text-sm ${theme.text.secondary} mb-6`}>
                Add some delicious items to get started!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Price Change Warning */}
              {(basket?.priceChangesDetected || basket?.hasUnconfirmedPriceChange) && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                        Prices have changed
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                        Some items in your basket have updated prices.
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            await onlineMenuService.confirmPriceChanges();
                            await onBasketUpdate();
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }}
                        className="mt-2 text-xs font-semibold text-yellow-600 hover:text-yellow-700 underline"
                      >
                        Confirm new prices
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {items.map((item) => {
                const itemAddons = item.addons || item.addonItems || [];
                const itemImage = item.productImageUrl || item.imageUrl;
                const itemUnitPrice = item.unitPrice || item.price;
                const itemInstructions = item.specialInstructions || item.addonNote;
                const isExpanded = expandedItems.has(item.basketItemId);
                const availableAddons = getAvailableAddonsForProduct(item);

                return (
                  <div 
                    key={item.basketItemId}
                    className={`rounded-xl border-2 transition-all ${
                      deletingItemId === item.basketItemId 
                        ? 'border-red-500 opacity-50' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Main Item */}
                    <div className="p-4">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <img
                          src={itemImage || 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png'}
                          alt={item.productName}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                          }}
                        />

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold ${theme.text.primary} mb-1`}>
                            {item.productName}
                          </h4>
                          <p className="text-sm text-emerald-600 font-semibold">
                            {formatPrice(itemUnitPrice)} each
                          </p>

                          {/* Special Instructions */}
                          {itemInstructions && (
                            <p className={`text-xs ${theme.text.secondary} mt-1 italic`}>
                              Note: {itemInstructions}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                              <button
                                onClick={() => handleUpdateQuantity(item.basketItemId, item.quantity, -1)}
                                disabled={updatingItemId === item.basketItemId}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                              >
                                {updatingItemId === item.basketItemId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                              </button>
                              <span className="font-bold min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.basketItemId, item.quantity, 1)}
                                disabled={updatingItemId === item.basketItemId}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleDeleteItem(item.basketItemId)}
                              disabled={deletingItemId === item.basketItemId}
                              className="ml-auto p-2 hover:bg-red-100 dark:hover:bg-red-950/20 rounded-lg text-red-500 transition-colors disabled:opacity-50"
                            >
                              {deletingItemId === item.basketItemId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${theme.text.secondary}`}>Item Total:</span>
                              <span className="font-bold text-emerald-600">
                                {formatPrice(item.totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addons Section */}
                    {(itemAddons.length > 0 || availableAddons.length > 0) && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => toggleItemExpanded(item.basketItemId)}
                          className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className={`text-sm font-semibold ${theme.text.primary}`}>
                            Add-ons {itemAddons.length > 0 && `(${itemAddons.length})`}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3">
                            {/* Current Addons */}
                            {itemAddons.map((addon) => {
                              const addonId = addon.addonBasketItemId || addon.basketItemId;
                              const addonName = addon.addonName || addon.productName;
                              const addonPrice = addon.specialPrice || addon.price;

                              return (
                                <div 
                                  key={addonId}
                                  className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className={`text-sm font-semibold ${theme.text.primary}`}>
                                      {addonName}
                                    </p>
                                    <p className="text-xs text-emerald-600 font-semibold">
                                      {formatPrice(addonPrice)} each
                                    </p>
                                  </div>

                                  {/* Addon Quantity Controls */}
                                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1">
                                    <button
                                      onClick={() => handleUpdateAddonQuantity(addonId, addon.quantity, -1, addon.maxQuantity || 10)}
                                      disabled={updatingItemId === addonId}
                                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-bold text-sm min-w-[1.5rem] text-center">
                                      {addon.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateAddonQuantity(addonId, addon.quantity, 1, addon.maxQuantity || 10)}
                                      disabled={updatingItemId === addonId || addon.quantity >= (addon.maxQuantity || 10)}
                                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteAddon(addonId)}
                                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/20 rounded text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}

                            {/* Available Addons to Add */}
                            {availableAddons.length > 0 && (
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <p className={`text-xs font-semibold ${theme.text.secondary} mb-2`}>
                                  Available Add-ons:
                                </p>
                                <div className="space-y-2">
                                  {availableAddons.map((addon: any) => (
                                    <button
                                      key={addon.branchProductAddonId}
                                      onClick={() => handleAddAddonToItem(item.basketItemId, addon, item.quantity)}
                                      disabled={addingAddonToItem === item.basketItemId}
                                      className="w-full flex items-center justify-between p-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-emerald-600" />
                                        <span className={`text-sm ${theme.text.primary}`}>
                                          {addon.addonName}
                                        </span>
                                      </div>
                                      <span className="text-sm font-semibold text-emerald-600">
                                        {formatPrice(addon.specialPrice || addon.price)}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Clear Basket Button */}
              {itemCount > 0 && (
                <button
                  onClick={handleClearBasket}
                  disabled={isClearing}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isClearing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Clearing...
                    </span>
                  ) : (
                    'Clear Basket'
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {itemCount > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-4">
            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={theme.text.secondary}>Subtotal:</span>
                <span className={theme.text.primary}>{formatPrice(subtotal)}</span>
              </div>
              {tax > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.text.secondary}>Tax:</span>
                  <span className={theme.text.primary}>{formatPrice(tax)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className={theme.text.primary}>Total:</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OnlineCartSidebar;