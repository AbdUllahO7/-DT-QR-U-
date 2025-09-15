'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertCircle, Package, Truck, Eye, Filter } from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { BranchOrder, ConfirmOrderDto, Order, OrderStatus, PendingOrder, RejectOrderDto, UpdateOrderStatusDto } from '../../../../types/Orders/type';

// Types for component state
interface OrdersManagerState {
  pendingOrders: PendingOrder[];
  branchOrders: BranchOrder[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  viewMode: 'pending' | 'branch';
  showConfirmModal: boolean;
  showRejectModal: boolean;
  showStatusModal: boolean;
  showDetailsModal: boolean;
  activeOrderId: string | null;
  activeRowVersion: string | null;
  rejectReason: string;
  newStatus: OrderStatus | null;
  expandedRows: Set<string>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  statusFilter: OrderStatus | 'all';
}

const OrdersManager: React.FC = () => {
  const { t ,language} = useLanguage();
  
  const lang = language // Get the current language (e.g., 'en', 'tr', 'ar')
  const [state, setState] = useState<OrdersManagerState>({
    pendingOrders: [],
    branchOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    viewMode: 'pending',
    showConfirmModal: false,
    showRejectModal: false,
    showStatusModal: false,
    showDetailsModal: false,
    activeOrderId: null,
    activeRowVersion: null,
    rejectReason: '',
    newStatus: null,
    expandedRows: new Set(),
    sortField: 'createdAt',
    sortDirection: 'desc',
    statusFilter: 'all'
  });
  console.log("selectedOrder", state.selectedOrder)
  // Fetch pending orders
  const fetchPendingOrders = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const orders = await orderService.getPendingOrders();
      setState(prev => ({ ...prev, pendingOrders: orders, loading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  // Fetch branch orders
  const fetchBranchOrders = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const orders = await orderService.getBranchOrders();
      setState(prev => ({ ...prev, branchOrders: orders, loading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  // Confirm order
  const handleConfirmOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion) return;
    setState(prev => ({ ...prev, loading: true, error: null, showConfirmModal: false }));
    try {
      const data: ConfirmOrderDto = { rowVersion: state.activeRowVersion };
      const updatedOrder = await orderService.confirmOrder(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ ...prev, selectedOrder: updatedOrder, loading: false, activeOrderId: null, activeRowVersion: null }));
    
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false, activeOrderId: null, activeRowVersion: null }));
    }
  };

  // Reject order
  const handleRejectOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || !state.rejectReason) return;
    setState(prev => ({ ...prev, loading: true, error: null, showRejectModal: false }));
    try {
      const data: RejectOrderDto = { rejectionReason: state.rejectReason, rowVersion: state.activeRowVersion };
      const updatedOrder = await orderService.rejectOrder(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ ...prev, selectedOrder: updatedOrder, loading: false, activeOrderId: null, activeRowVersion: null, rejectReason: '' }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false, activeOrderId: null, activeRowVersion: null, rejectReason: '' }));
    }
  };

  // Update order status
  const handleUpdateStatus = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || state.newStatus === null) return;
    setState(prev => ({ ...prev, loading: true, error: null, showStatusModal: false }));
    try {
      const data: UpdateOrderStatusDto = { newStatus: state.newStatus, rowVersion: state.activeRowVersion };
      const updatedOrder = await orderService.updateOrderStatus(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ ...prev, selectedOrder: updatedOrder, loading: false, activeOrderId: null, activeRowVersion: null, newStatus: null }));
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.response?.status === 400 && error.response?.data?.message.includes('Invalid status transition')) {
        errorMessage = t('ordersManager.errorInvalidStatusTransition');
      } else if (error.response?.status === 400 && error.response?.data?.message.includes('cannot be confirmed')) {
        errorMessage = t('ordersManager.errorCannotConfirm', { currentStatus: error.response?.data?.message.split('Current status: ')[1] || t('ordersManager.unknownStatus') });
      }
      setState(prev => ({ ...prev, error: errorMessage, loading: false, activeOrderId: null, activeRowVersion: null, newStatus: null }));
    }
  };

  // Switch view mode
  const switchViewMode = (mode: 'pending' | 'branch') => {
    setState(prev => ({ ...prev, viewMode: mode, statusFilter: 'all' }));
    if (mode === 'pending') {
      fetchPendingOrders();
    } else {
      fetchBranchOrders();
    }
  };

  // Get valid status transitions based on current status
  const getValidStatusTransitions = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case OrderStatus.Pending:
        return [OrderStatus.Confirmed, OrderStatus.Cancelled, OrderStatus.Rejected];
      case OrderStatus.Confirmed:
        return [OrderStatus.Preparing, OrderStatus.Cancelled];
      case OrderStatus.Preparing:
        return [OrderStatus.Ready, OrderStatus.Cancelled];
      case OrderStatus.Ready:
        return [OrderStatus.Completed, OrderStatus.Cancelled];
      case OrderStatus.Completed:
        return [OrderStatus.Delivered];
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
      case OrderStatus.Delivered:
        return []; // Final states - no transitions allowed
      default:
        return [];
    }
  };

  // Get status icon and color
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case OrderStatus.Confirmed:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case OrderStatus.Preparing:
        return <Package className="w-4 h-4 text-orange-600" />;
      case OrderStatus.Ready:
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      case OrderStatus.Completed:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case OrderStatus.Delivered:
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get status badge styles
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case OrderStatus.Confirmed:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case OrderStatus.Preparing:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700';
      case OrderStatus.Ready:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case OrderStatus.Completed:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case OrderStatus.Delivered:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700';
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  // Modal handlers
  const openConfirmModal = (orderId: string, rowVersion: string) => {
    setState(prev => ({ ...prev, showConfirmModal: true, activeOrderId: orderId, activeRowVersion: rowVersion }));
  };

  const openRejectModal = (orderId: string, rowVersion: string) => {
    setState(prev => ({ ...prev, showRejectModal: true, activeOrderId: orderId, activeRowVersion: rowVersion }));
  };

  const openStatusModal = (orderId: string, rowVersion: string, newStatus: OrderStatus) => {
    setState(prev => ({ ...prev, showStatusModal: true, activeOrderId: orderId, activeRowVersion: rowVersion, newStatus }));
  };

  const openDetailsModal = (order: PendingOrder | BranchOrder) => {
    setState(prev => ({ ...prev, showDetailsModal: true, selectedOrder: order as Order }));
  };

  const closeModals = () => {
    setState(prev => ({ 
      ...prev, 
      showConfirmModal: false, 
      showRejectModal: false, 
      showStatusModal: false, 
      showDetailsModal: false,
      activeOrderId: null, 
      activeRowVersion: null, 
      rejectReason: '', 
      newStatus: null,
      selectedOrder: null
    }));
  };

  // Toggle row expansion
  const toggleRowExpansion = (orderId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedRows);
      if (newExpanded.has(orderId)) {
        newExpanded.delete(orderId);
      } else {
        newExpanded.add(orderId);
      }
      return { ...prev, expandedRows: newExpanded };
    });
  };

  // Sort orders
  const handleSort = (field: string) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let orders = state.viewMode === 'pending' ? state.pendingOrders : state.branchOrders;
    
    // Apply status filter (only for branch orders)
    if (state.viewMode === 'branch' && state.statusFilter !== 'all') {
      orders = orders.filter(order => {
        const status = orderService.parseOrderStatus((order as BranchOrder).status);
        return status === state.statusFilter;
      });
    }

    // Sort orders
    return orders.sort((a, b) => {
      let aValue, bValue;
      
      switch (state.sortField) {
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (state.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const ordersToDisplay = getFilteredAndSortedOrders();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('ordersManager.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('ordersManager.description')}</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => switchViewMode('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                state.viewMode === 'pending'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {t('ordersManager.pendingOrders')} ({state.pendingOrders.length})
            </button>
            <button
              onClick={() => switchViewMode('branch')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                state.viewMode === 'branch'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {t('ordersManager.branchOrders')} ({state.branchOrders.length})
            </button>
          </div>

          {/* Status Filter (only for branch orders) */}
          {state.viewMode === 'branch' && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                title={t('ordersManager.statusFilter')}
                value={state.statusFilter}
                onChange={(e) => setState(prev => ({ ...prev, statusFilter: e.target.value === 'all' ? 'all' : parseInt(e.target.value) as OrderStatus }))}
                className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('ordersManager.allStatuses')}</option>
                {Object.values(OrderStatus).filter(v => typeof v === 'number').map((status) => (
                  <option key={status} value={status}>
                    {orderService.getOrderStatusText(status as OrderStatus, lang)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {state.error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {/* Orders Table */}
        {!state.loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {ordersToDisplay.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  {t('ordersManager.noOrders', { viewMode: state.viewMode === 'pending' ? t('ordersManager.pendingOrders').toLowerCase() : t('ordersManager.branchOrders').toLowerCase() })}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('customerName')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>{t('ordersManager.customer')}</span>
                          {state.sortField === 'customerName' && (
                            state.sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('ordersManager.orderNumber')}
                      </th>
                      {state.viewMode === 'branch' && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t('ordersManager.status')}
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('ordersManager.table')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('totalPrice')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>{t('ordersManager.amount')}</span>
                          {state.sortField === 'totalPrice' && (
                            state.sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>{t('ordersManager.date')}</span>
                          {state.sortField === 'createdAt' && (
                            state.sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('ordersManager.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {ordersToDisplay.map((order) => {
                      const isPending = state.viewMode === 'pending';
                      const status = isPending ? OrderStatus.Pending : orderService.parseOrderStatus((order as BranchOrder).status);
                      const rowVersion = order.rowVersion || '';
                      const validStatuses = getValidStatusTransitions(status);
                      const isExpanded = state.expandedRows.has(order.id.toString());
                      const flatItems = isPending && 'items' in order ? orderService.getFlatItemList(order.items) : [];

                      return (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleRowExpansion(order.id.toString())}
                                  className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {order.customerName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                                {order.orderTag}
                              </div>
                            </td>
                            {state.viewMode === 'branch' && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(status)}`}>
                                  {getStatusIcon(status)}
                                  <span className="ml-1">{orderService.getOrderStatusText(status, lang)}</span>
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {'tableName' in order && order.tableName ? order.tableName : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {order.totalPrice.toFixed(2)}
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
                                  onClick={() => openDetailsModal(order)}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                                  title={t('ordersManager.viewDetails')}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {orderService.canModifyOrder(status) && (
                                  <button
                                    onClick={() => openConfirmModal(order.id.toString(), rowVersion)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                    disabled={state.loading}
                                    title={t('ordersManager.confirm')}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {orderService.canCancelOrder(status) && (
                                  <button
                                    onClick={() => openRejectModal(order.id.toString(), rowVersion)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    disabled={state.loading}
                                    title={t('ordersManager.reject')}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {validStatuses.length > 0 && (
                                  <select
                                    title={t('ordersManager.changeStatus')}
                                    onChange={(e) => {
                                      const newStatus = parseInt(e.target.value) as OrderStatus;
                                      if (newStatus !== status) {
                                        openStatusModal(order.id.toString(), rowVersion, newStatus);
                                      }
                                      e.target.value = status.toString(); // Reset select
                                    }}
                                    className="text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={state.loading}
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
                  
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Confirm Modal */}
        {state.showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('ordersManager.confirmOrderTitle')}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t('ordersManager.confirmOrderPrompt')}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  {t('ordersManager.cancel')}
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                  disabled={state.loading}
                >
                  {state.loading ? t('ordersManager.confirming') : t('ordersManager.confirmAction')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {state.showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                <XCircle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('ordersManager.rejectOrderTitle')}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('ordersManager.rejectOrderPrompt')}</p>
              <textarea
                value={state.rejectReason}
                onChange={(e) => setState(prev => ({ ...prev, rejectReason: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 mb-6"
                rows={4}
                placeholder={t('ordersManager.rejectReasonPlaceholder')}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  {t('ordersManager.cancel')}
                </button>
                <button
                  onClick={handleRejectOrder}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                  disabled={!state.rejectReason.trim() || state.loading}
                >
                  {state.loading ? t('ordersManager.rejecting') : t('ordersManager.rejectAction')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {state.showStatusModal && state.newStatus !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                {getStatusIcon(state.newStatus)}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-3">{t('ordersManager.updateStatusTitle')}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('ordersManager.updateStatusPrompt', { status: orderService.getOrderStatusText(state.newStatus, lang) })}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  {t('ordersManager.cancel')}
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                  disabled={state.loading}
                >
                  {state.loading ? t('ordersManager.updating') : t('ordersManager.updateAction')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}

        {/* Details Modal - Complete Fix */}
            {state.showDetailsModal && state.selectedOrder && (
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
                  onClick={closeModals}
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
                      {state.selectedOrder.customerName}
                    </p>
                    {/* Show customer phone if available */}
                    {(state.selectedOrder as any).customerPhone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(state.selectedOrder as any).customerPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('ordersManager.orderNumber')}
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {state.selectedOrder.orderTag}
                    </p>
                  </div>
                
                </div>

                {/* Order Type & Table Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Order Type */}
                  {(state.selectedOrder as any).orderTypeName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         {t('ordersManager.OrderType')}
                      </label>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{(state.selectedOrder as any).orderTypeIcon}</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {(state.selectedOrder as any).orderTypeName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(state.selectedOrder as any).orderTypeCode}
                      </p>
                    </div>
                  )}

                  {/* Table Information */}
                  {(() => {
                    const tableName = 'tableName' in state.selectedOrder ? state.selectedOrder.tableName : null;
                    const tableId = (state.selectedOrder as any).tableId;
                    if (tableName || tableId) {
                      return (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('ordersManager.table')}
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {tableName || `Table #${tableId}`}
                          </p>
                         
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Order Status for Branch Orders */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('ordersManager.status')}
                    </label>
                    {(() => {
                      const status = state.viewMode === 'branch' 
                        ? orderService.parseOrderStatus((state.selectedOrder as BranchOrder).status)
                        : OrderStatus.Pending;
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(status)}`}>
                          {getStatusIcon(status)}
                          <span className="ml-1">
                            {orderService.getOrderStatusText(status, lang)}
                          </span>
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Delivery Address (if available) */}
                {(state.selectedOrder as any).deliveryAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       {t('ordersManager.DeliveryAddress')}
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {(state.selectedOrder as any).deliveryAddress}
                    </p>
                  </div>
                )}

                {/* Order Notes */}
                {(() => {
                  const notes = (state.selectedOrder as any).notes;
                  if (notes) {
                    // Parse notes to separate regular notes from metadata
                    const notesLines = notes.split('\n');
                    const regularNotes = notesLines.filter(line => !line.includes('[METADATA:')).join('\n').trim();
                    const metadataLine = notesLines.find(line => line.includes('[METADATA:'));
                    
                    let metadata = null;
                    if (metadataLine) {
                      try {
                        const metadataJson = metadataLine.substring(metadataLine.indexOf('{'), metadataLine.lastIndexOf('}') + 1);
                        metadata = JSON.parse(metadataJson);
                      } catch (e) {
                        console.error('Error parsing metadata:', e);
                      }
                    }

                    return (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('ordersManager.OrderNotesInformation')}
                        </label>
                        
                        {regularNotes && (
                          <div className="mb-3">
                            <p className="text-gray-900 dark:text-gray-100 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-400">
                              {regularNotes}
                            </p>
                          </div>
                        )}

                        {metadata && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">  {t('ordersManager.OrderMetadata')}</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {metadata.UnifiedOrder && (
                                <div>
                                  <span className="text-blue-600 dark:text-blue-300">Unified Order:</span>
                                  <span className="text-blue-800 dark:text-blue-100 ml-1">Yes</span>
                                </div>
                              )}
                              {metadata.CustomerCount && (
                                <div>
                                  <span className="text-blue-600 dark:text-blue-300">Customers:</span>
                                  <span className="text-blue-800 dark:text-blue-100 ml-1">{metadata.CustomerCount}</span>
                                </div>
                              )}
                             
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('ordersManager.ItemCount')}
                    </label>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {(state.selectedOrder as any).itemCount || 
                      (state.selectedOrder as any).items?.length || 
                      'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('ordersManager.TotalItems')}
                    </label>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(() => {
                        const items = (state.selectedOrder as any).items;
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
                      {state.selectedOrder.totalPrice.toFixed(2)}
                    </p>
                  </div>
                 
                </div>

                {/* Order Items Section - Enhanced */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    {t('ordersManager.orderItems')}
                  </h4>
                  
                  {(() => {
                    const items = (state.selectedOrder as any).items;
                    
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

                    // Render items recursively
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
                                    <span className="font-medium text-gray-900 dark:text-gray-100 ">
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
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {renderItems(items)}
                        
                        {/* Order Total */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              {t('ordersManager.total')}:
                            </span>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {state.selectedOrder.totalPrice.toFixed(2)}
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
                    {t('ordersManager.OrderTimeline')}:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('ordersManager.createdAt')}
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {new Date(state.selectedOrder.createdAt).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                    </div>
                    
                    {(() => {
                      const confirmedAt = (state.selectedOrder as any).confirmedAt;
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
                      const completedAt = (state.selectedOrder as any).completedAt;
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

                {/* Row Version (for debugging/admin purposes) */}
                
              </div>
            </div>
          </div>
        )}
        {/* Success notification */}
        {state.selectedOrder && (
          <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <div>
                <p className="font-medium">{t('ordersManager.successNotification')}</p>
                <p className="text-sm">{state.selectedOrder.customerName} - {state.selectedOrder.orderTag}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManager;