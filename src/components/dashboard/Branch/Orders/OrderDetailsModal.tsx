import React from 'react';
import { Eye, XCircle, Clock, Package, AlertCircle, MapPin, Phone, User, Truck, Home } from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { BranchOrder, Order } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';

interface OrderDetailsModalProps {
  show: boolean;
  order: Order | null;
  viewMode: 'pending' | 'branch';
  lang: string;
  onClose: () => void;
  t: (key: string) => string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  show,
  order,
  viewMode,
  lang,
  onClose,
  t
}) => {
  if (!show || !order) return null;
  
  const status = viewMode === 'branch' 
    ? orderService.parseOrderStatus((order as unknown as BranchOrder).status)
    : OrderStatusEnums.Pending;

  // Parse metadata from notes if exists
  const parseMetadata = (notes: string | null) => {
    if (!notes) return null;
    const metadataMatch = notes.match(/\[METADATA:(.*?)\]/);
    if (metadataMatch) {
      try {
        return JSON.parse(metadataMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  };

  // Get clean notes without metadata
  const getCleanNotes = (notes: string | null) => {
    if (!notes) return null;
    return notes.replace(/\[METADATA:.*?\]/, '').trim() || null;
  };

  const metadata = parseMetadata((order as any).notes);
  const cleanNotes = getCleanNotes((order as any).notes);

  const renderItems = (itemList: any[], isAddon = false, level = 0) => {
    return itemList.map((item, index) => (
      <div key={`${level}-${index}`} className={`space-y-3`}>
        <div 
          className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-sm ${
            isAddon 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 ml-6' 
              : 'bg-gray-50 dark:bg-gray-700 border-gray-400 dark:border-gray-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                {isAddon && (
                  <span className="text-blue-600 dark:text-blue-400 mr-2">↳</span>
                )}
                <h5 className={`font-semibold ${
                  isAddon 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {item.productName}
                </h5>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 mr-1">
                    {t('ordersManager.quantity')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.count || 1}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 mr-1">
                    {t('ordersManager.unitPrice')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.price?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                {item.addonPrice && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-1 ml-1">
                      {t('ordersManager.addonPrice')}
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {item.addonPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Item Notes */}
              {(item.note || item.addonNote) && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Notes:
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {item.note || item.addonNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-right ml-4">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {item.totalPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Render addon items */}
        {item.addonItems && item.addonItems.length > 0 && (
          <div className="ml-4">
            {renderItems(item.addonItems, true, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('ordersManager.orderDetailsTitle')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Type Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{(order as any).orderTypeIcon || '📦'}</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {(order as any).orderTypeName || 'Order'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(order as any).orderTypeCode}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
              {OrderStatusUtils.getStatusIcon(status)}
              <span className="ml-1">
                {orderService.getOrderStatusText(status, lang)}
              </span>
            </span>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
               {t('ordersManager.CustomerInformation')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.CustomerName')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.customerName || 'N/A'}
                  </p>
                </div>
              </div>
              {(order as any).customerPhone && (
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1"> {t('ordersManager.PhoneNumber')}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(order as any).customerPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order-Type Specific Information */}
          {((order as any).deliveryAddress || (order as any).tableName || (order as any).tableId) && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-5 border border-green-200 dark:border-green-700">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                {(order as any).deliveryAddress ? (
                  <>
                    <Truck className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                     {t('ordersManager.DeliveryInformation')}
                  </>
                ) : (
                  <>
                    <Home className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                     {t('ordersManager.TableInformation')}
                  </>
                )}
              </h4>
              <div className="space-y-3">
                {(order as any).deliveryAddress && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.DeliveryAddress')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(order as any).deliveryAddress}
                      </p>
                    </div>
                  </div>
                )}
                {(order as any).tableName && (
                  <div className="flex items-start">
                    <Home className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.table')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(order as any).tableName} {(order as any).tableId && `(ID: ${(order as any).tableId})`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.OrderTag')}</p>
              <p className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
                {order.orderTag}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.ItemCount')}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(order as any).itemCount || (order as any).items?.length || 0}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1"> {t('ordersManager.quantity')}</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(() => {
                  const items = (order as any).items;
                  if (items) {
                    let totalCount = 0;
                    const countItems = (itemList: any[]) => {
                      itemList.forEach(item => {
                        totalCount += item.count || 1;
                        if (item.addonItems && item.addonItems.length > 0) {
                          countItems(item.addonItems);
                        }
                      });
                    };
                    countItems(items);
                    return totalCount;
                  }
                  return 0;
                })()}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('ordersManager.total')}</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Notes */}
          {cleanNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    {t('ordersManager.OrderNotes')}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {cleanNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              {t('ordersManager.orderItems')}
            </h4>
            
            {(() => {
              const items = (order as any).items;
              
              if (!items || items.length === 0) {
                return (
                  <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        No items data available
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {renderItems(items)}
                  
                  {/* Pricing Breakdown */}
                  <div className="mt-6 pt-4 border-t-2 border-gray-300 dark:border-gray-600 space-y-3">
                    <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                      <span className="text-base">{t('ordersManager.subTotal')}:</span>
                      <span className="text-lg font-semibold">
                        {(order.subTotal || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {order.serviceFeeApplied !== undefined && order.serviceFeeApplied > 0 && (
                      <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                        <span className="text-base">{t('ordersManager.serviceFeeApplied')}:</span>
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          +{order.serviceFeeApplied.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {metadata?.MinOrderAmount && (
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>{t('ordersManager.MinOrderAmount')}</span>
                        <span>{parseFloat(metadata.MinOrderAmount).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {t('ordersManager.total')}:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Timestamps Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              {t('ordersManager.OrderTimeline')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t('ordersManager.createdAt')}
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {new Date(order.createdAt).toLocaleString(
                    lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </p>
              </div>
              
              {(order as any).confirmedAt && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('ordersManager.confirmedAt')}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {new Date((order as any).confirmedAt).toLocaleString(
                      lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                    )}
                  </p>
                </div>
              )}

              {(order as any).completedAt && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('ordersManager.CompletedAt')}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {new Date((order as any).completedAt).toLocaleString(
                      lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;