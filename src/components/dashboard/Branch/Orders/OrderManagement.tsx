'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertCircle, Package, Truck, Eye, Filter, Search, Calendar, User, CreditCard, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { OrderStatus } from '../../../../types/Orders/type';
import { BranchOrder, Order, PendingOrder, RejectOrderDto, UpdateOrderStatusDto } from '../../../../types/BranchManagement/type';

// Enhanced filtering interface
interface FilterOptions {
  search: string;
  status: OrderStatus | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  orderType: string;
  customerName: string;
  tableName: string;
}

// Pagination interface
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Enhanced component state
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
  
  // Enhanced filtering and pagination
  filters: FilterOptions;
  pagination: PaginationState;
  showAdvancedFilters: boolean;
  filteredOrders: (PendingOrder | BranchOrder)[];
}

const OrdersManager: React.FC = () => {
  const { t, language } = useLanguage();
  
  const lang = language;
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
    
    // Enhanced filtering and pagination
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

  // Smart filtering function
  const applyFilters = useMemo(() => {
    let orders = state.viewMode === 'pending' ? state.pendingOrders : state.branchOrders;
    
    // Apply search filter
    if (state.filters.search.trim()) {
      const searchTerm = state.filters.search.toLowerCase();
      orders = orders.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.orderTag.toLowerCase().includes(searchTerm) ||
        (('tableName' in order) && order.tableName?.toLowerCase().includes(searchTerm)) ||
        (('notes' in order) && order.notes?.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter (only for branch orders)
    if (state.viewMode === 'branch' && state.filters.status !== 'all') {
      orders = orders.filter(order => {
        const status = orderService.parseOrderStatus((order as BranchOrder).status);
        return status === state.filters.status;
      });
    }

    // Apply date range filter
    if (state.filters.dateRange.start) {
      const startDate = new Date(state.filters.dateRange.start);
      orders = orders.filter(order => new Date(order.createdAt) >= startDate);
    }
    if (state.filters.dateRange.end) {
      const endDate = new Date(state.filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      orders = orders.filter(order => new Date(order.createdAt) <= endDate);
    }

    // Apply price range filter
    if (state.filters.priceRange.min !== null) {
      orders = orders.filter(order => order.totalPrice >= state.filters.priceRange.min!);
    }
    if (state.filters.priceRange.max !== null) {
      orders = orders.filter(order => order.totalPrice <= state.filters.priceRange.max!);
    }

    // Apply customer name filter
    if (state.filters.customerName.trim()) {
      const customerTerm = state.filters.customerName.toLowerCase();
      orders = orders.filter(order => 
        order.customerName.toLowerCase().includes(customerTerm)
      );
    }

    // Apply table name filter
    if (state.filters.tableName.trim()) {
      const tableTerm = state.filters.tableName.toLowerCase();
      orders = orders.filter(order => 
        ('tableName' in order) && order.tableName?.toLowerCase().includes(tableTerm)
      );
    }

    // Apply order type filter
    if (state.filters.orderType.trim()) {
      const orderTypeTerm = state.filters.orderType.toLowerCase();
      orders = orders.filter(order => 
        (('orderTypeName' in order) && (order as any).orderTypeName?.toLowerCase().includes(orderTypeTerm)) ||
        (('orderTypeCode' in order) && (order as any).orderTypeCode?.toLowerCase().includes(orderTypeTerm))
      );
    }

    // Sort orders
    orders = orders.sort((a, b) => {
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

    return orders;
  }, [
    state.viewMode,
    state.pendingOrders,
    state.branchOrders,
    state.filters,
    state.sortField,
    state.sortDirection
  ]);

  // Update filtered orders and pagination when filters change
  useEffect(() => {
    const filtered = applyFilters;
    const totalPages = Math.ceil(filtered.length / state.pagination.itemsPerPage);
    
    setState(prev => ({
      ...prev,
      filteredOrders: filtered,
      pagination: {
        ...prev.pagination,
        totalItems: filtered.length,
        totalPages,
        currentPage: Math.min(prev.pagination.currentPage, Math.max(1, totalPages))
      }
    }));
  }, [applyFilters, state.pagination.itemsPerPage]);

  // Get paginated orders
  const getPaginatedOrders = () => {
    const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const endIndex = startIndex + state.pagination.itemsPerPage;
    return state.filteredOrders.slice(startIndex, endIndex);
  };

  // Filter update handlers
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      },
      pagination: {
        ...prev.pagination,
        currentPage: 1 // Reset to first page when filtering
      }
    }));
  };

  const updateNestedFilter = (key: keyof FilterOptions, nestedKey: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: {
          ...prev.filters[key],
          [nestedKey]: value
        }
      },
      pagination: {
        ...prev.pagination,
        currentPage: 1
      }
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        search: '',
        status: 'all',
        dateRange: { start: '', end: '' },
        priceRange: { min: null, max: null },
        orderType: '',
        customerName: '',
        tableName: ''
      },
      pagination: {
        ...prev.pagination,
        currentPage: 1
      }
    }));
  };

  // Pagination handlers
  const changePage = (page: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        currentPage: Math.max(1, Math.min(page, prev.pagination.totalPages))
      }
    }));
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        itemsPerPage,
        currentPage: 1
      }
    }));
  };

  // Existing handlers (abbreviated for space - include all your existing handlers here)
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

  const switchViewMode = (mode: 'pending' | 'branch') => {
    setState(prev => ({ 
      ...prev, 
      viewMode: mode,
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
    clearFilters();
    if (mode === 'pending') {
      fetchPendingOrders();
    } else {
      fetchBranchOrders();
    }
  };

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
        return [];
      default:
        return [];
    }
  };

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
    setState(prev => ({ ...prev, showDetailsModal: true, selectedOrder: order as unknown as Order }));
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

  // Initial fetch on mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const ordersToDisplay = getPaginatedOrders();
  const hasActiveFilters = state.filters.search || 
    state.filters.status !== 'all' || 
    state.filters.dateRange.start || 
    state.filters.dateRange.end ||
    state.filters.priceRange.min !== null ||
    state.filters.priceRange.max !== null ||
    state.filters.customerName ||
    state.filters.tableName ||
    state.filters.orderType;

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
        </div>

        {/* Enhanced Filtering Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('ordersManager.searchPlaceholder') || 'Search orders...'}
                value={state.filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter (only for branch orders) */}
            {state.viewMode === 'branch' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                title='filter'
                  value={state.filters.status}
                  onChange={(e) => updateFilter('status', e.target.value === 'all' ? 'all' : parseInt(e.target.value) as OrderStatus)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Date Range Start */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="Start Date"
                value={state.filters.dateRange.start}
                onChange={(e) => updateNestedFilter('dateRange', 'start', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range End */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="End Date"
                value={state.filters.dateRange.end}
                onChange={(e) => updateNestedFilter('dateRange', 'end', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setState(prev => ({ ...prev, showAdvancedFilters: !prev.showAdvancedFilters }))}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              <Filter className="w-4 h-4 mr-2" />
              {state.showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              {state.showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </button>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {state.filteredOrders.length} of {state.viewMode === 'pending' ? state.pendingOrders.length : state.branchOrders.length} orders
              </span>
            </div>
          </div>

          {/* Advanced Filters */}
          {state.showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Customer Name Filter */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={state.filters.customerName}
                    onChange={(e) => updateFilter('customerName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Table Name Filter */}
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Table Name"
                    value={state.filters.tableName}
                    onChange={(e) => updateFilter('tableName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Order Type Filter */}
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Order Type"
                    value={state.filters.orderType}
                    onChange={(e) => updateFilter('orderType', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Range Min */}
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={state.filters.priceRange.min || ''}
                    onChange={(e) => updateNestedFilter('priceRange', 'min', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Range Max */}
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={state.filters.priceRange.max || ''}
                    onChange={(e) => updateNestedFilter('priceRange', 'max', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary and Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((state.pagination.currentPage - 1) * state.pagination.itemsPerPage) + 1} to{' '}
              {Math.min(state.pagination.currentPage * state.pagination.itemsPerPage, state.pagination.totalItems)} of{' '}
              {state.pagination.totalItems} orders
            </div>
            
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select
              title='pagination'
                value={state.pagination.itemsPerPage}
                onChange={(e) => changeItemsPerPage(parseInt(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(state.pagination.currentPage - 1)}
              disabled={state.pagination.currentPage <= 1}
              className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const totalPages = state.pagination.totalPages;
                const currentPage = state.pagination.currentPage;
                const pages = [];
                
                // Always show first page
                if (totalPages > 0) {
                  pages.push(1);
                }

                // Add ellipsis and current page area
                if (currentPage > 3) {
                  pages.push('...');
                }

                // Show current page and surrounding pages
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  if (!pages.includes(i)) {
                    pages.push(i);
                  }
                }

                // Add ellipsis and last page
                if (currentPage < totalPages - 2) {
                  if (!pages.includes('...')) {
                    pages.push('...');
                  }
                }

                if (totalPages > 1 && !pages.includes(totalPages)) {
                  pages.push(totalPages);
                }

                return pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? changePage(page) : null}
                    disabled={typeof page !== 'number'}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : typeof page === 'number'
                        ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : 'text-gray-400 dark:text-gray-500 cursor-default'
                    }`}
                  >
                    {page}
                  </button>
                ));
              })()}
            </div>

            <button
              onClick={() => changePage(state.pagination.currentPage + 1)}
              disabled={state.pagination.currentPage >= state.pagination.totalPages}
              className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
                  {hasActiveFilters 
                    ? 'No orders match your current filters'
                    : t('ordersManager.noOrders', { viewMode: state.viewMode === 'pending' ? t('ordersManager.pendingOrders').toLowerCase() : t('ordersManager.branchOrders').toLowerCase() })
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
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
                                      e.target.value = status.toString();
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

        {/* All your existing modals remain the same */}
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

        {/* Details Modal - keeping your existing implementation */}
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

            

                  {/* Order Status for Branch Orders */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('ordersManager.status')}
                    </label>
                    {(() => {
                      const status = state.viewMode === 'branch' 
                        ? orderService.parseOrderStatus((state.selectedOrder as unknown as BranchOrder).status)
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
                    const regularNotes = notesLines.filter((line: string | string[]) => !line.includes('[METADATA:')).join('\n').trim();
                    const metadataLine = notesLines.find((line: string | string[]) => line.includes('[METADATA:'));
                    
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
                      <div className="space-y-4 max-h-84 overflow-y-auto">
                        {renderItems(items)}
                        
                        {/* Order Total */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                           <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              {t('ordersManager.subTotal')}:
                            </span>
                            
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {state.selectedOrder.subTotal?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              {t('ordersManager.serviceFeeApplied')}:
                            </span>
                            
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {state.selectedOrder.serviceFeeApplied?.toFixed(2)}
                            </span>
                          </div>
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