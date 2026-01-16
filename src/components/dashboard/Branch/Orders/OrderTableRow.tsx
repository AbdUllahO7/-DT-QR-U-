import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  XCircle,
  Ban,
  Clock,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronDown,
  Search,
  Check
} from 'lucide-react';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { orderService } from '../../../../services/Branch/OrderService';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import { useCurrency } from '../../../../hooks/useCurrency';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { CustomSelect } from '../../../common/CustomSelect';

// --- Types ---

interface Option {
  value: any;
  label: string;
  searchTerms?: string;
}



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

  const statusOptions: Option[] = validStatuses.map((validStatus) => ({
    value: validStatus,
    label: orderService.getOrderStatusText(validStatus, lang),
  }));

  const handleStatusChange = (newStatus: string | number) => {
    onOpenStatus(order.id.toString(), rowVersion, Number(newStatus));
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
          
          {/* Custom Select for Status Changes - Fixed with Portal */}
          {statusOptions.length > 0 && (
            <div className="w-40 relative">
              <CustomSelect
                placeholder={t('ordersManager.changeStatus')}
                options={statusOptions}
                value={null}
                onChange={handleStatusChange}
                disabled={false}
              />
            </div>
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