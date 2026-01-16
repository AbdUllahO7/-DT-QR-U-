import React from 'react';
import {
  Eye,
  XCircle,
  Ban,
  Clock,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  ChefHat,
  Bell,
  Truck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
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

// Get the next logical status in the order flow
// Flow: Pending → Confirmed → Preparing → Ready → Delivered → Completed
const getNextStatus = (currentStatus: OrderStatusEnums): OrderStatusEnums | null => {
  switch (currentStatus) {
    case OrderStatusEnums.Pending:
      return OrderStatusEnums.Confirmed;
    case OrderStatusEnums.Confirmed:
      return OrderStatusEnums.Preparing;
    case OrderStatusEnums.Preparing:
      return OrderStatusEnums.Ready;
    case OrderStatusEnums.Ready:
      return OrderStatusEnums.Delivered;
    case OrderStatusEnums.Delivered:
      return OrderStatusEnums.Completed;
    default:
      return null;
  }
};

// Get button configuration for each status transition
const getNextStatusButtonConfig = (nextStatus: OrderStatusEnums, t: (key: string) => string) => {
  switch (nextStatus) {
    case OrderStatusEnums.Confirmed:
      return {
        icon: Check,
        label: t('ordersManager.statusActions.confirm') || 'Confirm',
        bgColor: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-white',
        shadowColor: 'shadow-blue-500/30'
      };
    case OrderStatusEnums.Preparing:
      return {
        icon: ChefHat,
        label: t('ordersManager.statusActions.startPreparing') || 'Start Preparing',
        bgColor: 'bg-orange-500 hover:bg-orange-600',
        textColor: 'text-white',
        shadowColor: 'shadow-orange-500/30'
      };
    case OrderStatusEnums.Ready:
      return {
        icon: Bell,
        label: t('ordersManager.statusActions.markReady') || 'Mark Ready',
        bgColor: 'bg-purple-500 hover:bg-purple-600',
        textColor: 'text-white',
        shadowColor: 'shadow-purple-500/30'
      };
    case OrderStatusEnums.Delivered:
      return {
        icon: Truck,
        label: t('ordersManager.statusActions.markDelivered') || 'Mark Delivered',
        bgColor: 'bg-indigo-500 hover:bg-indigo-600',
        textColor: 'text-white',
        shadowColor: 'shadow-indigo-500/30'
      };
    case OrderStatusEnums.Completed:
      return {
        icon: CheckCircle2,
        label: t('ordersManager.statusActions.complete') || 'Complete',
        bgColor: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-white',
        shadowColor: 'shadow-green-500/30'
      };
    default:
      return null;
  }
};

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  viewMode,
  lang,
  onOpenDetails,
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
  const isRTL = lang === 'ar';

  // Get the next status and button config
  const nextStatus = getNextStatus(status);
  const nextButtonConfig = nextStatus ? getNextStatusButtonConfig(nextStatus, t) : null;

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
  const rowBgClass = rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50';

  const handleNextStatusClick = () => {
    if (nextStatus !== null) {
      onOpenStatus(order.id.toString(), rowVersion, nextStatus);
    }
  };

  return (
    <tr className={`${rowBgClass} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 border-b border-gray-100 dark:border-gray-700`}>

      {/* 1. Order Number */}
      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100">
            {order.orderTag}
          </span>
        </div>
      </td>

      {/* 2. Status Badge */}
      {viewMode === 'branch' && (
        <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${OrderStatusUtils.getStatusBadgeClass(status)} shadow-sm`}>
            {OrderStatusUtils.getStatusIcon(status)}
            <span>{orderService.getOrderStatusText(status, lang)}</span>
          </span>
        </td>
      )}

      {/* 3. Amount */}
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

      {/* 4. Type */}
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

      {/* 5. Payment */}
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

      {/* 6. Time */}
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

      {/* 7. Actions */}
      <td className={`px-4 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-end'}`}>

          {/* Next Status Action Button */}
          {nextButtonConfig && (
            <button
              onClick={handleNextStatusClick}
              className={`inline-flex items-center gap-1.5 px-4 py-2 ${nextButtonConfig.bgColor} ${nextButtonConfig.textColor} rounded-lg transition-all duration-200 text-xs font-semibold shadow-lg ${nextButtonConfig.shadowColor} hover:shadow-xl hover:scale-105 ${isRTL ? 'flex-row-reverse' : ''}`}
              title={nextButtonConfig.label}
            >
              <nextButtonConfig.icon className="w-4 h-4" />
              <span>{nextButtonConfig.label}</span>
              <ArrowRight className={`w-3 h-3 opacity-70 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* View Details */}
          <button
            onClick={() => onOpenDetails(order)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors text-xs font-medium"
            title={t('ordersManager.viewDetails')}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{t('ordersManager.viewDetails')}</span>
          </button>

          {/* Reject (Pending Only) */}
          {status === OrderStatusEnums.Pending && (
            <button
              onClick={() => onOpenReject(order.id.toString(), rowVersion)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors text-xs font-medium"
              title={t('ordersManager.reject')}
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('ordersManager.reject')}</span>
            </button>
          )}

          {/* Cancel */}
          {orderService.canCancelOrder(status) && (
            <button
              onClick={() => onOpenCancel(order.id.toString(), rowVersion)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20 rounded-lg transition-colors text-xs font-medium"
              title={t('ordersManager.cancelOrder')}
            >
              <Ban className="w-4 h-4" />
              <span className="hidden sm:inline">{t('ordersManager.cancelOrder')}</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
