import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Filter, Eye, CheckCircle, Clock, Package, DollarSign } from 'lucide-react';
import OrderTableRow from './OrderTableRow';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import { orderService } from '../../../../services/Branch/OrderService';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';

interface OrdersTableProps {
  orders: (PendingOrder | BranchOrder)[];
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  loading: boolean;
  expandedRows: Set<string>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  hasActiveFilters: string | boolean;
  lang: string;
  onSort: (field: string) => void;
  onToggleExpansion: (orderId: string) => void;
  onOpenDetails: (order: PendingOrder | BranchOrder) => void;
  onOpenConfirm: (orderId: string, rowVersion: string) => void;
  onOpenReject: (orderId: string, rowVersion: string) => void;
  onOpenStatus: (orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => void;
  onClearFilters: () => void;
  t: (key: string) => string;
  onOpenCancel: (orderId: string, rowVersion: string) => void;
}

// Mobile Card Component for < md breakpoint
const OrderMobileCard: React.FC<{
  order: PendingOrder | BranchOrder;
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  lang: string;
  onOpenDetails: (order: PendingOrder | BranchOrder) => void;
  onOpenConfirm: (orderId: string, rowVersion: string) => void;
  t: (key: string) => string;
  index: number;
}> = ({ order, viewMode, lang, onOpenDetails, onOpenConfirm, t, index }) => {
  const isRTL = lang === 'ar';
  const isPending = viewMode === 'pending';
  const status = isPending ? OrderStatusEnums.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
  const rowVersion = order.rowVersion || '';

  // Check if should show confirm button
  const shouldShowConfirmButton = orderService.canModifyOrder(status) &&
    status !== OrderStatusEnums.Completed &&
    status !== OrderStatusEnums.Confirmed &&
    status !== OrderStatusEnums.Delivered &&
    status !== OrderStatusEnums.Cancelled &&
    status !== OrderStatusEnums.Rejected;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Order Number */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
              {order.orderTag}
            </span>
          </div>

          {/* Status Badge - Branch view only */}
          {viewMode === 'branch' && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
              {OrderStatusUtils.getStatusIcon(status)}
              <span className="hidden sm:inline">{orderService.getOrderStatusText(status, lang)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Amount and Item Count */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('ordersManager.amount')}</p>
              <p className="text-xl font-black text-green-600 dark:text-green-400">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Package className="w-4 h-4" />
            <span>{(order as any).itemCount || 0} {t('ordersManager.orderItems')}</span>
          </div>
        </div>

        {/* Order Type and Time */}
        <div className="grid grid-cols-2 gap-3">
          {/* Order Type */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('ordersManager.orderType')}</p>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl">{order.orderTypeIcon}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                  {order.orderTypeName}
                </p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('ordersManager.time')}</p>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {new Date(order.createdAt).toLocaleTimeString(
                  lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {shouldShowConfirmButton && (
            <button
              onClick={() => onOpenConfirm(order.id.toString(), rowVersion)}
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-sm shadow-md"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{t('ordersManager.confirm')}</span>
            </button>
          )}

          <button
            onClick={() => onOpenDetails(order)}
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-sm border-2 border-indigo-200 dark:border-indigo-800"
          >
            <Eye className="w-5 h-5" />
            <span>{t('ordersManager.viewDetails')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  viewMode,
  loading,
  expandedRows,
  sortField,
  sortDirection,
  hasActiveFilters,
  lang,
  onSort,
  onToggleExpansion,
  onOpenDetails,
  onOpenConfirm,
  onOpenReject,
  onOpenStatus,
  onOpenCancel, 
  onClearFilters,
  t
}) => {
  const isRTL = lang === 'ar';

  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const getNoOrdersMessage = () => {
    if (hasActiveFilters) {
      return t('ordersManager.noMatchingOrders') || 'No orders match your current filters';
    }
    
    const orderTypeKey = viewMode === 'pending' 
      ? 'ordersManager.pendingOrders' 
      : 'ordersManager.branchOrders';
    
    const orderType = t(orderTypeKey).toLowerCase();
    return `${t('ordersManager.no')} ${orderType} ${t('ordersManager.found')}` || `No ${orderType} found`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {t('ordersManager.loadingOrders') || 'Loading orders...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Table Header with Count - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1.5 md:p-2">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base md:text-lg">
                {viewMode === 'pending' ? t('ordersManager.pendingOrders') : t('ordersManager.branchOrders')}
              </h3>
              <p className="text-blue-100 text-xs md:text-sm">
                {orders.length} {orders.length === 1 ? t('ordersManager.order') : t('ordersManager.orders')}
                {hasActiveFilters && (
                  <span className="ml-2 text-yellow-200">
                    ({t('ordersManager.filtered')})
                  </span>
                )}
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="min-h-[44px] w-full sm:w-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 font-medium text-sm backdrop-blur-sm"
            >
              {t('ordersManager.clearFilters')}
            </button>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {hasActiveFilters ? t('ordersManager.noResults') || 'No Results Found' : t('ordersManager.noOrders') || 'No Orders'}
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {getNoOrdersMessage()}
          </p>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              {t('ordersManager.clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card View - < md breakpoint */}
          <div className="md:hidden px-4 py-4 space-y-3">
            {orders.map((order, index) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                viewMode={viewMode}
                lang={lang}
                onOpenDetails={onOpenDetails}
                onOpenConfirm={onOpenConfirm}
                t={t}
                index={index}
              />
            ))}
          </div>

          {/* Desktop Table View - md+ breakpoint */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">

                  <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    {t('ordersManager.orderNumber')}
                  </th>
                  {viewMode === 'branch' && (
                    <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                      {t('ordersManager.status')}
                    </th>
                  )}

                  <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    <button
                      onClick={() => onSort('totalPrice')}
                      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} hover:text-blue-600 dark:hover:text-blue-400 transition-colors group`}
                    >
                      <span>{t('ordersManager.amount')}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('totalPrice')}
                      </div>
                    </button>
                  </th>
                  <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    {t('ordersManager.orderType')}
                  </th>
                  <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    <button
                      onClick={() => onSort('createdAt')}
                      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} hover:text-blue-600 dark:hover:text-blue-400 transition-colors group`}
                    >
                      <span>{t('ordersManager.time')}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('createdAt')}
                      </div>
                    </button>
                  </th>
                  <th className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider`}>
                    {t('ordersManager.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order, index) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onOpenCancel={onOpenCancel}
                    viewMode={viewMode}
                    isExpanded={expandedRows.has(order.id.toString())}
                    lang={lang}
                    onToggleExpansion={onToggleExpansion}
                    onOpenDetails={onOpenDetails}
                    onOpenConfirm={onOpenConfirm}
                    onOpenReject={onOpenReject}
                    onOpenStatus={onOpenStatus}
                    t={t}
                    rowIndex={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Footer with Summary - Responsive */}
      {orders.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {t('ordersManager.showing')} <span className="font-semibold text-gray-900 dark:text-gray-100">{orders.length}</span> {orders.length === 1 ? t('ordersManager.order') : t('ordersManager.orders')}
            </div>
            <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100">
              {t('ordersManager.total')}: <span className="text-green-600 dark:text-green-400 text-base md:text-lg ml-2">
                ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;