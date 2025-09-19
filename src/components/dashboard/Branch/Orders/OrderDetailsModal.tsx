import React from 'react';
import { Eye, XCircle, Clock, Package, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Eye className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('ordersManager.orderDetailsTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.customer')}
              </label>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {order.customerName}
              </p>
              {(order as any).customerPhone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(order as any).customerPhone}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.orderNumber')}
              </label>
              <p className="text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {order.orderTag}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.status')}
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
                {OrderStatusUtils.getStatusIcon(status)}
                <span className="ml-1">
                  {orderService.getOrderStatusText(status, lang)}
                </span>
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.ItemCount')}
              </label>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(order as any).itemCount || (order as any).items?.length || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.TotalItems')}
              </label>
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
                  return 'N/A';
                })()}
              </p>
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('ordersManager.amountLabel')}
              </label>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

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
                      <div>
                        <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                          No items data available
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4 max-h-84 overflow-y-auto">
                  {renderItems(items)}
                  
                  {/* Order Total */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                     <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {t('ordersManager.serviceFeeApplied')}:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {order.serviceFeeApplied?.toFixed(2)}
                      </span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {t('ordersManager.subTotal')}:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {order.subTotal?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
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
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('ordersManager.createdAt')}
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                  {new Date(order.createdAt).toLocaleString(
                    lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </p>
              </div>
              
              {(() => {
                const confirmedAt = (order as any).confirmedAt;
                if (confirmedAt) {
                  return (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('ordersManager.confirmedAt')}
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {new Date(confirmedAt).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {(() => {
                const completedAt = (order as any).completedAt;
                if (completedAt) {
                  return (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Completed At
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {new Date(completedAt).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;