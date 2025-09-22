import React from 'react';
import { ChevronDown, ChevronUp, Eye, CheckCircle, XCircle, Ban } from 'lucide-react';
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
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  viewMode,
  isExpanded,
  lang,
  onToggleExpansion,
  onOpenDetails,
  onOpenConfirm,
  onOpenReject,
  onOpenStatus,
  onOpenCancel, 
  t
}) => {
  const isPending = viewMode === 'pending';
  const status = isPending ? OrderStatusEnums.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
  const rowVersion = order.rowVersion || '';
  const validStatuses = OrderStatusUtils.getValidStatusTransitions(status);


  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button
            onClick={() => onToggleExpansion(order.id.toString())}
            className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <div>
            <div className="text-sm font-medium  text-gray-900 dark:text-gray-100">
              {order.customerName}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 text-left  dark:text-gray-100 font-mono">
          {order.orderTag}
        </div>
      </td>
      
      {viewMode === 'branch' && (
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex text-left items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
            {OrderStatusUtils.getStatusIcon(status)}
            <span className="ml-1">{orderService.getOrderStatusText(status, lang)}</span>
          </span>
        </td>
      )}
      
      <td className="px-6 py-4 text-left  whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
        {'tableName' in order && order.tableName ? order.tableName : '-'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-left  font-medium text-gray-900 dark:text-gray-100">
          {order.totalPrice.toFixed(2)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-left font-medium text-gray-900 dark:text-gray-100">
          {order.orderTypeName}
          <span className='mr-1 ml-1'>{order.orderTypeIcon}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(order.createdAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US')}
        <div className="text-xs">
          {new Date(order.createdAt).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onOpenDetails(order)}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            title={t('ordersManager.viewDetails')}
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {orderService.canModifyOrder(status) && (
            <button
              onClick={() => onOpenConfirm(order.id.toString(), rowVersion)}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              title={t('ordersManager.confirm')}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          
          {/* FIXED: Only show reject button for Pending status */}
          {status === OrderStatusEnums.Pending && (
            <button
              onClick={() => onOpenReject(order.id.toString(), rowVersion)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              title={t('ordersManager.reject')}
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          
          {/* FIXED: Cancel button - available for orders that can be cancelled */}
           {orderService.canCancelOrder(status) && (
                   <button
                     onClick={() => {
                       onOpenCancel(order.id.toString(), rowVersion)
                     }}
                     className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                     title={t('ordersManager.cancel')}
                   >
                     <Ban className="w-4 h-4" />
                   </button>
                 )}
                 
          {validStatuses.length > 0 && (
            <select
              title={t('ordersManager.changeStatus')}
              onChange={(e) => {
                const newStatus = parseInt(e.target.value) as OrderStatusEnums;
                if (newStatus !== status) {
                  onOpenStatus(order.id.toString(), rowVersion, newStatus);
                }
                e.target.value = status.toString();
              }}
              className="text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>{t('ordersManager.changeStatus')}</option>
              {validStatuses.map((validStatus) => (
                <option key={validStatus} value={validStatus}>
                  {orderService.getOrderStatusText(validStatus, lang)}
                </option>
              ))}
            </select>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;