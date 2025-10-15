import React from 'react';
import { User, MapPin, Phone, Clock, Loader2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { OrderFormProps } from '../../../../../types/menu/carSideBarTypes';

// Add payment preferences to the props interface
interface ExtendedOrderFormProps extends OrderFormProps {
  paymentPreferences?: {
    acceptCash: boolean;
    acceptCreditCard: boolean;
    acceptOnlinePayment: boolean;
  };
}

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
  
  const selectedOrderType = getSelectedOrderType();
  const minOrderAmount = selectedOrderType?.minOrderAmount || 0;
  const isBelowMinimumOrder = minOrderAmount > 0 && totalPrice < minOrderAmount;
  const isButtonDisabled = 
    loading ||
    orderTypes.length === 0 ||
    !orderForm.orderTypeId ||
    isBelowMinimumOrder ||
    (availablePaymentMethods.length > 0 && !orderForm.paymentMethod); // Add payment method validation

  return (
    <div className="space-y-6">
      {/* Order Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('order.form.orderType')} *
        </label>
        <select
          title={t('order.form.selectOrderType')}
          value={orderForm.orderTypeId}
          onChange={(e) =>
            setOrderForm((prev) => ({ ...prev, orderTypeId: parseInt(e.target.value) }))
          }
          className="w-full text-sm p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          disabled={orderTypes.length === 0}
        >
          <option value={0}>{t('order.form.selectOrderType')}</option>
          {orderTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}{' '}
              {type.serviceCharge > 0 &&
                `(+${t('order.form.service')} $${type.serviceCharge.toFixed(2)})`}
              {type.minOrderAmount > 0 &&
                ` - ${t('order.form.minimumOrder')}: $${type.minOrderAmount.toFixed(2)}`}
            </option>
          ))}
        </select>
        {getSelectedOrderType() && (
          <div className="mt-2 text-xs space-y-1">
            <p className="text-slate-500 dark:text-slate-400">
              {getSelectedOrderType()?.description}
            </p>

            {getSelectedOrderType()?.minOrderAmount && (
              <p className="text-blue-600 dark:text-blue-400">
                {t('order.form.minimumOrder')}: $
                {getSelectedOrderType()?.minOrderAmount.toFixed(2)}
              </p>
            )}

            {(getSelectedOrderType()?.serviceCharge ?? 0) > 0 && (
              <p className="text-orange-600 dark:text-orange-400">
                {t('order.form.serviceCharge')}: +$
                {(getSelectedOrderType()?.serviceCharge ?? 0).toFixed(2)}
              </p>
            )}

            {getSelectedOrderType()?.estimatedMinutes && (
              <p className="text-green-600 dark:text-green-400">
                {t('order.form.estimatedTime')}: {getSelectedOrderType()?.estimatedMinutes}{' '}
                {t('order.form.minutes')}
              </p>
            )}
          </div>
        )}
        {orderTypes.length === 0 && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {t('order.form.noOrderTypes')}
          </p>
        )}
      </div>

      {/* Payment Method Selection - Only show if there are available methods */}
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
                    ${isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className={`font-medium ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
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

      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <User className="h-4 w-4 inline mr-1" />
          {t('order.form.customerName')} *
        </label>
        <input
          type="text"
          value={orderForm.customerName}
          onChange={(e) =>
            setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))
          }
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          placeholder={t('order.form.customerNamePlaceholder')}
        />
      </div>

      {/* Conditional Fields Based on Order Type */}
      {getSelectedOrderType()?.requiresAddress && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            {t('order.form.deliveryAddress')} *
          </label>
          <textarea
            value={orderForm.deliveryAddress}
            onChange={(e) =>
              setOrderForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))
            }
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            placeholder={t('order.form.deliveryAddressPlaceholder')}
            rows={3}
          />
        </div>
      )}

      {getSelectedOrderType()?.requiresPhone && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            {t('order.form.phoneNumber')} *
          </label>
          <input
            type="tel"
            value={orderForm.customerPhone}
            onChange={(e) =>
              setOrderForm((prev) => ({ ...prev, customerPhone: e.target.value }))
            }
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            placeholder={t('order.form.phoneNumberPlaceholder')}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('order.form.specialInstructions')}
        </label>
        <textarea
          value={orderForm.notes}
          onChange={(e) =>
            setOrderForm((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          placeholder={t('order.form.specialInstructionsPlaceholder')}
          rows={3}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
          {t('order.form.orderSummary')}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {t('order.form.subtotal')}:
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {orderTotal.serviceCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {t('order.form.serviceCharge')}:
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                +${orderTotal.serviceCharge.toFixed(2)}
              </span>
            </div>
          )}

          {/* Show minimum order warning if applicable */}
          {getSelectedOrderType()?.minOrderAmount &&
            totalPrice < getSelectedOrderType()!.minOrderAmount && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span className="text-sm">{t('order.form.minimumRequired')}:</span>
                <span className="text-sm font-medium">
                  ${getSelectedOrderType()!.minOrderAmount.toFixed(2)}
                </span>
              </div>
            )}

          <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
            <span className="text-slate-800 dark:text-slate-200">
              {t('menu.cart.total')}:
            </span>
            <span
              className={`${
                getSelectedOrderType()?.minOrderAmount &&
                totalPrice < getSelectedOrderType()!.minOrderAmount
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              ${orderTotal.totalAmount.toFixed(2)}
            </span>
          </div>

          {estimatedTime > 0 && (
            <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {t('order.form.estimatedTime')}: {estimatedTime} {t('order.form.minutes')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 ml-2 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {t('order.form.backToCart')}
        </button>
        <button
          onClick={onCreate}
          disabled={isButtonDisabled}
          className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
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