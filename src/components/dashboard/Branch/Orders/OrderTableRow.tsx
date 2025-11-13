import React from 'react';
import { Eye, CheckCircle, XCircle, Ban, Clock, Phone,Package, Zap } from 'lucide-react';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { orderService } from '../../../../services/Branch/OrderService';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { OrderStatusEnums } from '../../../../types/Orders/type';

interface OrderTableRowProps {
  order: PendingOrder | BranchOrder;
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  isExpanded: boolean;
  lang: string;
  onToggleExpansion: (orderId: string) => void;
  onOpenDetails: (order: PendingOrder | BranchOrder) => void;
  onOpenConfirm: (orderId: string, rowVersion: string) => void;
  onOpenReject: (orderId: string, rowVersion: string) => void;
  onOpenCancel: (orderId: string, rowVersion: string) => void;
  onOpenStatus:(orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => void;
  t: (key: string) => string;
  rowIndex: number;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  viewMode,
  lang,
  onOpenDetails,
  onOpenConfirm,
  onOpenReject,
  onOpenStatus,
  onOpenCancel, 
  t,
  rowIndex
}) => {
  const isPending = viewMode === 'pending';
  const status = isPending ? OrderStatusEnums.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
  const rowVersion = order.rowVersion || '';
  const validStatuses = OrderStatusUtils.getValidStatusTransitions(status);
  const isRTL = lang === 'ar';
  

  // Alternating row colors for better readability
  const rowBgClass = rowIndex % 2 === 0 
    ? 'bg-white dark:bg-gray-800' 
    : 'bg-gray-50 dark:bg-gray-800/50';

  // Check if order is completed or confirmed - hide confirm button
  // Don't show confirm button for Confirmed, Completed, Delivered, Cancelled, or Rejected orders
  const shouldShowConfirmButton = orderService.canModifyOrder(status) && 
    status !== OrderStatusEnums.Completed && 
    status !== OrderStatusEnums.Confirmed &&
    status !== OrderStatusEnums.Delivered &&
    status !== OrderStatusEnums.Cancelled &&
    status !== OrderStatusEnums.Rejected;

  return (
    <tr className={`${rowBgClass} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-b border-gray-100 dark:border-gray-700`}>
      
      
      {/* Order Number */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100">
            {order.orderTag}
          </span>
        </div>
      </td>
      
      {/* Status (Branch View Only) */}
      {viewMode === 'branch' && (
        <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${OrderStatusUtils.getStatusBadgeClass(status)} shadow-sm`}>
            {OrderStatusUtils.getStatusIcon(status)}
            <span>{orderService.getOrderStatusText(status, lang)}</span>
          </span>
        </td>
      )}
      
   
      {/* Amount */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="flex flex-col gap-1">
          <div className="text-lg font-black text-green-600 dark:text-green-400">
            {order.totalPrice.toFixed(2)}
          </div>
          <div className={`flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Package className="w-3 h-3" />
            <span>{(order as any).itemCount || 0} {t('ordersManager.orderItems')}</span>
          </div>
        </div>
      </td>
      
      {/* Order Type */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-2xl">{order.orderTypeIcon}</span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {order.orderTypeName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {order.orderTypeCode}
            </span>
          </div>
        </div>
      </td>
      
      {/* Time */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex flex-col">
          
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(order.createdAt).toLocaleTimeString(
                lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                { hour: '2-digit', minute: '2-digit' }
              )}
            </span>
          </div>
        </div>
      </td>
      
      {/* Actions */}
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-end'}`}>
          {/* Primary Actions - Larger Buttons */}
          <div className="flex items-center gap-2">
            {/* Confirm Button - Only show if not Completed or Confirmed */}
            {shouldShowConfirmButton && (
              <button
                onClick={() => onOpenConfirm(order.id.toString(), rowVersion)}
                className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg font-bold text-sm flex items-center gap-2"
                title={t('ordersManager.confirm')}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="hidden sm:inline">{t('ordersManager.confirm')}</span>
              </button>
            )}
            
            {/* View Details */}
            <button
              onClick={() => onOpenDetails(order)}
              className="p-2.5 text-indigo-600 hover:text-white hover:bg-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              title={t('ordersManager.viewDetails')}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex items-center gap-1 pl-2 border-l-2 border-gray-200 dark:border-gray-600">
            {/* Reject Button - Only for Pending */}
            {status === OrderStatusEnums.Pending && (
              <button
                onClick={() => onOpenReject(order.id.toString(), rowVersion)}
                className="p-2 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                title={t('ordersManager.reject')}
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            
            {/* Cancel Button */}
            {orderService.canCancelOrder(status) && (
              <button
                onClick={() => onOpenCancel(order.id.toString(), rowVersion)}
                className="p-2 text-orange-600 hover:text-white hover:bg-orange-600 dark:text-orange-400 dark:hover:bg-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                title={t('ordersManager.cancel')}
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
            
            {/* Status Change Dropdown */}
            {validStatuses.length > 0 && (
              <div className="relative group">
                <select
                  title={t('ordersManager.changeStatus')}
                  onChange={(e) => {
                    const newStatus = parseInt(e.target.value) as OrderStatusEnums;
                    if (newStatus !== status) {
                      onOpenStatus(order.id.toString(), rowVersion, newStatus);
                    }
                    e.target.value = '';
                  }}
                  className="appearance-none text-xs border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all cursor-pointer font-semibold hover:shadow-md"
                  defaultValue=""
                >
                  <option value="" disabled>
                    <Zap className="inline w-3 h-3" /> {t('ordersManager.status')}
                  </option>
                  {validStatuses
                    .filter((validStatus) => {
                      // If current status is Preparing, don't show Completed option
                      if (status === OrderStatusEnums.Preparing && validStatus === OrderStatusEnums.Completed) {
                        return false;
                      }
                      // If current status is Ready, don't show Completed option
                      if (status === OrderStatusEnums.Ready && validStatus === OrderStatusEnums.Completed) {
                        return false;
                      }
                      return true;
                    })
                    .map((validStatus) => (
                      <option key={validStatus} value={validStatus}>
                        {orderService.getOrderStatusText(validStatus, lang)}
                      </option>
                    ))}
                </select>
                <Zap className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;