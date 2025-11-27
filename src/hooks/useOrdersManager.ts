import { useCallback, useState } from 'react';
import { OrdersManagerActions, OrdersManagerState, OrderStatusEnums } from '../types/Orders/type';
import { orderService } from '../services/Branch/OrderService';
import { branchService } from '../services/branchService';
import { BranchOrder, Order, PendingOrder, RejectOrderDto, UpdateOrderStatusDto, TableBasketSummary } from '../types/BranchManagement/type';
import { BranchDropdownItem } from '../types/BranchManagement/type';
import { OrderType } from '../services/Branch/BranchOrderTypeService';

export const useOrdersManager = () => {
  const [state, setState] = useState<OrdersManagerState>({
    // Branch related states
    branches: [],
    selectedBranch: null,
    isBranchDropdownOpen: false,
    
    // Existing states
    pendingOrders: [],
    branchOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    viewMode: 'pending',
    showConfirmModal: false,
    showRejectModal: false,
    showCancelModal: false, // NEW: Add cancel modal state
    showStatusModal: false,
    showDetailsModal: false,
    activeOrderId: null,
    activeRowVersion: null,
    rejectReason: '',
    cancelReason: '', // NEW: Add cancel reason state
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

  // Helper to get current branch ID
  const getCurrentBranchId = () => state.selectedBranch?.branchId;

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const branchList = await branchService.getBranchesDropdown();
      setState(prev => ({ 
        ...prev, 
        branches: branchList,
        selectedBranch: branchList.length > 0 && !prev.selectedBranch ? branchList[0] : prev.selectedBranch,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  // Handle branch selection
const handleBranchSelect = (branch: BranchDropdownItem) => {
  console.log('🏢 handleBranchSelect called:', branch.branchName);
  setState(prev => ({ 
    ...prev, 
    selectedBranch: branch,
    isBranchDropdownOpen: false,
    error: null,
    pagination: { ...prev.pagination, currentPage: 1 }
  }));
  
  orderService.clearOrderTypesCache();
  

};

  // Fetch pending orders with branch filter
 const fetchPendingOrders = useCallback(async (branchId?: number) => {
    const targetBranchId = branchId || getCurrentBranchId();
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const orders = await orderService.getPendingOrders(targetBranchId);
      setState(prev => ({ ...prev, pendingOrders: orders, loading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  }, [getCurrentBranchId]);

const fetchBranchOrders = useCallback(async (branchId?: number, page?: number, pageSize?: number) => {
  const targetBranchId = branchId || state.selectedBranch?.branchId;
  const targetPage = page !== undefined ? page : state.pagination.currentPage;
  const targetPageSize = pageSize !== undefined ? pageSize : state.pagination.itemsPerPage;
  

  setState(prev => ({ ...prev, loading: true, error: null }));
  
  try {
    const result = await orderService.getBranchOrders(targetBranchId, targetPage, targetPageSize);
    
    // ✅ FIXED: Don't update currentPage/itemsPerPage here - only update the results
    setState(prev => ({
      ...prev, 
      branchOrders: result.orders, 
      loading: false,
      pagination: {
        ...prev.pagination, // ✅ Preserve current pagination state
        totalItems: result.totalItems,
        totalPages: result.totalPages
      }
    }));
  } catch (error: any) {
    setState(prev => ({ 
      ...prev, 
      error: error.message, 
      loading: false,
      branchOrders: [],
      pagination: {
        ...prev.pagination, // ✅ Preserve current pagination state
        totalItems: 0,
        totalPages: 0
      }
    }));
  }
}, []); // ✅ Empty dependencies

const handleBranchPageChange = (newPage: number) => {
  console.log('🔄 Changing page to:', newPage);
  
  // ✅ Update state first - useEffect will trigger fetch
  setState(prev => ({
    ...prev,
    pagination: { ...prev.pagination, currentPage: newPage }
  }));
};

const handleBranchItemsPerPageChange = (newItemsPerPage: number) => {
  console.log('📏 Changing items per page to:', newItemsPerPage);
  
  // ✅ Update state first - useEffect will trigger fetch
  setState(prev => ({
    ...prev,
    pagination: { 
      ...prev.pagination, 
      itemsPerPage: newItemsPerPage, 
      currentPage: 1 // Reset to page 1
    }
  }));
};
    // Handle page change
    const handlePageChange = (newPage: number) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, currentPage: newPage }
      }));
      
      if (state.viewMode === 'branch') {
        fetchBranchOrders(undefined, newPage, state.pagination.itemsPerPage);
      }
    };

    // Handle items per page change
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, itemsPerPage: newItemsPerPage, currentPage: 1 }
      }));
      
      if (state.viewMode === 'branch') {
        fetchBranchOrders(undefined, 1, newItemsPerPage);
      }
    };

  // Fetch table basket summary with branch filter
  const fetchTableBasketSummary = async (): Promise<TableBasketSummary[]> => {
    const branchId = getCurrentBranchId();
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const summaries = await orderService.getTableBasketSummary(branchId);
      setState(prev => ({ ...prev, loading: false }));
      return summaries;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      return [];
    }
  };

  // Get order types for current branch
  const getOrderTypesForCurrentBranch = async (): Promise<OrderType[]> => {
    const branchId = getCurrentBranchId();
    try {
      return await orderService.getOrderTypesForDisplay(branchId);
    } catch (error: any) {
      console.error('Error fetching order types:', error);
      return [];
    }
  };

  // Get order type text for current branch
  const getOrderTypeText = async (orderTypeId: number): Promise<string> => {
    const branchId = getCurrentBranchId();
    return await orderService.getOrderTypeText(orderTypeId, branchId);
  };

  // Calculate order total for current branch
  const calculateOrderTotal = async (orderTypeId: number, baseAmount: number) => {
    const branchId = getCurrentBranchId();
    return await orderService.calculateOrderTotal(orderTypeId, baseAmount, branchId);
  };

  // Get estimated time for current branch
  const getEstimatedTime = async (orderTypeId: number): Promise<number> => {
    const branchId = getCurrentBranchId();
    return await orderService.getEstimatedTime(orderTypeId, branchId);
  };

  // Get order type by code for current branch
  const getOrderTypeByCode = async (code: string) => {
    const branchId = getCurrentBranchId();
    return await orderService.getOrderTypeByCode(code, branchId);
  };

  // Get active order types for current branch
  const getActiveOrderTypes = async (): Promise<OrderType[]> => {
    const branchId = getCurrentBranchId();
    try {
      return await orderService.getActiveOrderTypes(branchId);
    } catch (error: any) {
      console.error('Error fetching active order types:', error);
      return [];
    }
  };

  // Get all order types for current branch
  const getAllOrderTypes = async (): Promise<OrderType[]> => {
    const branchId = getCurrentBranchId();
    try {
      return await orderService.getAllOrderTypes(branchId);
    } catch (error: any) {
      console.error('Error fetching all order types:', error);
      return [];
    }
  };

  // Handle confirm order - FIXED: Now passes branchId
  const handleConfirmOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion) return;
    
    const branchId = getCurrentBranchId();
    setState(prev => ({ ...prev, loading: true, error: null, showConfirmModal: false }));
    
    try {
      const data = { rowVersion: state.activeRowVersion };
      const updatedOrder = await orderService.confirmOrder(state.activeOrderId, data, branchId);
      
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

  // Handle reject order - FIXED: Now passes branchId
  const handleRejectOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || !state.rejectReason) return;
    
    const branchId = getCurrentBranchId();
    setState(prev => ({ ...prev, loading: true, error: null, showRejectModal: false }));
    
    try {
      const data: RejectOrderDto = { 
        rejectionReason: state.rejectReason, 
        rowVersion: state.activeRowVersion 
      };
      const updatedOrder = await orderService.rejectOrder(state.activeOrderId, data, branchId);
      
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

  const handleCancelOrder = async () => {
    if (!state.activeOrderId || !state.activeRowVersion) return;
    
    const branchId = getCurrentBranchId();
    setState(prev => ({ ...prev, loading: true, error: null, showCancelModal: false }));
    
    try {
      // Cancel order by updating status to Cancelled
      const data: UpdateOrderStatusDto = { 
        newStatus: OrderStatusEnums.Cancelled,
        rowVersion: state.activeRowVersion 
      };
      const updatedOrder = await orderService.updateOrderStatus(state.activeOrderId, data, branchId);
      
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
        cancelReason: '' 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false, 
        activeOrderId: null, 
        activeRowVersion: null, 
        cancelReason: '' 
      }));
    }
  };

  // Handle update status - FIXED: Now passes branchId
  const handleUpdateStatus = async () => {
    if (!state.activeOrderId || !state.activeRowVersion || state.newStatus === null) return;
    
    const branchId = getCurrentBranchId();
    setState(prev => ({ ...prev, loading: true, error: null, showStatusModal: false }));
    
    try {
      const data: UpdateOrderStatusDto = { 
        newStatus: state.newStatus, 
        rowVersion: state.activeRowVersion 
      };
      const updatedOrder = await orderService.updateOrderStatus(state.activeOrderId, data, branchId);
      
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

  // NEW: Get order details with branch support
  const getOrderDetails = async (orderId: string): Promise<Order | null> => {
    const branchId = getCurrentBranchId();
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const order = await orderService.getOrder(orderId, branchId);
      setState(prev => ({ ...prev, loading: false }));
      return order;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      return null;
    }
  };

  // NEW: Get table orders with branch support
  const getTableOrders = async (tableId: number): Promise<Order[]> => {
    const branchId = getCurrentBranchId();
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const orders = await orderService.getTableOrders(tableId, branchId);
      setState(prev => ({ ...prev, loading: false }));
      return orders;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      return [];
    }
  };

  // NEW: Create session order with branch support
  const createSessionOrder = async (data: any): Promise<Order | null> => {
    const branchId = getCurrentBranchId();
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const order = await orderService.createSessionOrder(data, branchId);
      setState(prev => ({ ...prev, loading: false }));
      
      // Refresh orders after creating
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
      
      return order;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      return null;
    }
  };

  // NEW: Refresh order types for current branch
  const refreshOrderTypes = async (): Promise<void> => {
    const branchId = getCurrentBranchId();
    try {
      await orderService.refreshOrderTypes(branchId);
    } catch (error: any) {
      console.error('Error refreshing order types:', error);
    }
  };

const switchViewMode = (mode: 'pending' | 'branch' | 'deletedOrders') => {
  console.log('🔀 switchViewMode called:', mode);
  
  setState(prev => ({ 
    ...prev, 
    viewMode: mode,
    pagination: { 
      currentPage: 1,
      itemsPerPage: prev.pagination.itemsPerPage,
      totalItems: 0,
      totalPages: 0
    }
  }));
  
  // DON'T fetch here - let useEffect in component handle it
  console.log('✋ switchViewMode: NOT fetching, letting useEffect handle it');
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

  // NEW: Cancel modal handler
  const openCancelModal = (orderId: string, rowVersion: string) => {
    setState(prev => ({ 
      ...prev, 
      showCancelModal: true, 
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
      showCancelModal: false, // NEW: Reset cancel modal
      showStatusModal: false, 
      showDetailsModal: false,
      activeOrderId: null, 
      activeRowVersion: null, 
      rejectReason: '', 
      cancelReason: '', // NEW: Reset cancel reason
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
    fetchBranches,
    handleBranchSelect,
    fetchPendingOrders,
    fetchBranchOrders,
    fetchTableBasketSummary,
    getOrderTypesForCurrentBranch,
    getOrderTypeText,
    calculateOrderTotal,
    getEstimatedTime,
    getOrderTypeByCode,
    getActiveOrderTypes,
    getAllOrderTypes,
    handleConfirmOrder,
    handleRejectOrder,
    handleCancelOrder, 
    handleUpdateStatus,
    getOrderDetails,
    getTableOrders,
    createSessionOrder,
    refreshOrderTypes,
    switchViewMode,
    openConfirmModal,
    openRejectModal,
    openCancelModal, 
    openStatusModal,
    openDetailsModal,
    closeModals,
    toggleRowExpansion,
    handleSort,
    setState,
    handlePageChange,
    handleItemsPerPageChange,
    handleBranchPageChange,
    handleBranchItemsPerPageChange
  };

  return { state, actions };
};