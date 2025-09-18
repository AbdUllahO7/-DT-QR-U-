import React from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import OrderTableRow from './OrderTableRow';
import { BranchOrder, PendingOrder } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';

interface OrdersTableProps {
  orders: (PendingOrder | BranchOrder)[];
  viewMode: 'pending' | 'branch';
  loading: boolean;
  expandedRows: Set<string>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  hasActiveFilters: boolean;
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
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // Helper function to get the appropriate no orders message
  const getNoOrdersMessage = () => {
    if (hasActiveFilters) {
      return 'No orders match your current filters';
    }
    
    const orderTypeKey = viewMode === 'pending' 
      ? 'ordersManager.pendingOrders' 
      : 'ordersManager.branchOrders';
    
    const orderType = t(orderTypeKey).toLowerCase();

    return `No ${orderType} found`;
  };
console.log('OrdersTable received onOpenCancel:', onOpenCancel);


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {getNoOrdersMessage()}
          </p>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('ordersManager.clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => onSort('customerName')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>{t('ordersManager.customer')}</span>
                    {getSortIcon('customerName')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('ordersManager.orderNumber')}
                </th>
                {viewMode === 'branch' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('ordersManager.status')}
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('ordersManager.table')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => onSort('totalPrice')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>{t('ordersManager.amount')}</span>
                    {getSortIcon('totalPrice')}
                  </button>
                </th>
           
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('ordersManager.orderType')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    onClick={() => onSort('createdAt')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <span>{t('ordersManager.date')}</span>
                    {getSortIcon('createdAt')}
                  </button>
                </th>
                
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('ordersManager.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
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
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;