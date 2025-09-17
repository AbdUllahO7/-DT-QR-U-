import { useEffect, useMemo } from 'react';
import { BranchOrder, PendingOrder } from '../types/BranchManagement/type';
import { OrdersManagerState, PaginationState } from '../types/Orders/type';

export const usePagination = (
  filteredOrders: (PendingOrder | BranchOrder)[],
  pagination: PaginationState,
  setState: React.Dispatch<React.SetStateAction<OrdersManagerState>>
) => {
  // Update pagination state when filtered orders change
  useEffect(() => {
    const totalPages = Math.ceil(filteredOrders.length / pagination.itemsPerPage);
    
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        totalItems: filteredOrders.length,
        totalPages,
        currentPage: Math.min(prev.pagination.currentPage, Math.max(1, totalPages))
      },
      // Update filtered orders in state
      filteredOrders: filteredOrders
    }));
  }, [filteredOrders, pagination.itemsPerPage, setState]);

  // Get paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, pagination.currentPage, pagination.itemsPerPage]);

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

  return {
    paginatedOrders,
    changePage,
    changeItemsPerPage
  };
};