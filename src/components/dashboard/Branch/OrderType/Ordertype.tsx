import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Loader2, Clock, DollarSign,  Users } from 'lucide-react';
import { OrderType, orderTypeService, UpdateOrderTypeSettingsDto } from '../../../../services/Branch/BranchOrderTypeService';
import { useLanguage } from '../../../../contexts/LanguageContext';

const OrderTypeComponent = () => {
  const { t, isRTL } = useLanguage();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  

  // Fetch order types on component mount
  useEffect(() => {
    fetchOrderTypes();
  }, []);

  const fetchOrderTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderTypeService.getOrderTypes();
      setOrderTypes(data);
    } catch (err: any) {
      setError(err.message || t('dashboard.orderType.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (orderType: OrderType, newSettings: Partial<UpdateOrderTypeSettingsDto>) => {
    try {
      setUpdating(prev => ({ ...prev, [orderType.id]: true }));
      setError(null);
      setSuccessMessage('');

      if (
        typeof newSettings.isActive !== 'boolean' ||
        typeof newSettings.minOrderAmount !== 'number' ||
        typeof newSettings.serviceCharge !== 'number'
      ) {
        throw new Error(t('dashboard.orderType.invalidSettings'));
      }

      const updateData: UpdateOrderTypeSettingsDto = {
        id: orderType.id,
        isActive: newSettings.isActive,
        minOrderAmount: newSettings.minOrderAmount,
        serviceCharge: newSettings.serviceCharge,
        rowVersion: orderType.rowVersion // Use the current rowVersion from the orderType
      };


      const updatedOrderType = await orderTypeService.updateOrderTypeSettings(orderType.id, updateData);
      

      // Check if we got a valid response
      if (!updatedOrderType) {
        console.error('No response from service');
        throw new Error('Invalid response from server');
      }

      // If the response doesn't have all required fields, refetch the data
      if (!updatedOrderType.rowVersion || !updatedOrderType.name) {
        await fetchOrderTypes();
        setSuccessMessage(` ${t('dashboard.orderType.settingsUpdated')}`);
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
      }

      // FIXED: Properly update the local state with the new rowVersion and other updated fields
      setOrderTypes(prev => 
        prev.map(ot => 
          ot.id === orderType.id 
            ? { 
                ...ot, 
                isActive: updatedOrderType.isActive ?? newSettings.isActive,
                minOrderAmount: updatedOrderType.minOrderAmount ?? newSettings.minOrderAmount,
                serviceCharge: updatedOrderType.serviceCharge ?? newSettings.serviceCharge,
                rowVersion: updatedOrderType.rowVersion ?? ot.rowVersion, // Critical: Update the rowVersion
                updatedAt: updatedOrderType.updatedAt ?? new Date().toISOString() // Also update timestamp
              }
            : ot
        )
      );

      setSuccessMessage(` ${t('dashboard.orderType.settingsUpdated')}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Update settings error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || t('dashboard.orderType.updateError'));
    } finally {
      setUpdating(prev => ({ ...prev, [orderType.id]: false }));
    }
  };

  const handleSettingChange = (orderTypeId: number, field: keyof OrderType, value: any) => {
    setOrderTypes(prev =>
      prev.map(ot =>
        ot.id === orderTypeId
          ? { ...ot, [field]: value }
          : ot
      )
    );
  };

  const handleSave = (orderType: OrderType) => {
    const newSettings = {
      isActive: orderType.isActive,
      minOrderAmount: orderType.minOrderAmount,
      serviceCharge: orderType.serviceCharge
    };
    updateSettings(orderType, newSettings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            {t('dashboard.orderType.loading')}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {t('dashboard.orderType.pleaseWait')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className={`flex items-center gap-4 mb-4 `}>
            <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {t('dashboard.orderType.title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {t('dashboard.orderType.subtitle')}
                </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top-1 duration-300">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-800 dark:text-emerald-200 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 shadow-sm animate-in slide-in-from-top-1 duration-300">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
          </div>
        )}

        {/* Order Types Grid */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-2 mb-12">
          {orderTypes.map((orderType) => (
            <div
              key={orderType.id}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                orderType.isActive 
                  ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-emerald-100 dark:shadow-emerald-900/20' 
                  : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
              }`}
            >
              {/* Status Indicator */}
              <div className={`absolute top-0 left-0 w-full h-1 ${
                orderType.isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              }`} />

              <div className="p-8">
                {/* Header */}
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-4 rounded-2xl text-3xl ${
                      orderType.isActive 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    } transition-colors duration-300`}>
                      {orderType.icon}
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {orderType.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{orderType.description}</p>
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ~{orderType.estimatedMinutes} {t('dashboard.orderType.minutes')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Orders Badge */}
                  {orderType.activeOrderCount > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="w-4 h-4" />
                      {orderType.activeOrderCount} {t('dashboard.orderType.active')}
                    </div>
                  )}
                </div>

                {/* Settings Form */}
                <div className="space-y-6">
                  {/* Active Toggle */}
                  <div className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('dashboard.orderType.activeStatus')}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('dashboard.orderType.activeStatusDescription')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        title={t('dashboard.orderType.activeStatus')}
                        type="checkbox"
                        checked={orderType.isActive}
                        onChange={(e) => handleSettingChange(orderType.id, 'isActive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  {/* Min Order Amount */}
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ${isRTL ? '' : ''}`}>
                      <DollarSign className="w-4 h-4" />
                      {t('dashboard.orderType.minOrderAmount')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={orderType.minOrderAmount}
                        onChange={(e) => handleSettingChange(orderType.id, 'minOrderAmount', parseFloat(e.target.value) || 0)}
                        className={`w-full px-4 py-3 ${isRTL ? 'pr-10 text-right' : 'pl-10'} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm`}
                        placeholder="0.00"
                      />
                      <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400`}>₺</span>
                    </div>
                  </div>

                  {/* Service Charge */}
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ${isRTL ? '' : ''}`}>
                      <DollarSign className="w-4 h-4" />
                      {t('dashboard.orderType.serviceCharge')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={orderType.serviceCharge}
                        onChange={(e) => handleSettingChange(orderType.id, 'serviceCharge', parseFloat(e.target.value) || 0)}
                        className={`w-full px-4 py-3 ${isRTL ? 'pr-10 text-right' : 'pl-10'} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm`}
                        placeholder="0.00"
                      />
                      <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400`}>₺</span>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleSave(orderType)}
                    disabled={updating[orderType.id]}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      updating[orderType.id]
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed scale-95'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {updating[orderType.id] ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('dashboard.orderType.updating')}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {t('dashboard.orderType.saveSettings')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {orderTypes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`flex items-center justify-between `}>
                <div>
                  <div className="text-3xl font-bold">{orderTypes.length}</div>
                  <div className="text-blue-100 font-medium">{t('dashboard.orderType.totalOrderTypes')}</div>
                </div>
                <Settings className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`flex items-center justify-between `}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-3xl font-bold">
                    {orderTypes.filter(ot => ot.isActive).length}
                  </div>
                  <div className="text-emerald-100 font-medium">{t('dashboard.orderType.activeTypes')}</div>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`flex items-center justify-between `}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="text-3xl font-bold">
                    {orderTypes.reduce((sum, ot) => sum + ot.activeOrderCount, 0)}
                  </div>
                  <div className="text-orange-100 font-medium">{t('dashboard.orderType.totalActiveOrders')}</div>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTypeComponent;