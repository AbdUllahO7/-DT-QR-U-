import { useState, useCallback } from 'react';
import { 
  BasketResponse, 
  onlineMenuService, 
  BasketItem, 
  ProductExtraDto
} from '../services/Branch/Online/OnlineMenuService';
import { 
  BasketExtraItem
} from '../services/Branch/BasketService';
import { orderService } from '../services/Branch/OrderService';
import { orderTypeService } from '../services/Branch/BranchOrderTypeService';
import { OrderType } from '../services/Branch/BranchOrderTypeService';
import { CreateSessionOrderDto, Order } from '../types/BranchManagement/type';
import { Toast } from '../components/dashboard/content/RestaurantManagement/ManagementInfoPanel';
import { basketService } from '../services/Branch/BasketService';

export interface UseOnlineCartHandlerProps {
  basket: BasketResponse | null;
  onBasketUpdate: () => Promise<void>;
  menuData: any;
  currency?: string;
}

export const useOnlineCartHandler = ({
  basket,
  onBasketUpdate,
  menuData,
  currency = 'TRY'
}: UseOnlineCartHandlerProps) => {
  // ===================================
  // STATE MANAGEMENT
  // ===================================
  
  // Loading states
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [addingAddonToItem, setAddingAddonToItem] = useState<number | null>(null);
  const [updatingExtraId, setUpdatingExtraId] = useState<number | null>(null);
  
  // UI states
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  // Checkout states
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [loadingOrderTypes, setLoadingOrderTypes] = useState<boolean>(false);
  const [orderTypeError, setOrderTypeError] = useState<string | null>(null);
  
  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'online' | ''>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Order submission states
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);
  const [priceChangeData, setPriceChangeData] = useState<any>(null);
  
  // Toast states
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ===================================
  // COMPUTED VALUES
  // ===================================
  
  const items = basket?.items || basket?.basketItems || [];
  const itemCount = basket?.itemCount || items.length;
  const total = basket?.total || basket?.totalPrice || 0;
  const subtotal = basket?.subtotal || basket?.productTotal || basket?.totalPrice || 0;
  const tax = basket?.tax || 0;

  // ===================================
  // TOAST FUNCTIONS
  // ===================================
  
  const addToast = useCallback((message: string, type: Toast['type'], duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { 
      id, 
      message, 
      type, 
      duration: duration || (type === 'loading' ? 0 : 3000) 
    }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const updateToast = useCallback((id: string, message: string, type: Toast['type'], duration?: number) => {
    setToasts(prev => prev.map(t => 
      t.id === id ? { ...t, message, type, duration: duration || 3000 } : t
    ));
  }, []);

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }, [currency]);

  const getAvailableAddonsForProduct = useCallback((item: BasketItem) => {
    if (!menuData?.categories) return [];

    for (const category of menuData.categories) {
      const product = category.products.find((p: any) => 
        p.branchProductId === item.branchProductId
      );
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
  }, [menuData]);

  const getAvailableExtrasForProduct = useCallback((item: BasketItem) => {
    if (!menuData?.categories) return [];

    for (const category of menuData.categories) {
      const product = category.products.find((p: any) => 
        p.branchProductId === item.branchProductId
      );
      if (product && product.availableExtras) {
        const existingExtraIds = (item.extras || []).map((e: BasketExtraItem) => 
          e.branchProductExtraId
        );
        
        const allExtras: any[] = [];
        product.availableExtras.forEach((extraCategory: any) => {
          if (extraCategory.extras && Array.isArray(extraCategory.extras)) {
            allExtras.push(...extraCategory.extras);
          }
        });
        
        return allExtras.filter((extra: any) =>
          !existingExtraIds.includes(extra.branchProductExtraId)
        );
      }
    }
    return [];
  }, [menuData]);

  const toggleItemExpanded = useCallback((basketItemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(basketItemId)) {
        newSet.delete(basketItemId);
      } else {
        newSet.add(basketItemId);
      }
      return newSet;
    });
  }, []);


    const handleDuplicateItem = useCallback(async (basketItemId: number) => {
    try {
        setUpdatingItemId(basketItemId);
        
        const item = items.find(i => i.basketItemId === basketItemId);
        if (!item) return;

      

        // ✅ Extract ALL non-removal extras with their ORIGINAL quantities
        const extrasToAdd: ProductExtraDto[] = [];
        
        if (item.extras && item.extras.length > 0) {
        item.extras.forEach(extra => {
            if (!extra.isRemoval) {
            // ✅ IMPORTANT: Preserve the original extra quantity
            const extraQuantity = extra.quantity || 1;
            
          
            extrasToAdd.push({
                branchProductExtraId: extra.branchProductExtraId,
                extraId: extra.extraId,
                quantity: extraQuantity, // ✅ Preserve original quantity
                isRemoval: false,
            });
            }
        });
        }

     

        // ✅ Add the duplicated product with all extras
        const newItem = await onlineMenuService.addUnifiedItemToMyBasket({
        branchProductId: item.branchProductId,
        quantity: 1, // Duplicate as single item
        isAddon: false,
        extras: extrasToAdd.length > 0 ? extrasToAdd : undefined,
        });

      

        // ✅ Duplicate addons with their quantities
        const itemAddons = item.addons || item.addonItems || [];
        if (itemAddons.length > 0 && newItem.basketItemId) {
      
        
        const addonPayloads = itemAddons.map((addon: any) => ({
            branchProductId: addon.addonBranchProductId || addon.branchProductId,
            quantity: addon.quantity, // ✅ Preserve addon quantity
            parentBasketItemId: newItem.basketItemId,
            isAddon: true,
        }));
        
        await onlineMenuService.batchAddItemsToMyBasket(addonPayloads);
        }

        // ✅ Reload basket to show updated state
        await onBasketUpdate();
        addToast('Product duplicated successfully with all customizations', 'success', 2000);
        
    } catch (err: any) {
        console.error('❌ Failed to duplicate item:', err);
        console.error('❌ Full error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
        });
        
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.title ||
                            err.message || 
                            'Failed to duplicate item';
        
        addToast(errorMessage, 'error', 3000);
        
        // Always reload basket to sync state
        await onBasketUpdate();
    } finally {
        setUpdatingItemId(null);
    }
    }, [items, onBasketUpdate, addToast]);
    
    const handleUpdateQuantity = useCallback(async (
        basketItemId: number, 
        currentQuantity: number, 
        change: number
    ) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
        await handleDeleteItem(basketItemId);
        return;
        }

        try {
        setUpdatingItemId(basketItemId);
        const item = items.find(i => i.basketItemId === basketItemId);
        if (!item) {
            console.error('❌ Cart item not found');
            addToast('Cart item not found. Please refresh.', 'error');
            return;
        }

        // Check if item has customizations
        const hasExtras = item.extras && item.extras.length > 0;
        const hasAddons = (item.addons && item.addons.length > 0) || 
                        (item.addonItems && item.addonItems.length > 0);
        const hasCustomizations = hasExtras || hasAddons;
        
      
        
        if (change > 0 && hasCustomizations) {
            // ✅ Duplicate the item with all customizations (like useCartHandler)
            
            for (let i = 0; i < change; i++) {
            await handleDuplicateItem(basketItemId);
            }
            
        } else {
            // Normal quantity update (no customizations or decreasing)
            
            await onlineMenuService.updateBasketItem(basketItemId, {
            basketItemId,
            basketId: basket?.basketId || '',
            branchProductId: item.branchProductId,
            quantity: newQuantity
            });

            await onBasketUpdate();
        }
        } catch (err: any) {
        console.error('❌ Failed to update quantity:', err);
        console.error('❌ Error details:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
        });
        
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Failed to update quantity';
        
        addToast(errorMessage, 'error', 3000);
        
        // Always reload basket to sync state
        await onBasketUpdate();
        } finally {
        setUpdatingItemId(null);
        }
    }, [basket, items, onBasketUpdate, addToast, handleDuplicateItem]);

    const handleDeleteItem = useCallback(async (basketItemId: number) => {
        if (!confirm('Are you sure you want to remove this item?')) return;

        try {
        setDeletingItemId(basketItemId);
        
        const item = items.find(i => i.basketItemId === basketItemId);
      
        await onlineMenuService.deleteBasketItem(basketItemId);
        
        await onBasketUpdate();
        } catch (err: any) {
        console.error('❌ Failed to delete item:', err);
        addToast(err.message || 'Failed to delete item', 'error', 3000);
        
        // Always reload to sync state
        await onBasketUpdate();
        } finally {
        setDeletingItemId(null);
        }
    }, [items, onBasketUpdate, addToast]);

    const handleClearBasket = useCallback(async () => {
        if (!confirm('Are you sure you want to clear your entire basket?')) return;

        try {
        setIsClearing(true);
        
      
        
        await onlineMenuService.clearBasket();
        
        await onBasketUpdate();
        addToast('Basket cleared', 'success', 3000);
        } catch (err: any) {
        console.error('❌ Failed to clear basket:', err);
        addToast(err.message || 'Failed to clear basket', 'error', 3000);
        } finally {
        setIsClearing(false);
        }
    }, [items.length, total, onBasketUpdate, addToast]);


  const handleUpdateAddonQuantity = useCallback(async (
    addonBasketItemId: number, 
    currentQuantity: number, 
    change: number, 
    maxQuantity: number
  ) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      await handleDeleteAddon(addonBasketItemId);
      return;
    }
    
    if (newQuantity > maxQuantity) {
      console.warn('⚠️ Cannot exceed max quantity:', { newQuantity, maxQuantity });
      addToast(`Maximum quantity is ${maxQuantity}`, 'error', 2000);
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
      console.error('❌ Failed to update addon quantity:', err);
      addToast(err.message || 'Failed to update addon quantity', 'error', 3000);
      
      // Always reload to sync state
      await onBasketUpdate();
    } finally {
      setUpdatingItemId(null);
    }
  }, [basket, onBasketUpdate, addToast]);

  const handleDeleteAddon = useCallback(async (addonBasketItemId: number) => {
    if (!confirm('Remove this add-on?')) return;

    try {
      
      await onlineMenuService.deleteBasketItem(addonBasketItemId);
      
      await onBasketUpdate();
    } catch (err: any) {
      console.error('❌ Failed to delete addon:', err);
      addToast(err.message || 'Failed to delete addon', 'error', 3000);
      
      // Always reload to sync state
      await onBasketUpdate();
    }
  }, [onBasketUpdate, addToast]);

  const handleAddAddonToItem = useCallback(async (
    parentBasketItemId: number, 
    addon: any, 
    parentQuantity: number
  ) => {
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
      console.error('❌ Failed to add addon:', err);
      addToast(err.message || 'Failed to add addon', 'error', 3000);
      
      // Always reload to sync state
      await onBasketUpdate();
    } finally {
      setAddingAddonToItem(null);
    }
  }, [onBasketUpdate, addToast]);

  // ===================================
  // EXTRA OPERATIONS (Using onlineMenuService)
  // ===================================
  
  const handleToggleExtra = useCallback(async (item: BasketItem, extra: any) => {
    try {
      setUpdatingExtraId(extra.branchProductExtraId);

      const currentExtras = item.extras || [];
      const existingIndex = currentExtras.findIndex(
        (e) => e.branchProductExtraId === extra.branchProductExtraId
      );

      let newExtras: ProductExtraDto[];

      if (existingIndex >= 0) {

        
        newExtras = currentExtras
          .filter((e) => e.branchProductExtraId !== extra.branchProductExtraId)
          .map((e) => ({
            branchProductExtraId: e.branchProductExtraId,
            extraId: e.extraId,
            quantity: e.quantity,
            isRemoval: e.isRemoval,
          }));
      } else {

        
        newExtras = [
          ...currentExtras.map((e) => ({
            branchProductExtraId: e.branchProductExtraId,
            extraId: e.extraId,
            quantity: e.quantity,
            isRemoval: e.isRemoval,
          })),
          {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            quantity: 1,
            isRemoval: extra.isRemoval || false,
          },
        ];
      }

      // ✅ Use onlineMenuService to update extras
      await onlineMenuService.updateBasketItemExtras(
        item.basketItemId,
        item.branchProductId,
        item.quantity,
        newExtras
      );

      await onBasketUpdate();
      addToast(
        existingIndex >= 0 ? 'Extra removed' : 'Extra added',
        'success'
      );
    } catch (error: any) {
      console.error('❌ Toggle extra error:', error);
      addToast(error.message || 'Failed to update extra', 'error');
      
      // Always reload to sync state
      await onBasketUpdate();
    } finally {
      setUpdatingExtraId(null);
    }
  }, [onBasketUpdate, addToast]);

  const handleUpdateExtraQuantity = useCallback(async (
    item: BasketItem,
    extraId: number,
    delta: number
  ) => {
    try {
      setUpdatingExtraId(extraId);

      const currentExtras = item.extras || [];
      const extra = currentExtras.find((e) => e.branchProductExtraId === extraId);

      if (!extra) {
        throw new Error('Extra not found');
      }

      if (extra.isRemoval) {
        console.error('❌ Cannot change quantity of removal extra');
        addToast('Cannot change quantity of removal extra', 'error');
        setUpdatingExtraId(null);
        return;
      }

      // Get min/max quantities with proper null checks
      const minQty = extra.minQuantity !== null && extra.minQuantity !== undefined ? extra.minQuantity : 0;
      const maxQty = extra.maxQuantity !== null && extra.maxQuantity !== undefined ? extra.maxQuantity : 999;

      // Calculate new quantity within bounds
      let newQuantity = extra.quantity + delta;
      newQuantity = Math.max(minQty, Math.min(maxQty, newQuantity));

      // Check if we've hit the limits
      if (newQuantity === extra.quantity) {
        if (delta > 0 && newQuantity >= maxQty) {
          addToast(`Maximum quantity for ${extra.extraName} is ${extra.maxQuantity}`, 'error');
        } else if (delta < 0 && newQuantity <= minQty) {
          addToast(`Minimum quantity for ${extra.extraName} is ${extra.minQuantity}`, 'error');
        }
        setUpdatingExtraId(null);
        return;
      }

  

      // ✅ Build new extras array with updated quantity
      const newExtras: ProductExtraDto[] = currentExtras.map((e) => ({
        branchProductExtraId: e.branchProductExtraId,
        extraId: e.extraId,
        quantity: e.branchProductExtraId === extraId ? newQuantity : e.quantity,
        isRemoval: e.isRemoval,
      }));

      // ✅ Use onlineMenuService to update extras
      await onlineMenuService.updateBasketItemExtras(
        item.basketItemId,
        item.branchProductId,
        item.quantity,
        newExtras
      );

      await onBasketUpdate();
      addToast('Extra quantity updated', 'success');
    } catch (error: any) {
      console.error('❌ Update extra quantity error:', error);
      addToast(error.message || 'Failed to update extra quantity', 'error');
      
      // Always reload to sync state
      await onBasketUpdate();
    } finally {
      setUpdatingExtraId(null);
    }
  }, [onBasketUpdate, addToast]);

  const handleDeleteExtra = useCallback(async (item: BasketItem, extraId: number) => {
    try {
      const confirmed = window.confirm('Remove this extra?');
      if (!confirmed) return;

      setUpdatingExtraId(extraId);

    

      const currentExtras = item.extras || [];
      
      // ✅ Filter out the extra to delete
      const newExtras: ProductExtraDto[] = currentExtras
        .filter((e) => e.branchProductExtraId !== extraId)
        .map((e) => ({
          branchProductExtraId: e.branchProductExtraId,
          extraId: e.extraId,
          quantity: e.quantity,
          isRemoval: e.isRemoval,
        }));

      // ✅ Use onlineMenuService to update extras
      await onlineMenuService.updateBasketItemExtras(
        item.basketItemId,
        item.branchProductId,
        item.quantity,
        newExtras
      );

      await onBasketUpdate();
      addToast('Extra removed', 'success');
    } catch (error: any) {
      console.error('❌ Delete extra error:', error);
      addToast(error.message || 'Failed to delete extra', 'error');
      
      // Always reload to sync state
      await onBasketUpdate();
    } finally {
      setUpdatingExtraId(null);
    }
  }, [onBasketUpdate, addToast]);

  // ===================================
  // CHECKOUT OPERATIONS
  // ===================================
  
  const loadOrderTypes = useCallback(async () => {
    try {
      setLoadingOrderTypes(true);
      setOrderTypeError(null);
      
      const types = await orderTypeService.getOrderTypesByOnlineSessionId();
      
      const availableTypes = types.filter(
        type => 
          type.isActive && 
          total >= type.minOrderAmount && 
          !type.requiresTable
      );
      
      if (availableTypes.length === 0) {
        setOrderTypeError('No order types available');
      }
      
      setOrderTypes(availableTypes);
      return availableTypes;
    } catch (err: any) {
      setOrderTypeError(err.message || 'Failed to load order types');
      return [];
    } finally {
      setLoadingOrderTypes(false);
    }
  }, [total]);

  const selectOrderType = useCallback((orderType: OrderType) => {
    setSelectedOrderType(orderType);
    setValidationErrors({});
    
    // Reset form fields based on requirements
    if (!orderType.requiresName) setCustomerName('');
    if (!orderType.requiresTable) setTableNumber('');
    if (!orderType.requiresAddress) setDeliveryAddress('');
    if (!orderType.requiresPhone) setCustomerPhone('');
  }, []);

  const resetForm = useCallback(() => {
    setCustomerName('');
    setTableNumber('');
    setDeliveryAddress('');
    setCustomerPhone('');
    setPaymentMethod('');
    setOrderNotes('');
    setValidationErrors({});
    setSelectedOrderType(null);
    setPriceChangeData(null);
  }, []);

  // Helper function to map payment method strings to numbers
  const getPaymentMethodNumber = useCallback((paymentMethod: string): number => {
    switch (paymentMethod) {
      case 'cash':
        return 1;
      case 'credit_card':
      case 'creditCard':
        return 2;
      case 'online':
      case 'onlinePayment':
        return 3;
      default:
        return 1; // Default to cash
    }
  }, []);

  const validateForm = useCallback((
    acceptCash: boolean,
    acceptCreditCard: boolean,
    acceptOnlinePayment: boolean
  ): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedOrderType) {
      setOrderTypeError('Please select order type');
      return false;
    }

    if (selectedOrderType.requiresName && !customerName.trim()) {
      errors.customerName = 'Name is required';
    }

    if (selectedOrderType.requiresTable && !tableNumber.trim()) {
      errors.tableNumber = 'Table number is required';
    }

    if (selectedOrderType.requiresAddress && !deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }

    if (selectedOrderType.requiresPhone) {
      if (!customerPhone.trim()) {
        errors.customerPhone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-()]+$/.test(customerPhone)) {
        errors.customerPhone = 'Invalid phone format';
      }
    }

    const hasPaymentOptions = acceptCash || acceptCreditCard || acceptOnlinePayment;
    if (hasPaymentOptions && !paymentMethod) {
      errors.paymentMethod = 'Please select payment method';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [selectedOrderType, customerName, tableNumber, deliveryAddress, customerPhone, paymentMethod]);

  const submitOrder = useCallback(async (
    onSuccess?: (order: Order) => void
  ) => {
    if (!selectedOrderType) {
      addToast('Please select order type', 'error');
      return null;
    }

    setSubmittingOrder(true);

    const orderData: CreateSessionOrderDto = {
      orderTypeId: selectedOrderType.id,
    } as CreateSessionOrderDto;

    if (selectedOrderType.requiresName && customerName.trim()) {
      orderData.customerName = customerName.trim();
    }
    if (selectedOrderType.requiresTable && tableNumber.trim()) {
      orderData.tableNumber = tableNumber.trim();
    }
    if (selectedOrderType.requiresAddress && deliveryAddress.trim()) {
      orderData.deliveryAddress = deliveryAddress.trim();
    }
    if (selectedOrderType.requiresPhone && customerPhone.trim()) {
      orderData.customerPhone = customerPhone.trim();
    }
    if (paymentMethod) {
      orderData.paymentMethod = getPaymentMethodNumber(paymentMethod);
    }
    if (orderNotes.trim()) {
      orderData.notes = orderNotes.trim();
    }

    try {
      const sessionId = localStorage.getItem('online_menu_session_id');
      if (sessionId && priceChangeData?.requiresConfirmation) {
        await basketService.confirmSessionPriceChanges(sessionId);
        await onBasketUpdate();
      }
      
      const order = await orderService.createSessionOrder(orderData);
      
      await onBasketUpdate();
      
      addToast('Order placed successfully! 🎉', 'success', 5000);

      if (onSuccess) {
        onSuccess(order);
      }

      return order;
    } catch (err: any) {
      console.error('❌ Error creating order:', err);
      addToast(err.message || 'Failed to place order', 'error', 5000);
      return null;
    } finally {
      setSubmittingOrder(false);
    }
  }, [
    selectedOrderType,
    customerName,
    tableNumber,
    deliveryAddress,
    customerPhone,
    paymentMethod,
    orderNotes,
    priceChangeData,
    onBasketUpdate,
    addToast,
    getPaymentMethodNumber
  ]);

  // ===================================
  // RETURN API
  // ===================================
  
  return {
    // State
    items,
    itemCount,
    total,
    subtotal,
    tax,
    
    // Loading states
    updatingItemId,
    deletingItemId,
    isClearing,
    addingAddonToItem,
    updatingExtraId,
    
    // UI states
    expandedItems,
    
    // Checkout states
    orderTypes,
    selectedOrderType,
    loadingOrderTypes,
    orderTypeError,
    
    // Form states
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
    deliveryAddress,
    setDeliveryAddress,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    validationErrors,
    
    // Order submission states
    submittingOrder,
    priceChangeData,
    setPriceChangeData,
    
    // Toast
    toasts,
    addToast,
    removeToast,
    updateToast,
    
    // Functions
    formatPrice,
    getAvailableAddonsForProduct,
    getAvailableExtrasForProduct,
    toggleItemExpanded,
    
    // Cart operations
    handleUpdateQuantity,
    handleDeleteItem,
    handleClearBasket,
    handleDuplicateItem,
    
    // Addon operations
    handleUpdateAddonQuantity,
    handleDeleteAddon,
    handleAddAddonToItem,
    
    // Extra operations
    handleToggleExtra,
    handleUpdateExtraQuantity,
    handleDeleteExtra,
    
    // Checkout operations
    loadOrderTypes,
    selectOrderType,
    resetForm,
    validateForm,
    submitOrder,
  };
};