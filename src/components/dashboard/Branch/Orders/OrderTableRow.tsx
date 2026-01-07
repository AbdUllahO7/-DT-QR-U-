import React from 'react';
import { Eye, CheckCircle, XCircle, Ban, Clock, Package, ArrowRight, CheckCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { orderService } from '../../../../services/Branch/OrderService';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import { useCurrency } from '../../../../hooks/useCurrency';

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
  onOpenStatus: (orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => void;
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
  const currency = useCurrency();
  const isPending = viewMode === 'pending';
  const status = isPending ? OrderStatusEnums.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
  const rowVersion = order.rowVersion || '';
  const validStatuses = OrderStatusUtils.getValidStatusTransitions(status);
  const isRTL = lang === 'ar';

  // Get payment method icon and label
  const getPaymentMethodInfo = (paymentMethod?: number) => {
    switch (paymentMethod) {
      case 1:
        return { icon: Banknote, label: t('paymentMethod.cash') || 'Cash', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' };
      case 2:
        return { icon: CreditCard, label: t('paymentMethod.creditCard') || 'Card', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
      case 3:
        return { icon: Smartphone, label: t('paymentMethod.onlinePayment') || 'Online', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
      default:
        return null;
    }
  };

  const paymentMethodInfo = getPaymentMethodInfo(order.paymentMethod);

  // Alternating row colors for better readability
  const rowBgClass = rowIndex % 2 === 0
    ? 'bg-white dark:bg-gray-800'
    : 'bg-gray-50 dark:bg-gray-800/50';

  // Logic to determine which buttons to show
  // We filter out statuses that shouldn't appear in the quick-action flow
  const nextStepStatuses = validStatuses.filter((validStatus) => {
    if (status === OrderStatusEnums.Preparing && validStatus === OrderStatusEnums.Completed) {
      return false;
    }
    if (status === OrderStatusEnums.Ready && validStatus === OrderStatusEnums.Completed) {
      return false;
    }
    return true;
  });

  // Check if order is completed or confirmed - hide confirm button logic from original code
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
            {currency.symbol}{order.totalPrice.toFixed(2)}
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

      {/* Payment Method */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {paymentMethodInfo ? (
          <div className={`inline-flex items-center gap-1.5 ${paymentMethodInfo.bgColor} px-3 py-1.5 rounded-lg`}>
            <paymentMethodInfo.icon className={`w-3.5 h-3.5 ${paymentMethodInfo.color}`} />
            <span className={`text-xs font-semibold ${paymentMethodInfo.color}`}>
              {paymentMethodInfo.label}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
        )}
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
          
          {/* 1. Primary Flow Actions (Next Step Buttons) */}
          <div className="flex items-center gap-2">
            
            {/* A: Confirm Button (The first step) */}
            {shouldShowConfirmButton && (
              <button
                onClick={() => onOpenConfirm(order.id.toString(), rowVersion)}
                className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg font-bold text-xs flex items-center gap-2"
                title={t('ordersManager.confirm')}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{t('ordersManager.confirm')}</span>
              </button>
            )}

            {/* B: Next Step Buttons (Replaces the Select Dropdown) */}
            {/* This maps through valid next statuses and shows them as direct action buttons */}
            {nextStepStatuses.map((nextStatus) => (
              <button
                key={nextStatus}
                onClick={() => onOpenStatus(order.id.toString(), rowVersion, nextStatus)}
                className="flex items-center gap-1.5 px-3 py-2 border-2 border-blue-500/20 hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-xs font-bold shadow-sm"
                title={`${t('ordersManager.changeStatus')} -> ${orderService.getOrderStatusText(nextStatus, lang)}`}
              >
                {/* Different icon based on final status or intermediate status */}
                {nextStatus === OrderStatusEnums.Delivered || nextStatus === OrderStatusEnums.Completed ? (
                   <CheckCheck className="w-4 h-4" />
                ) : (
                   <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                )}
                <span>{orderService.getOrderStatusText(nextStatus, lang)}</span>
              </button>
            ))}

            {/* View Details (Always visible) */}
            <button
              onClick={() => onOpenDetails(order)}
              className="flex items-center justify-center w-8 h-8 text-indigo-600 hover:text-white hover:bg-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              title={t('ordersManager.viewDetails')}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Secondary/Negative Actions (Separated visually) */}
          <div className="flex items-center gap-1 pl-2 border-l-2 border-gray-100 dark:border-gray-700 ml-2">
            
            {/* Reject Button (Only for Pending) */}
            {status === OrderStatusEnums.Pending && (
              <button
                onClick={() => onOpenReject(order.id.toString(), rowVersion)}
                className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                title={t('ordersManager.reject')}
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}

            {/* Cancel Button */}
            {orderService.canCancelOrder(status) && (
              <button
                onClick={() => onOpenCancel(order.id.toString(), rowVersion)}
                className="flex items-center justify-center w-8 h-8 text-orange-600 hover:text-white hover:bg-orange-600 dark:text-orange-400 dark:hover:bg-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                title={t('ordersManager.cancel')}
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;