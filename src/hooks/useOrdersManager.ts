import { useState } from 'react';
import { OrdersManagerActions, OrdersManagerState, OrderStatusEnums } from '../types/Orders/type';
import { orderService } from '../services/Branch/OrderService';
import { BranchOrder, Order, PendingOrder, RejectOrderDto, UpdateOrderStatusDto } from '../types/BranchManagement/type';


export const useOrdersManager = () => {
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
    
    filters: {
      search: '',
      status: 'all',
      dateRange: {
        start: '',
        end: ''
      },
      priceRange: {
        min: null,
        max: null
      },
      orderType: '',
      customerName: '',
      tableName: ''
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    },
    showAdvancedFilters: false,
    filteredOrders: []
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

  // Handle confirm order
  const handleConfirmOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion) return;
    setState(prev => ({ ...prev, loading: true, error: null, showConfirmModal: false }));
    try {
      const data = { rowVersion: state.activeRowVersion };
      const updatedOrder = await orderService.confirmOrder(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ 
        ...prev, 
        selectedOrder: updatedOrder, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null 
      }));
    }
  };

  // Handle reject order
  const handleRejectOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || !state.rejectReason) return;
    setState(prev => ({ ...prev, loading: true, error: null, showRejectModal: false }));
    try {
      const data: RejectOrderDto = { 
        rejectionReason: state.rejectReason, 
        rowVersion: state.activeRowVersion 
      };
      const updatedOrder = await orderService.rejectOrder(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ 
        ...prev, 
        selectedOrder: updatedOrder, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null, 
        rejectReason: '' 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null, 
        rejectReason: '' 
      }));
    }
  };

  // Handle update status
  const handleUpdateStatus = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || state.newStatus === null) return;
    setState(prev => ({ ...prev, loading: true, error: null, showStatusModal: false }));
    try {
      const data: UpdateOrderStatusDto = { 
        newStatus: state.newStatus, 
        rowVersion: state.activeRowVersion 
      };
      const updatedOrder = await orderService.updateOrderStatus(state.activeOrderId, data);
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      setState(prev => ({ 
        ...prev, 
        selectedOrder: updatedOrder, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null, 
        newStatus: null 
      }));
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.response?.status === 400 && error.response?.data?.message.includes('Invalid status transition')) {
        errorMessage = 'Invalid status transition';
      } else if (error.response?.status === 400 && error.response?.data?.message.includes('cannot be confirmed')) {
        errorMessage = `Cannot confirm order. Current status: ${error.response?.data?.message.split('Current status: ')[1] || 'unknown'}`;
      }
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null, 
        newStatus: null 
      }));
    }
  };

  // Switch view mode
  const switchViewMode = (mode: 'pending' | 'branch') => {
    setState(prev => ({ 
      ...prev, 
      viewMode: mode,
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
    if (mode === 'pending') {
      fetchPendingOrders();
    } else {
      fetchBranchOrders();
    }
  };

  // Modal handlers
  const openConfirmModal = (orderId: string, rowVersion: string) => {
    setState(prev => ({ 
      ...prev, 
      showConfirmModal: true, 
      activeOrderId: orderId, 
      activeRowVersion: rowVersion 
    }));
  };

  const openRejectModal = (orderId: string, rowVersion: string) => {
    setState(prev => ({ 
      ...prev, 
      showRejectModal: true, 
      activeOrderId: orderId, 
      activeRowVersion: rowVersion 
    }));
  };

  const openStatusModal = (orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => {
    setState(prev => ({ 
      ...prev, 
      showStatusModal: true, 
      activeOrderId: orderId, 
      activeRowVersion: rowVersion, 
      newStatus 
    }));
  };

  const openDetailsModal = (order: PendingOrder | BranchOrder) => {
    setState(prev => ({ 
      ...prev, 
      showDetailsModal: true, 
      selectedOrder: order as unknown as Order
    }));
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

  const handleSort = (field: string) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const actions: OrdersManagerActions = {
    fetchPendingOrders,
    fetchBranchOrders,
    handleConfirmOrder,
    handleRejectOrder,
    handleUpdateStatus,
    switchViewMode,
    openConfirmModal,
    openRejectModal,
    openStatusModal,
    openDetailsModal,
    closeModals,
    toggleRowExpansion,
    handleSort,
    setState
  };

  return { state, actions };
};