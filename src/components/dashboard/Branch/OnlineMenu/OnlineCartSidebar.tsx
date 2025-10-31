import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, AlertCircle, Loader2, ChevronDown, ChevronUp, 
         User, MapPin, Phone, Table, CheckCircle, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, 
         Clock, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { CreateSessionOrderDto, theme } from '../../../../types/BranchManagement/type';
import { BasketResponse, onlineMenuService, BasketItem } from '../../../../services/Branch/Online/OnlineMenuService';
import { OrderType, orderTypeService } from '../../../../services/Branch/BranchOrderTypeService';
import { basketService } from '../../../../services/Branch/BasketService';
import { orderService } from '../../../../services/Branch/OrderService';
import WhatsAppConfirmationModal from '../Menu/CartSideBar/WhatsAppConfirmationModal';
import { useLanguage } from '../../../../contexts/LanguageContext';
import ToastComponent from '../Menu/CartSideBar/ToastComponenet';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'loading';
  duration?: number;
}

interface OnlineCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketResponse | null;
  onBasketUpdate: () => Promise<void>;
  currency?: string;
  menuData?: any;
}

type CheckoutStep = 'cart' | 'order-type' | 'information';

const OnlineCartSidebar: React.FC<OnlineCartSidebarProps> = ({
  isOpen,
  onClose,
  basket,
  onBasketUpdate,
  currency = 'TRY',
  menuData
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Cart States
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [addingAddonToItem, setAddingAddonToItem] = useState<number | null>(null);
  
  // Checkout Step Management
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  
  // Order Type States
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [loadingOrderTypes, setLoadingOrderTypes] = useState<boolean>(false);
  const [orderTypeError, setOrderTypeError] = useState<string | null>(null);
  
  // Form States
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'online' | ''>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Checkout States
  const [showPriceChangeModal, setShowPriceChangeModal] = useState<boolean>(false);
  const [priceChangeData, setPriceChangeData] = useState<any>(null);
  const [confirmingPrice, setConfirmingPrice] = useState<boolean>(false);
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] = useState<boolean>(false);

  // Toast States
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast Functions
  const addToast = (message: string, type: Toast['type'], duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const items = basket?.items || basket?.basketItems || [];
  const itemCount = basket?.itemCount || items.length;
  const total = basket?.total || basket?.totalPrice || 0;
  const subtotal = basket?.subtotal || basket?.productTotal || basket?.totalPrice || 0;
  const tax = basket?.tax || 0;

  // Get restaurant preferences
  const restaurantPreferences = menuData?.preferences || menuData?.restaurantPreferences || {};
  const restaurantName = menuData?.restaurantName || restaurantPreferences?.restaurantName || 'Restaurant';
  const whatsappOrderNumber = restaurantPreferences?.whatsAppPhoneNumber;
  const enableWhatsAppOrdering = restaurantPreferences?.useWhatsappForOrders;
  const acceptCash = restaurantPreferences?.acceptCash;
  const acceptCreditCard = restaurantPreferences?.acceptCreditCard;
  const acceptOnlinePayment = restaurantPreferences?.acceptOnlinePayment;

  // Reset to cart view when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('cart');
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCustomerName('');
    setTableNumber('');
    setDeliveryAddress('');
    setCustomerPhone('');
    setPaymentMethod('');
    setValidationErrors({});
    setSelectedOrderType(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

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
    if (!confirm('Are you sure you want to remove this item?')) return;

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
    if (newQuantity > maxQuantity) return;

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
    if (!confirm('Remove this add-on?')) return;

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
    if (!confirm('Are you sure you want to clear your entire basket?')) return;

    try {
      setIsClearing(true);
      await onlineMenuService.clearBasket();
      await onBasketUpdate();
      addToast(t('menu.cart.cleared') || 'Basket cleared', 'success', 3000);
    } catch (err: any) {
      console.error('Failed to clear basket:', err);
      addToast(err.message || 'Failed to clear basket', 'error', 3000);
    } finally {
      setIsClearing(false);
    }
  };

  // Proceed to checkout - load order types
  const handleCheckout = async () => {
    await onBasketUpdate();

    const sessionId = localStorage.getItem('online_menu_session_id');
    if (!sessionId) {
      alert('Session expired. Please refresh.');
      return;
    }

    try {
      await basketService.confirmSessionPriceChanges(sessionId);
    } catch (err: any) {
      console.warn('Price check failed, proceeding anyway:', err);
    }

    // Fetch order types
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
        setOrderTypeError(t('order.form.noOrderTypesAvailable'));
      }
      
      setOrderTypes(availableTypes);
      setCurrentStep('order-type');
    } catch (err: any) {
      setOrderTypeError(err.message || t('order.form.failedToLoadOrderTypes'));
    } finally {
      setLoadingOrderTypes(false);
    }
  };

  const handleOrderTypeSelect = (orderType: OrderType) => {
    setSelectedOrderType(orderType);
    setValidationErrors({});
    
    if (!orderType.requiresName) setCustomerName('');
    if (!orderType.requiresTable) setTableNumber('');
    if (!orderType.requiresAddress) setDeliveryAddress('');
    if (!orderType.requiresPhone) setCustomerPhone('');

    setCurrentStep('information');
  };

  const handleBackToCart = () => {
    setCurrentStep('cart');
    resetForm();
  };

  const handleBackToOrderTypes = () => {
    setCurrentStep('order-type');
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedOrderType) {
      setOrderTypeError(t('order.form.pleaseSelectOrderType'));
      return false;
    }

    if (selectedOrderType.requiresName && !customerName.trim()) {
      errors.customerName = t('order.form.nameRequired');
    }

    if (selectedOrderType.requiresTable && !tableNumber.trim()) {
      errors.tableNumber = t('order.form.tableRequired');
    }

    if (selectedOrderType.requiresAddress && !deliveryAddress.trim()) {
      errors.deliveryAddress = t('order.form.addressRequired');
    }

    if (selectedOrderType.requiresPhone) {
      if (!customerPhone.trim()) {
        errors.customerPhone = t('order.form.phoneRequired');
      } else if (!/^\+?[\d\s\-()]+$/.test(customerPhone)) {
        errors.customerPhone = t('order.form.invalidPhoneFormat');
      }
    }

    const hasPaymentOptions = acceptCash || acceptCreditCard || acceptOnlinePayment;
    if (hasPaymentOptions && !paymentMethod) {
      errors.paymentMethod = t('order.form.selectPaymentMethod');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setSubmittingOrder(true);

    const orderData: CreateSessionOrderDto = {
      orderTypeId: selectedOrderType!.id,
    } as CreateSessionOrderDto;

    // Add optional fields based on order type requirements
    if (selectedOrderType!.requiresName && customerName.trim()) {
      orderData.customerName = customerName.trim();
    }
    if (selectedOrderType!.requiresTable && tableNumber.trim()) {
      orderData.tableNumber = tableNumber.trim();
    }
    if (selectedOrderType!.requiresAddress && deliveryAddress.trim()) {
      orderData.deliveryAddress = deliveryAddress.trim();
    }
    if (selectedOrderType!.requiresPhone && customerPhone.trim()) {
      orderData.customerPhone = customerPhone.trim();
    }
    if (paymentMethod) {
      orderData.paymentMethod = paymentMethod;
    }

    try {
      const sessionId = localStorage.getItem('online_menu_session_id');
      if (sessionId && priceChangeData?.requiresConfirmation) {
        await basketService.confirmSessionPriceChanges(sessionId);
        await onBasketUpdate();
      }
      
      await orderService.createSessionOrder(orderData);
      
      await onBasketUpdate();
      
      // Show success toast
      addToast(t('menu.cart.order_created_success') || 'Order placed successfully! 🎉', 'success', 5000);
      
      if (enableWhatsAppOrdering && whatsappOrderNumber) {
        // Wait a moment for the toast to be visible before showing WhatsApp modal
        setTimeout(() => {
          setShowWhatsAppConfirmation(true);
        }, 500);
      } else {
        // Close sidebar after showing toast
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      addToast(err.message || t('menu.cart.order_creation_failed') || 'Failed to place order', 'error', 5000);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    setShowWhatsAppConfirmation(false);
    
    if (whatsappOrderNumber) {
      const cleanNumber = whatsappOrderNumber.replace(/\D/g, '');
      const message = `Hello ${restaurantName}, I just placed an order and would like to confirm the details.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
    
    onClose();
  };

  const handleWhatsAppCancel = () => {
    setShowWhatsAppConfirmation(false);
    onClose();
  };

  // Available payment methods
  const availablePaymentMethods = [];
  if (acceptCash) {
    availablePaymentMethods.push({
      id: 'cash',
      name: t('order.form.cash'),
      icon: Banknote,
      description: t('order.form.cashDescription')
    });
  }
  if (acceptCreditCard) {
    availablePaymentMethods.push({
      id: 'credit_card',
      name: t('order.form.creditCard'),
      icon: CreditCard,
      description: t('order.form.creditCardDescription')
    });
  }
  if (acceptOnlinePayment) {
    availablePaymentMethods.push({
      id: 'online',
      name: t('order.form.onlinePayment'),
      icon: Smartphone,
      description: t('order.form.onlinePaymentDescription')
    });
  }

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const ForwardIcon = isRTL ? ArrowLeft : ArrowRight;

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'cart':
        return t('menu.cart.title');
      case 'order-type':
        return t('order.form.selectOrderType');
      case 'information':
        return t('order.form.orderInformation');
      default:
        return t('menu.cart.title');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-600 dark:from-slate-700 dark:to-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">{getStepTitle()}</h2>
              <p className="text-emerald-100 text-sm">
                {currentStep === 'cart' && `${itemCount} ${t('menu.items')}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicators - Only show during checkout */}
        {currentStep !== 'cart' && (
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <button
              onClick={handleBackToCart}
              className="flex-1 py-3 px-4 text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300">
                  ✓
                </span>
                <span>{t('menu.cart.title')}</span>
              </div>
            </button>
            <button
              onClick={currentStep === 'information' ? handleBackToOrderTypes : undefined}
              disabled={currentStep === 'order-type'}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                currentStep === 'order-type'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  currentStep === 'order-type' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }`}>
                  1
                </span>
                <span>{t('order.form.orderType')}</span>
              </div>
            </button>
            <button
              disabled
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                currentStep === 'information'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  currentStep === 'information' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-400'
                }`}>
                  2
                </span>
                <span>{t('order.form.information')}</span>
              </div>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 'cart' && (
            /* CART VIEW */
            itemCount === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  <ShoppingCart className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>{t('menu.cart.empty')}</h3>
                <p className={theme.text.secondary}>{t('menu.cart.emptyDesc')}</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => {
                  const itemAddons = item.addons || item.addonItems || [];
                  const availableAddons = getAvailableAddonsForProduct(item);
                  const isExpanded = expandedItems.has(item.basketItemId);

                  return (
                    <div key={item.basketItemId} className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold ${theme.text.primary} mb-1`}>{item.productName}</h3>
                            <p className="text-sm text-emerald-600 font-semibold mb-2">
                              {formatPrice(item.price || item.price)}
                            </p>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.basketItemId, item.quantity, -1)}
                                  disabled={updatingItemId === item.basketItemId}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold min-w-[2rem] text-center">{item.quantity}</span>
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

                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs ${theme.text.secondary}`}>{t('menu.cart.total')}</span>
                                <span className="font-bold text-emerald-600">{formatPrice(item.totalPrice)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Addons */}
                      {(itemAddons.length > 0 || availableAddons.length > 0) && (
                        <div className="border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => toggleItemExpanded(item.basketItemId)}
                            className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <span className={`text-sm font-semibold ${theme.text.primary}`}>
                              Add-ons {itemAddons.length > 0 && `(${itemAddons.length})`}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3">
                              {itemAddons.map((addon) => {
                                const addonId = addon.addonBasketItemId || addon.basketItemId;
                                const addonName = addon.addonName || addon.productName;
                                const addonPrice = addon.specialPrice || addon.price;

                                return (
                                  <div key={addonId} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                                    <div className="flex-1">
                                      <p className={`text-sm font-semibold ${theme.text.primary}`}>{addonName}</p>
                                      <p className="text-xs text-emerald-600 font-semibold">{formatPrice(addonPrice)} each</p>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1">
                                      <button
                                        onClick={() => handleUpdateAddonQuantity(addonId, addon.quantity, -1, addon.maxQuantity || 10)}
                                        disabled={updatingItemId === addonId}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="font-bold text-sm min-w-[1.5rem] text-center">{addon.quantity}</span>
                                      <button
                                        onClick={() => handleUpdateAddonQuantity(addonId, addon.quantity, 1, addon.maxQuantity || 10)}
                                        disabled={updatingItemId === addonId || addon.quantity >= (addon.maxQuantity || 10)}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <button onClick={() => handleDeleteAddon(addonId)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/20 rounded text-red-500">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}

                              {availableAddons.length > 0 && (
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                  <p className={`text-xs font-semibold ${theme.text.secondary} mb-2`}>Available Add-ons:</p>
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
                                          <span className={`text-sm ${theme.text.primary}`}>{addon.addonName}</span>
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
                      t('menu.cart.clear')
                    )}
                  </button>
                )}
              </div>
            )
          )}

          {currentStep === 'order-type' && (
            /* ORDER TYPE SELECTION */
            <div className="p-6">
              {orderTypeError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-200">{t('common.error')}</p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{orderTypeError}</p>
                    </div>
                  </div>
                </div>
              )}

              {loadingOrderTypes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-slate-600 dark:text-slate-400`}>
                    {t('order.form.loadingOrderTypes')}
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderTypes.map((orderType) => {
                    const calculatedTotal = total + orderType.serviceCharge;
                    const isSelected = selectedOrderType?.id === orderType.id;
                    
                    return (
                      <button
                        key={orderType.id}
                        onClick={() => handleOrderTypeSelect(orderType)}
                        className={`w-full text-${isRTL ? 'right' : 'left'} p-4 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">
                            {orderType.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                  {orderType.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {orderType.description}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                              )}
                            </div>

                            <div className={`flex flex-wrap gap-2 mb-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                              {orderType.requiresName && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                  <User className="w-3 h-3" />
                                  {t('order.form.name')}
                                </span>
                              )}
                              {orderType.requiresTable && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 text-xs rounded-full">
                                  <Table className="w-3 h-3" />
                                  {t('order.form.table')}
                                </span>
                              )}
                              {orderType.requiresAddress && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                  <MapPin className="w-3 h-3" />
                                  {t('order.form.address')}
                                </span>
                              )}
                              {orderType.requiresPhone && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                  <Phone className="w-3 h-3" />
                                  {t('order.form.phone')}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-xs">
                              {orderType.minOrderAmount > 0 && (
                                <p className="text-blue-600 dark:text-blue-400">
                                  {t('order.form.minimumOrder')}: {formatPrice(orderType.minOrderAmount)}
                                </p>
                              )}
                              {orderType.serviceCharge > 0 && (
                                <p className="text-orange-600 dark:text-orange-400">
                                  {t('order.form.serviceCharge')}: +{formatPrice(orderType.serviceCharge)}
                                </p>
                              )}
                              {orderType.estimatedMinutes > 0 && (
                                <p className="text-green-600 dark:text-green-400">
                                  {t('order.form.estimatedTime')}: {orderType.estimatedMinutes} {t('order.form.minutes')}
                                </p>
                              )}
                              <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-2">
                                {t('menu.cart.total')}: {formatPrice(calculatedTotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 'information' && selectedOrderType && (
            /* INFORMATION FORM */
            <div className="p-6 space-y-6">
              {/* Selected Order Type Display */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{selectedOrderType.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">
                        {selectedOrderType.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedOrderType.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBackToOrderTypes}
                    className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                  >
                    {t('common.change')}
                  </button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-1 text-xs">
                  {selectedOrderType.minOrderAmount > 0 && (
                    <p className="text-blue-600 dark:text-blue-400">
                      {t('order.form.minimumOrder')}: {formatPrice(selectedOrderType.minOrderAmount)}
                    </p>
                  )}
                  {selectedOrderType.serviceCharge > 0 && (
                    <p className="text-orange-600 dark:text-orange-400">
                      {t('order.form.serviceCharge')}: +{formatPrice(selectedOrderType.serviceCharge)}
                    </p>
                  )}
                  {selectedOrderType.estimatedMinutes > 0 && (
                    <p className="text-green-600 dark:text-green-400">
                      {t('order.form.estimatedTime')}: {selectedOrderType.estimatedMinutes} {t('order.form.minutes')}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {selectedOrderType.requiresName && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {t('order.form.customerName')} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                        validationErrors.customerName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-orange-500'
                      } focus:outline-none focus:ring-2 transition-all`}
                      placeholder={t('order.form.customerNamePlaceholder')}
                    />
                    {validationErrors.customerName && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {validationErrors.customerName}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrderType.requiresTable && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Table className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {t('order.form.tableNumber')} *
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                        validationErrors.tableNumber
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-orange-500'
                      } focus:outline-none focus:ring-2 transition-all`}
                      placeholder={t('order.form.tableNumberPlaceholder')}
                    />
                    {validationErrors.tableNumber && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {validationErrors.tableNumber}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrderType.requiresPhone && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Phone className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {t('order.form.phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                        validationErrors.customerPhone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-orange-500'
                      } focus:outline-none focus:ring-2 transition-all`}
                      placeholder={t('order.form.phoneNumberPlaceholder')}
                    />
                    {validationErrors.customerPhone && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {validationErrors.customerPhone}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrderType.requiresAddress && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <MapPin className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {t('order.form.deliveryAddress')} *
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                      className={`w-full p-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                        validationErrors.deliveryAddress
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-orange-500'
                      } focus:outline-none focus:ring-2 transition-all resize-none`}
                      placeholder={t('order.form.deliveryAddressPlaceholder')}
                    />
                    {validationErrors.deliveryAddress && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {validationErrors.deliveryAddress}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Method Selection */}
                {availablePaymentMethods.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      {t('order.form.paymentMethod')} *
                    </label>
                    <div className="space-y-2">
                      {availablePaymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = paymentMethod === method.id;
                        
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`w-full p-4 border-2 rounded-lg transition-all text-${isRTL ? 'right' : 'left'} ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-slate-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-6 h-6 ${isSelected ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`} />
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                  {method.name}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                  {method.description}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.paymentMethod && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        {validationErrors.paymentMethod}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                  {t('order.form.orderSummary')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{t('order.form.subtotal')}:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {selectedOrderType.serviceCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t('order.form.serviceCharge')}:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        +{formatPrice(selectedOrderType.serviceCharge)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
                    <span className="text-slate-800 dark:text-slate-200">{t('menu.cart.total')}:</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      {formatPrice(total + selectedOrderType.serviceCharge)}
                    </span>
                  </div>

                  {selectedOrderType.estimatedMinutes > 0 && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2">
                      <Clock className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      <span>
                        {t('order.form.estimatedTime')}: {selectedOrderType.estimatedMinutes} {t('order.form.minutes')}
                      </span>
                    </div>
                  )}

                  {paymentMethod && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                      {paymentMethod === 'cash' && <Banknote className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />}
                      {paymentMethod === 'credit_card' && <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />}
                      {paymentMethod === 'online' && <Smartphone className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />}
                      <span>
                        {t('order.form.payment')}: {availablePaymentMethods.find(m => m.id === paymentMethod)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Different for each step */}
        {currentStep === 'cart' && itemCount > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={theme.text.secondary}>{t('order.form.subtotal')}</span>
                <span className={theme.text.primary}>{formatPrice(subtotal)}</span>
              </div>
              {tax > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className={theme.text.secondary}>Tax:</span>
                  <span className={theme.text.primary}>{formatPrice(tax)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className={theme.text.primary}>{t('menu.cart.total')}</span>
                <span className="text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-slate-600 to-slate-600 hover:from-emerald-700 hover:to-slate-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('menu.cart.placeOrder')}
            </button>
          </div>
        )}

        {currentStep === 'information' && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-6">
            <div className="flex space-x-3">
              <button
                onClick={handleBackToOrderTypes}
                className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <BackIcon className={`h-4 w-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('priceChange.cancel')}
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={submittingOrder}
                className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingOrder ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                    {t('menu.cart.processing')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {t('order.form.createOrder')}
                    <ForwardIcon className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-[60] space-y-2 max-w-md`}>
        {toasts.map(toast => (
          <ToastComponent 
            key={toast.id} 
            toast={toast} 
            onClose={removeToast} 
          />
        ))}
      </div>

      <WhatsAppConfirmationModal
        isVisible={showWhatsAppConfirmation}
        restaurantName={restaurantName}
        onConfirm={handleWhatsAppConfirm}
        onCancel={handleWhatsAppCancel}
      />
    </>
  );
};

export default OnlineCartSidebar;