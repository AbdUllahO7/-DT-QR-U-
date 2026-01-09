import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Filter, Eye, CheckCircle, Clock, Package, XCircle, Ban, Zap } from 'lucide-react';
import OrderTableRow from './OrderTableRow';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import { orderService } from '../../../../services/Branch/OrderService';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { useCurrency } from '../../../../hooks/useCurrency';

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

// Enhanced Mobile Card Component
const OrderMobileCard: React.FC<{
  order: PendingOrder | BranchOrder;
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  lang: string;
  onOpenDetails: (order: PendingOrder | BranchOrder) => void;
  onOpenConfirm: (orderId: string, rowVersion: string) => void;
  onOpenReject: (orderId: string, rowVersion: string) => void;
  onOpenCancel: (orderId: string, rowVersion: string) => void;
  onOpenStatus: (orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => void;
  t: (key: string) => string;
}> = ({ 
  order, 
  viewMode, 
  lang, 
  onOpenDetails, 
  onOpenConfirm, 
  onOpenReject,
  onOpenCancel,
  onOpenStatus,
  t 
}) => {
  const isRTL = lang === 'ar';
  const isPending = viewMode === 'pending';
  const status = isPending ? OrderStatusEnums.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
  const rowVersion = order.rowVersion || '';
  const currency = useCurrency();
  
  // Logic for available actions
  const validStatuses = OrderStatusUtils.getValidStatusTransitions(status);
  const shouldShowConfirmButton = orderService.canModifyOrder(status) && 
    status !== OrderStatusEnums.Completed && 
    status !== OrderStatusEnums.Confirmed &&
    status !== OrderStatusEnums.Delivered &&
    status !== OrderStatusEnums.Cancelled &&
    status !== OrderStatusEnums.Rejected;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Card Header */}
      <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === OrderStatusEnums.Pending ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'}`}></div>
            <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
              {order.orderTag}
            </span>
          </div>

          {/* Status Badge */}
          {viewMode === 'branch' && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
              {OrderStatusUtils.getStatusIcon(status)}
              <span>{orderService.getOrderStatusText(status, lang)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('ordersManager.amount')}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-400">{currency.symbol}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('ordersManager.orderItems')}</span>
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {(order as any).itemCount || 0}
              </span>
            </div>
          </div>

          {/* Type */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('ordersManager.orderType')}</span>
            <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-lg">{order.orderTypeIcon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                {order.orderTypeName}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('ordersManager.time')}</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {new Date(order.createdAt).toLocaleTimeString(
                  lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700"></div>

        {/* Action Buttons Grid */}
        <div className="flex flex-col gap-3">
          {/* Primary Row: Confirm & View */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {shouldShowConfirmButton && (
              <button
                onClick={() => onOpenConfirm(order.id.toString(), rowVersion)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold text-sm shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t('ordersManager.confirm')}</span>
              </button>
            )}
            
            <button
              onClick={() => onOpenDetails(order)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>{t('ordersManager.viewDetails')}</span>
            </button>
          </div>

          {/* Secondary Actions Row */}
          {(status === OrderStatusEnums.Pending || orderService.canCancelOrder(status)) && (
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {status === OrderStatusEnums.Pending && (
                <button
                  onClick={() => onOpenReject(order.id.toString(), rowVersion)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium border border-red-200 dark:border-red-800"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t('ordersManager.reject')}</span>
                </button>
              )}

              {orderService.canCancelOrder(status) && (
                <button
                  onClick={() => onOpenCancel(order.id.toString(), rowVersion)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors text-sm font-medium border border-orange-200 dark:border-orange-800"
                >
                  <Ban className="w-4 h-4" />
                  <span>{t('ordersManager.cancel')}</span>
                </button>
              )}
            </div>
          )}

          {/* Status Change Selector */}
          {validStatuses.length > 0 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Zap className="w-4 h-4 text-blue-500" />
              </div>
              <select
                title='Change order status'
                onChange={(e) => {
                  const newStatus = parseInt(e.target.value) as OrderStatusEnums;
                  if (newStatus !== status) {
                    onOpenStatus(order.id.toString(), rowVersion, newStatus);
                  }
                  e.target.value = '';
                }}
                className={`w-full appearance-none bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg block pl-10 pr-10 py-2.5 cursor-pointer hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                defaultValue=""
              >
                <option value="" disabled>
                  {t('ordersManager.changeStatus')}
                </option>
                {validStatuses
                  .filter((validStatus) => {
                    if (status === OrderStatusEnums.Preparing && validStatus === OrderStatusEnums.Completed) return false;
                    if (status === OrderStatusEnums.Ready && validStatus === OrderStatusEnums.Completed) return false;
                    return true;
                  })
                  .map((validStatus) => (
                    <option key={validStatus} value={validStatus}>
                      {orderService.getOrderStatusText(validStatus, lang)}
                    </option>
                  ))}
              </select>
              <div className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center pointer-events-none`}>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}
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
          <div className="md:hidden px-4 py-4 space-y-4">
            {orders.map((order) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                viewMode={viewMode}
                lang={lang}
                onOpenDetails={onOpenDetails}
                onOpenConfirm={onOpenConfirm}
                onOpenReject={onOpenReject}
                onOpenCancel={onOpenCancel}
                onOpenStatus={onOpenStatus}
                t={t}
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
                    {t('ordersManager.PaymentMethod') || 'Payment'}
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