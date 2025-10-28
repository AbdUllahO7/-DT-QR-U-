import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, User, MapPin, Phone, Table, ShoppingBag, AlertCircle, ChevronRight } from 'lucide-react';
import { OrderType, orderTypeService } from '../../../../services/Branch/BranchOrderTypeService';
import { theme } from '../../../../types/BranchManagement/type';

interface CheckoutOrderTypeProps {
  isOpen: boolean;
  onClose: () => void;
  basketTotal: number;
  currency?: string;
  onSubmit: (orderData: CheckoutOrderData) => void;
}

export interface CheckoutOrderData {
  orderTypeId: number;
  customerName?: string;
  tableNumber?: string;
  deliveryAddress?: string;
  phoneNumber?: string;
}

const CheckoutOrderType: React.FC<CheckoutOrderTypeProps> = ({
  isOpen,
  onClose,
  basketTotal,
  currency = 'TRY',
  onSubmit
}) => {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form data
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchOrderTypes();
    }
  }, [isOpen]);

  const fetchOrderTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const types = await orderTypeService.getOrderTypesBySessionId();
      
      // Filter only active order types that meet minimum order amount
      const availableTypes = types.filter(
        type => type.isActive && basketTotal >= type.minOrderAmount
      );
      
      if (availableTypes.length === 0) {
        setError('No available order types for your current order amount.');
      }
      
      setOrderTypes(availableTypes);
    } catch (err: any) {
      setError(err.message || 'Failed to load order types');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleOrderTypeSelect = (orderType: OrderType) => {
    setSelectedOrderType(orderType);
    setValidationErrors({});
    
    // Clear fields that are not required for this order type
    if (!orderType.requiresName) setCustomerName('');
    if (!orderType.requiresTable) setTableNumber('');
    if (!orderType.requiresAddress) setDeliveryAddress('');
    if (!orderType.requiresPhone) setPhoneNumber('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedOrderType) {
      setError('Please select an order type');
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
      if (!phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^\+?[\d\s\-()]+$/.test(phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData: CheckoutOrderData = {
        orderTypeId: selectedOrderType!.id,
        ...(selectedOrderType!.requiresName && { customerName: customerName.trim() }),
        ...(selectedOrderType!.requiresTable && { tableNumber: tableNumber.trim() }),
        ...(selectedOrderType!.requiresAddress && { deliveryAddress: deliveryAddress.trim() }),
        ...(selectedOrderType!.requiresPhone && { phoneNumber: phoneNumber.trim() }),
      };

      await onSubmit(orderData);
    } catch (err: any) {
      setError(err.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
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

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Complete Your Order</h2>
                    <p className="text-emerald-100 text-sm">Select order type and provide required information</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                  <p className={theme.text.secondary}>Loading order types...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={fetchOrderTypes}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Types Selection */}
                  <div>
                    <h3 className={`text-lg font-bold ${theme.text.primary} mb-4`}>
                      Select Order Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orderTypes.map((orderType) => {
                        const isSelected = selectedOrderType?.id === orderType.id;
                        const calculatedTotal = basketTotal + orderType.serviceCharge;

                        return (
                          <button
                            key={orderType.id}
                            onClick={() => handleOrderTypeSelect(orderType)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-lg scale-105'
                                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md'
                            }`}
                          >
                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 p-1 bg-emerald-500 rounded-full">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            )}

                            <div className="flex items-start gap-3">
                              <div className={`p-3 rounded-lg text-2xl ${
                                isSelected 
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                                  : 'bg-slate-100 dark:bg-slate-700'
                              }`}>
                                {orderType.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold ${theme.text.primary} mb-1`}>
                                  {orderType.name}
                                </h4>
                                <p className={`text-sm ${theme.text.secondary} mb-2`}>
                                  {orderType.description}
                                </p>
                                
                                {/* Requirements badges */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {orderType.requiresName && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                      <User className="w-3 h-3" />
                                      Name
                                    </span>
                                  )}
                                  {orderType.requiresTable && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                      <Table className="w-3 h-3" />
                                      Table
                                    </span>
                                  )}
                                  {orderType.requiresAddress && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                      <MapPin className="w-3 h-3" />
                                      Address
                                    </span>
                                  )}
                                  {orderType.requiresPhone && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                                      <Phone className="w-3 h-3" />
                                      Phone
                                    </span>
                                  )}
                                </div>

                                {/* Pricing */}
                                <div className="space-y-1">
                                  {orderType.serviceCharge > 0 && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                      Service Charge: {formatPrice(orderType.serviceCharge)}
                                    </p>
                                  )}
                                  <p className="text-sm font-bold text-emerald-600">
                                    Total: {formatPrice(calculatedTotal)}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Est. {orderType.estimatedMinutes} minutes
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Information Form */}
                  {selectedOrderType && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h3 className={`text-lg font-bold ${theme.text.primary} mb-4`}>
                        Order Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer Name */}
                        {selectedOrderType.requiresName && (
                          <div>
                            <label className={`block text-sm font-semibold ${theme.text.primary} mb-2`}>
                              <User className="w-4 h-4 inline mr-1" />
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.customerName
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 dark:border-slate-600 focus:ring-emerald-500'
                              } bg-white dark:bg-slate-800 ${theme.text.primary} focus:outline-none focus:ring-2 transition-all`}
                              placeholder="Enter your name"
                            />
                            {validationErrors.customerName && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.customerName}</p>
                            )}
                          </div>
                        )}

                        {/* Table Number */}
                        {selectedOrderType.requiresTable && (
                          <div>
                            <label className={`block text-sm font-semibold ${theme.text.primary} mb-2`}>
                              <Table className="w-4 h-4 inline mr-1" />
                              Table Number *
                            </label>
                            <input
                              type="text"
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.tableNumber
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 dark:border-slate-600 focus:ring-emerald-500'
                              } bg-white dark:bg-slate-800 ${theme.text.primary} focus:outline-none focus:ring-2 transition-all`}
                              placeholder="e.g., Table 5"
                            />
                            {validationErrors.tableNumber && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.tableNumber}</p>
                            )}
                          </div>
                        )}

                        {/* Phone Number */}
                        {selectedOrderType.requiresPhone && (
                          <div>
                            <label className={`block text-sm font-semibold ${theme.text.primary} mb-2`}>
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.phoneNumber
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 dark:border-slate-600 focus:ring-emerald-500'
                              } bg-white dark:bg-slate-800 ${theme.text.primary} focus:outline-none focus:ring-2 transition-all`}
                              placeholder="+90 555 123 4567"
                            />
                            {validationErrors.phoneNumber && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                            )}
                          </div>
                        )}

                        {/* Delivery Address */}
                        {selectedOrderType.requiresAddress && (
                          <div className="md:col-span-2">
                            <label className={`block text-sm font-semibold ${theme.text.primary} mb-2`}>
                              <MapPin className="w-4 h-4 inline mr-1" />
                              Delivery Address *
                            </label>
                            <textarea
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              rows={3}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.deliveryAddress
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-slate-300 dark:border-slate-600 focus:ring-emerald-500'
                              } bg-white dark:bg-slate-800 ${theme.text.primary} focus:outline-none focus:ring-2 transition-all resize-none`}
                              placeholder="Enter your full delivery address"
                            />
                            {validationErrors.deliveryAddress && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.deliveryAddress}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!loading && !error && selectedOrderType && (
              <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm ${theme.text.secondary}`}>Order Total</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatPrice(basketTotal + selectedOrderType.serviceCharge)}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutOrderType;
