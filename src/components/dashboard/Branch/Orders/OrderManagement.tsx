'use client';

import React, { useState, useEffect } from 'react';
import { orderService, Order, PendingOrder, BranchOrder, OrderStatus, ConfirmOrderDto, RejectOrderDto, UpdateOrderStatusDto } from '../../../../services/Branch/OrderService';

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
  activeOrderId: string | null;
  activeRowVersion: string | null;
  rejectReason: string;
  newStatus: OrderStatus | null;
}

const OrdersManager: React.FC = () => {
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
    activeOrderId: null,
    activeRowVersion: null,
    rejectReason: '',
    newStatus: null,
  });

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
      alert('Sipariş başarıyla onaylandı!');
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
      alert('Sipariş başarıyla reddedildi!');
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
      alert('Sipariş durumu başarıyla güncellendi!');
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.response?.status === 400 && error.response?.data?.message.includes('Invalid status transition')) {
        errorMessage = `Geçersiz durum geçişi: Lütfen önce siparişi onaylayın (Onaylandı durumuna geçin).`;
      } else if (error.response?.status === 400 && error.response?.data?.message.includes('cannot be confirmed')) {
        errorMessage = `Bu sipariş onaylanamaz. Mevcut durum: ${error.response?.data?.message.split('Current status: ')[1] || 'Bilinmeyen'}.`;
      }
      setState(prev => ({ ...prev, error: errorMessage, loading: false, activeOrderId: null, activeRowVersion: null, newStatus: null }));
    }
  };

  // Switch view mode
  const switchViewMode = (mode: 'pending' | 'branch') => {
    setState(prev => ({ ...prev, viewMode: mode }));
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

  const closeModals = () => {
    setState(prev => ({ ...prev, showConfirmModal: false, showRejectModal: false, showStatusModal: false, activeOrderId: null, activeRowVersion: null, rejectReason: '', newStatus: null }));
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const renderOrderCard = (order: PendingOrder | BranchOrder, index: number) => {
    const isPending = state.viewMode === 'pending';
    // For pending orders, default to Pending status. For branch orders, parse the string status
    const status = isPending
      ? OrderStatus.Pending // PendingOrder doesn't have status field, so it's always pending
      : orderService.parseOrderStatus((order as BranchOrder).status);
    const rowVersion = order.rowVersion || '';
    const flatItems = isPending && 'items' in order ? orderService.getFlatItemList(order.items) : [];
    const validStatuses = getValidStatusTransitions(status);

    return (
      <div
        key={index}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500 dark:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{order.customerName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sipariş Etiketi: {order.orderTag}</p>
            {'tableName' in order && order.tableName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Masa: {order.tableName}</p>
            )}
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">Toplam: {order.totalPrice.toFixed(2)} TL</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === OrderStatus.Pending
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : status === OrderStatus.Confirmed
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : status === OrderStatus.Preparing
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  : status === OrderStatus.Ready
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : status === OrderStatus.Completed
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : status === OrderStatus.Rejected
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : status === OrderStatus.Cancelled
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  : status === OrderStatus.Delivered 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {orderService.getOrderStatusText(status)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {flatItems.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ürünler:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                {flatItems.slice(0, 5).map((item, i) => (
                  <li key={i} className={item.isAddon ? 'ml-4 text-gray-500 dark:text-gray-500' : ''}>
                    {item.isAddon && '↳ '}
                    {item.productName} x{orderService.getItemQuantity(item)} - {item.totalPrice.toFixed(2)} TL
                    {orderService.getItemNotes(item) && (
                      <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Not: {orderService.getItemNotes(item)}
                      </span>
                    )}
                  </li>
                ))}
                {flatItems.length > 5 && (
                  <li className="text-gray-400 dark:text-gray-500 text-sm">... ve {flatItems.length - 5} ürün daha</li>
                )}
              </ul>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tarih: {new Date(order.createdAt).toLocaleString('tr-TR')}
            </p>
            {'confirmedAt' in order && order.confirmedAt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Onaylanma: {new Date(order.confirmedAt).toLocaleString('tr-TR')}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          {orderService.canModifyOrder(status) && (
            <button
              onClick={() => openConfirmModal(order.id.toString(), rowVersion)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              disabled={state.loading}
            >
              Onayla
            </button>
          )}
          {orderService.canCancelOrder(status) && (
            <button
              onClick={() => openRejectModal(order.id.toString(), rowVersion)}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              disabled={state.loading}
            >
              Reddet
            </button>
          )}
          {validStatuses.length > 0 && (
            <select
              onChange={(e) => {
                const newStatus = parseInt(e.target.value) as OrderStatus;
                if (newStatus !== status) {
                  openStatusModal(order.id.toString(), rowVersion, newStatus);
                }
              }}
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              defaultValue={status.toString()}
              disabled={state.loading}
            >
              <option value={status} disabled>
                {orderService.getOrderStatusText(status)} (Mevcut)
              </option>
              {validStatuses.map((validStatus) => (
                <option key={validStatus} value={validStatus}>
                  {orderService.getOrderStatusText(validStatus)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  const ordersToDisplay = state.viewMode === 'pending' ? state.pendingOrders : state.branchOrders;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">Restoranınızın siparişlerini kolayca yönetin ve takip edin.</p>
        </div>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => switchViewMode('pending')}
            className={`px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-300 ${
              state.viewMode === 'pending'
                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100'
                : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } shadow-md`}
          >
            Bekleyen Siparişler
          </button>
          <button
            onClick={() => switchViewMode('branch')}
            className={`px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-300 ${
              state.viewMode === 'branch'
                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100'
                : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } shadow-md`}
          >
            Şube Siparişleri
          </button>
        </div>

        {state.loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {state.error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg mb-8 max-w-2xl mx-auto text-center">
            Hata: {state.error}
          </div>
        )}

        {ordersToDisplay.length === 0 && !state.loading ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Henüz {state.viewMode === 'pending' ? 'bekleyen' : 'şube'} sipariş yok.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersToDisplay.map((order, index) => renderOrderCard(order, index))}
          </div>
        )}

        {state.selectedOrder && (
          <div className="fixed bottom-6 right-6 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-6 py-4 rounded-lg max-w-sm shadow-lg">
            Seçili Sipariş: {state.selectedOrder.customerName} - Durum: {orderService.getOrderStatusText(state.selectedOrder.status)}
          </div>
        )}

        {/* Confirm Modal */}
        {state.showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Siparişi Onayla</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Bu siparişi onaylamak istediğinizden emin misiniz?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {state.showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Siparişi Reddet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Reddetme nedenini girin:</p>
              <textarea
                value={state.rejectReason}
                onChange={(e) => setState(prev => ({ ...prev, rejectReason: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-6"
                rows={4}
                placeholder="Reddetme nedeni..."
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleRejectOrder}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                  disabled={!state.rejectReason.trim()}
                >
                  Reddet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {state.showStatusModal && state.newStatus !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Durumu Güncelle</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sipariş durumunu <span className="font-medium">{orderService.getOrderStatusText(state.newStatus)}</span> olarak güncellemek istediğinizden emin misiniz?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManager;