import { useMemo } from 'react';
import { FilterOptions, OrdersManagerState } from '../types/Orders/type';
import { BranchOrder } from '../types/BranchManagement/type';
import { orderService } from '../services/Branch/OrderService';


export const useFiltering = (
  state: OrdersManagerState,
  setState: React.Dispatch<React.SetStateAction<OrdersManagerState>>
) => {
  // Smart filtering function
  const filteredOrders = useMemo(() => {
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

  // Check if any filters are active
  const hasActiveFilters = state.filters.search || 
    state.filters.status !== 'all' || 
    state.filters.dateRange.start || 
    state.filters.dateRange.end ||
    state.filters.priceRange.min !== null ||
    state.filters.priceRange.max !== null ||
    state.filters.customerName ||
    state.filters.tableName ||
    state.filters.orderType;

  return {
    filteredOrders,
    updateFilter,
    updateNestedFilter,
    clearFilters,
    hasActiveFilters
  };
};