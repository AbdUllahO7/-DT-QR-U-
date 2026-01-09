import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Phone,
  Clock,
  Loader2,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronDown,
  Search,
  Check
} from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { OrderFormProps } from '../../../../../types/menu/carSideBarTypes';

// --- Types ---

interface ExtendedOrderFormProps extends OrderFormProps {
  paymentPreferences?: {
    acceptCash: boolean;
    acceptCreditCard: boolean;
    acceptOnlinePayment: boolean;
  };
}

interface Option {
  value: any;
  label: string;
  searchTerms?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

// --- Custom Select Component (Fixed Positioning Strategy) ---

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  searchable = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isRTL } = useLanguage();

  // Calculate position relative to the VIEWPORT (Fixed)
  const updatePosition = () => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 250; // Approx max height

      // Decide whether to open up or down
      const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setPosition({
        top: showAbove ? rect.top - dropdownHeight - 5 : rect.bottom + 5,
        left: rect.left,
        width: rect.width
      });
    }
  };

  // Handle Scroll/Resize to update position
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking inside the button, don't close (toggle logic handles it)
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.searchTerms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(updatePosition, 0); 
          }
        }}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-orange-400 cursor-pointer'
        } ${isOpen ? 'ring-2 ring-orange-500/20 border-orange-500' : ''}`}
      >
        <span className={`block truncate text-sm ${!selectedOption ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* PORTAL TO BODY with FIXED POSITION */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999]" style={{ zIndex: 99999 }}>
          {/* Invisible Backdrop to close on click outside (fallback) */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: '250px',
              }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {searchable && (
                <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/95 backdrop-blur-sm">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400`} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className={`w-full ${isRTL ? 'pr-8 pl-2' : 'pl-8 pr-2'} py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-colors ${
                        value === option.value
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="font-medium text-sm truncate">{option.label}</span>
                      {value === option.value && (
                        <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
};

// --- Main Component ---

const OrderFormComponent: React.FC<ExtendedOrderFormProps> = ({
  orderForm,
  setOrderForm,
  orderTypes,
  loadingOrderTypes,
  orderTotal,
  estimatedTime,
  totalPrice,
  loading,
  onBack,
  onCreate,
  paymentPreferences,
}) => {
  const { t } = useLanguage();

  const getSelectedOrderType = () => {
    return orderTypes.find((ot) => ot.id === orderForm.orderTypeId);
  };

  const selectedOrderType = getSelectedOrderType();

  // Translation helper for order type name and description
  const getOrderTypeTranslation = (orderType: any, field: 'name' | 'description'): string => {
    if (!orderType) return '';
    const translationKey = `orderTypes.${orderType.code}.${field}`;
    const translated = t(translationKey);
    if (translated && translated !== translationKey) {
      return translated;
    }
    return field === 'name' ? orderType.name : orderType.description;
  };

  // Get available payment methods
  const getAvailablePaymentMethods = () => {
    const methods = [];
    if (paymentPreferences?.acceptCash) {
      methods.push({ value: 'cash', label: t('order.form.cash'), icon: Banknote });
    }
    if (paymentPreferences?.acceptCreditCard) {
      methods.push({ value: 'creditCard', label: t('order.form.creditCard'), icon: CreditCard });
    }
    if (paymentPreferences?.acceptOnlinePayment) {
      methods.push({ value: 'onlinePayment', label: t('order.form.onlinePayment'), icon: Smartphone });
    }
    return methods;
  };

  const availablePaymentMethods = getAvailablePaymentMethods();

  // Convert orderTypes to options for CustomSelect
  const orderTypeOptions: Option[] = orderTypes.map(type => {
    let label = getOrderTypeTranslation(type, 'name');
    const extras: string[] = [];
    
    if (type.serviceCharge > 0) {
      extras.push(`+${t('order.form.service')} $${type.serviceCharge.toFixed(2)}`);
    }
    if (type.minOrderAmount > 0) {
      extras.push(`${t('order.form.minimumOrder')}: $${type.minOrderAmount.toFixed(2)}`);
    }
    
    if (extras.length > 0) {
      label += ` (${extras.join(' - ')})`;
    }
    
    return {
      value: type.id,
      label: label
    };
  });

  if (loadingOrderTypes) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">
          {t('order.form.loadingOrderTypes')}
        </span>
      </div>
    );
  }

  const minOrderAmount = selectedOrderType?.minOrderAmount || 0;
  const isBelowMinimumOrder = minOrderAmount > 0 && totalPrice < minOrderAmount;

  const isMissingRequiredFields = () => {
    if (!selectedOrderType) return true;

    if (selectedOrderType.requiresName && !orderForm.customerName?.trim()) {
      return true;
    }
    if (selectedOrderType.requiresAddress && !orderForm.deliveryAddress?.trim()) {
      return true;
    }
    if (selectedOrderType.requiresPhone && !orderForm.customerPhone?.trim()) {
      return true;
    }
    
    if (availablePaymentMethods.length > 0 && !orderForm.paymentMethod) {
      return true;
    }
    
    return false;
  };

  const isButtonDisabled =
    loading ||
    orderTypes.length === 0 ||
    !orderForm.orderTypeId ||
    isBelowMinimumOrder ||
    isMissingRequiredFields();

  return (
    <div className="space-y-6">
      {/* Order Type Selection - Using CustomSelect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('order.form.orderType')} *
        </label>
        
        <CustomSelect
          placeholder={t('order.form.selectOrderType')}
          options={orderTypeOptions}
          value={orderForm.orderTypeId || null}
          onChange={(value) => setOrderForm((prev) => ({ ...prev, orderTypeId: value }))}
          disabled={orderTypes.length === 0}
        />
        
        {/* Order Type Details */}
        {selectedOrderType && (
          <div className="mt-3 text-xs space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              {getOrderTypeTranslation(selectedOrderType, 'description')}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {selectedOrderType.minOrderAmount > 0 && (
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {t('order.form.minimumOrder')}: $
                  {selectedOrderType.minOrderAmount.toFixed(2)}
                </p>
              )}

              {selectedOrderType.serviceCharge > 0 && (
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  {t('order.form.serviceCharge')}: +$
                  {selectedOrderType.serviceCharge.toFixed(2)}
                </p>
              )}

              {selectedOrderType.estimatedMinutes && (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {t('order.form.estimatedTime')}: {selectedOrderType.estimatedMinutes}{' '}
                  {t('order.form.minutes')}
                </p>
              )}
            </div>
          </div>
        )}
        
        {orderTypes.length === 0 && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {t('order.form.noOrderTypes')}
          </p>
        )}
      </div>

      {/* Payment Method Selection */}
      {availablePaymentMethods.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('order.form.paymentMethod')} *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {availablePaymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = orderForm.paymentMethod === method.value;

              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() =>
                    setOrderForm((prev) => ({ ...prev, paymentMethod: method.value }))
                  }
                  className={`
                    flex items-center p-4 border-2 rounded-lg transition-all
                    ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-slate-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 ${
                      isSelected ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isSelected
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {method.label}
                  </span>
                  {isSelected && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {!orderForm.paymentMethod && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {t('order.form.selectPaymentMethod')}
            </p>
          )}
        </div>
      )}

      {/* Conditional Fields Based on Order Type */}

      {/* Customer Name */}
      {selectedOrderType?.requiresName && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            {t('order.form.customerName')} *
          </label>
          <input
            type="text"
            value={orderForm.customerName || ''}
            onChange={(e) =>
              setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))
            }
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder={t('order.form.customerNamePlaceholder')}
            required
          />
          {!orderForm.customerName?.trim() && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {t('order.form.customerNameRequired') || 'Customer name is required'}
            </p>
          )}
        </div>
      )}

      {/* Delivery Address */}
      {selectedOrderType?.requiresAddress && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            {t('order.form.deliveryAddress')} *
          </label>
          <textarea
            value={orderForm.deliveryAddress || ''}
            onChange={(e) =>
              setOrderForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))
            }
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder={t('order.form.deliveryAddressPlaceholder')}
            rows={3}
            required
          />
          {!orderForm.deliveryAddress?.trim() && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {t('order.form.deliveryAddressRequired') || 'Delivery address is required'}
            </p>
          )}
        </div>
      )}

      {/* Phone Number */}
      {selectedOrderType?.requiresPhone && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            {t('order.form.phoneNumber')} *
          </label>
          <input
            type="tel"
            value={orderForm.customerPhone || ''}
            onChange={(e) =>
              setOrderForm((prev) => ({ ...prev, customerPhone: e.target.value }))
            }
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder={t('order.form.phoneNumberPlaceholder')}
            required
          />
          {!orderForm.customerPhone?.trim() && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {t('order.form.phoneNumberRequired') || 'Phone number is required'}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('order.form.specialInstructions')}
        </label>
        <textarea
          value={orderForm.notes || ''}
          onChange={(e) =>
            setOrderForm((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          placeholder={t('order.form.specialInstructionsPlaceholder')}
          rows={3}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
          {t('order.form.orderSummary')}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {t('order.form.subtotal')}:
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {totalPrice.toFixed(2)}
            </span>
          </div>

          {orderTotal.serviceCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {t('order.form.serviceCharge')}:
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                +{orderTotal.serviceCharge.toFixed(2)}
              </span>
            </div>
          )}

          {isBelowMinimumOrder && (
            <div className="flex justify-between text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded">
              <span className="text-sm">{t('order.form.minimumRequired')}:</span>
              <span className="text-sm font-medium">
                ${minOrderAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
            <span className="text-slate-800 dark:text-slate-200">
              {t('menu.cart.total')}:
            </span>
            <span
              className={`${
                isBelowMinimumOrder
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              ${orderTotal.totalAmount.toFixed(2)}
            </span>
          </div>

          {estimatedTime > 0 && (
            <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2 text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>
                {t('order.form.estimatedTime')}: {estimatedTime} {t('order.form.minutes')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {isMissingRequiredFields() && orderForm.orderTypeId > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-pulse" />
            {t('order.form.pleaseFillRequiredFields') || 'Please fill in all required fields'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 space-x-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          {t('order.form.backToCart')}
        </button>
        <button
          onClick={onCreate}
          disabled={isButtonDisabled}
          className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('order.form.creating')}
            </div>
          ) : (
            t('order.form.createOrder')
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderFormComponent;