import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, User, MapPin, Phone, Table, ShoppingBag, AlertCircle, ChevronLeft, ArrowRight, Clock } from 'lucide-react';
import { OrderType, orderTypeService } from '../../../../services/Branch/BranchOrderTypeService';

interface CheckoutOrderTypeSidebarProps {
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
  customerPhone?: string;
}

type CheckoutStep = 'order-type' | 'information';

const CheckoutOrderTypeSidebar: React.FC<CheckoutOrderTypeSidebarProps> = ({
  isOpen,
  onClose,
  basketTotal,
  currency = 'TRY',
  onSubmit
}) => {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('order-type');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form data
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchOrderTypes();
      setCurrentStep('order-type');
      setSelectedOrderType(null);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCustomerName('');
    setTableNumber('');
    setDeliveryAddress('');
    setCustomerPhone('');
    setValidationErrors({});
  };

  const fetchOrderTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const types = await orderTypeService.getOrderTypesByOnlineSessionId();
      
      // Filter: active, meets min amount, AND does NOT require table
      const availableTypes = types.filter(
        type => 
          type.isActive && 
          basketTotal >= type.minOrderAmount && 
          !type.requiresTable  // <-- HIDE any order type that requires a table
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
    if (!orderType.requiresPhone) setCustomerPhone('');

    // Move to information step
    setCurrentStep('information');
  };

  const handleBackToOrderTypes = () => {
    setCurrentStep('order-type');
    setValidationErrors({});
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
      if (!customerPhone.trim()) {
        errors.customerPhone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-()]+$/.test(customerPhone)) {
        errors.customerPhone = 'Invalid phone number format';
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
        ...(selectedOrderType!.requiresPhone && { customerPhone: customerPhone.trim() }),
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
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
        <div className={`w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl pointer-events-auto transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2 ml-2" />
                {currentStep === 'order-type' ? 'Select Order Type' : 'Order Information'}
                {loading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step Indicator Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
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
                <span>Order Type</span>
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
                <span>Information</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-200">Error</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">
                  Loading order types...
                </span>
              </div>
            ) : currentStep === 'order-type' ? (
              /* Step 1: Order Type Selection */
              <div className="space-y-3">
                {orderTypes.map((orderType) => {
                  const calculatedTotal = basketTotal + orderType.serviceCharge;
                  const isSelected = selectedOrderType?.id === orderType.id;
                  
                  return (
                    <button
                      key={orderType.id}
                      onClick={() => handleOrderTypeSelect(orderType)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="text-3xl flex-shrink-0">
                          {orderType.icon}
                        </div>

                        {/* Content */}
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

                          {/* Requirements */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {orderType.requiresName && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                <User className="w-3 h-3" />
                                Name
                              </span>
                            )}
                            {orderType.requiresTable && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 text-xs rounded-full">
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
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                <Phone className="w-3 h-3" />
                                Phone
                              </span>
                            )}
                          </div>

                          {/* Pricing Info */}
                          <div className="space-y-1 text-xs">
                            {orderType.minOrderAmount > 0 && (
                              <p className="text-blue-600 dark:text-blue-400">
                                Minimum Order: {formatPrice(orderType.minOrderAmount)}
                              </p>
                            )}
                            {orderType.serviceCharge > 0 && (
                              <p className="text-orange-600 dark:text-orange-400">
                                Service Charge: +{formatPrice(orderType.serviceCharge)}
                              </p>
                            )}
                            {orderType.estimatedMinutes > 0 && (
                              <p className="text-green-600 dark:text-green-400">
                                Estimated Time: {orderType.estimatedMinutes} minutes
                              </p>
                            )}
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-2">
                              Total: {formatPrice(calculatedTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Step 2: Information Form */
              <div className="space-y-6">
                {/* Selected Order Type Display */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{selectedOrderType?.icon}</div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">
                          {selectedOrderType?.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedOrderType?.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleBackToOrderTypes}
                      className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                    >
                      Change
                    </button>
                  </div>
                  
                  {/* Order Type Info */}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-1 text-xs">
                    {selectedOrderType?.minOrderAmount && selectedOrderType.minOrderAmount > 0 && (
                      <p className="text-blue-600 dark:text-blue-400">
                        Minimum Order: {formatPrice(selectedOrderType.minOrderAmount)}
                      </p>
                    )}
                    {selectedOrderType?.serviceCharge && selectedOrderType.serviceCharge > 0 && (
                      <p className="text-orange-600 dark:text-orange-400">
                        Service Charge: +{formatPrice(selectedOrderType.serviceCharge)}
                      </p>
                    )}
                    {selectedOrderType?.estimatedMinutes && selectedOrderType.estimatedMinutes > 0 && (
                      <p className="text-green-600 dark:text-green-400">
                        Estimated Time: {selectedOrderType.estimatedMinutes} minutes
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Customer Name */}
                  {selectedOrderType?.requiresName && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Customer Name *
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
                        placeholder="Enter your name"
                      />
                      {validationErrors.customerName && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {validationErrors.customerName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Table Number */}
                  {selectedOrderType?.requiresTable && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Table className="h-4 w-4 inline mr-1" />
                        Table Number *
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
                        placeholder="e.g., Table 5"
                      />
                      {validationErrors.tableNumber && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {validationErrors.tableNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Phone Number */}
                  {selectedOrderType?.requiresPhone && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number *
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
                        placeholder="+90 555 123 4567"
                      />
                      {validationErrors.customerPhone && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {validationErrors.customerPhone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Delivery Address */}
                  {selectedOrderType?.requiresAddress && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Delivery Address *
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
                        placeholder="Enter your full delivery address"
                      />
                      {validationErrors.deliveryAddress && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          {validationErrors.deliveryAddress}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {formatPrice(basketTotal)}
                      </span>
                    </div>

                    {selectedOrderType && selectedOrderType.serviceCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Service Charge:</span>
                        <span className="text-slate-800 dark:text-slate-200">
                          +{formatPrice(selectedOrderType.serviceCharge)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
                      <span className="text-slate-800 dark:text-slate-200">Total:</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {formatPrice(basketTotal + (selectedOrderType?.serviceCharge || 0))}
                      </span>
                    </div>

                    {selectedOrderType && selectedOrderType.estimatedMinutes > 0 && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Estimated Time: {selectedOrderType.estimatedMinutes} minutes
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleBackToOrderTypes}
                    className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 inline mr-1" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Place Order
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
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

export default CheckoutOrderTypeSidebar;