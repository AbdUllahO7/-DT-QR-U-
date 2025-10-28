import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import { BasketResponse, onlineMenuService, BasketItem } from '../../../../services/Branch/Online/OnlineMenuService';
import CheckoutOrderType, { CheckoutOrderData } from './CheckoutOrderType';

interface OnlineCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketResponse | null;
  onBasketUpdate: () => Promise<void>;
  currency?: string;
  menuData?: any;
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
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const items = basket?.items || basket?.basketItems || [];
  const itemCount = basket?.itemCount || items.length;
  const total = basket?.total || basket?.totalPrice || 0;
  const subtotal = basket?.subtotal || basket?.productTotal || basket?.totalPrice || 0;
  const tax = basket?.tax || 0;

  const getAvailableAddonsForProduct = (item: BasketItem) => {
    if (!menuData?.categories) return [];
    
    for (const category of menuData.categories) {
      const product = category.products.find((p: any) => p.branchProductId === item.branchProductId);
      if (product && product.availableAddons) {
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
        branchProductId: 0,
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
        quantity: parentQuantity,
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
    // Open the checkout modal
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (orderData: CheckoutOrderData) => {
    try {
      console.log('Order submitted with data:', orderData);
      
      // Here you would typically:
      // 1. Submit the order to your backend
      // 2. Clear the basket
      // 3. Show success message
      // 4. Redirect to order confirmation page
      
      // Example API call (implement based on your API):
      // await orderService.createOrder({
      //   basketId: basket?.basketId,
      //   ...orderData
      // });
      
      alert('Order placed successfully!');
      setShowCheckoutModal(false);
      onClose();
      
      // Optionally clear basket and refresh
      await onBasketUpdate();
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      throw err; // Let CheckoutOrderType handle the error
    }
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
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <p className="text-emerald-100 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                <ShoppingCart className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>Your cart is empty</h3>
              <p className={theme.text.secondary}>Add items from the menu to get started!</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const itemAddons = item.addons || item.addonItems || [];
                const availableAddons = getAvailableAddonsForProduct(item);
                const isExpanded = expandedItems.has(item.basketItemId);

                return (
                  <div
                    key={item.basketItemId}
                    className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold ${theme.text.primary} mb-1`}>
                            {item.productName}
                          </h3>
                          <p className="text-sm text-emerald-600 font-semibold mb-2">
                            {formatPrice(item.specialPrice || item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1">
                              <button
                                onClick={() => handleUpdateQuantity(item.basketItemId, item.quantity, -1)}
                                disabled={updatingItemId === item.basketItemId}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.basketItemId, item.quantity, 1)}
                                disabled={updatingItemId === item.basketItemId}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
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

                    {/* Addons Section - keeping your existing code */}
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

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutOrderType
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        basketTotal={total}
        currency={currency}
        onSubmit={handleCheckoutSubmit}
      />
    </>
  );
};

export default OnlineCartSidebar;
