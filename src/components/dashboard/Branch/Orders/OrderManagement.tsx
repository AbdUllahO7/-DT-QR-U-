'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useOrdersManager } from '../../../../hooks/useOrdersManager';
import { useFiltering } from '../../../../hooks/useFiltering';
import { usePagination } from '../../../../hooks/usePagination';
import OrdersHeader from './OrdersHeader';
import ViewModeToggle from './ViewModeToggle';
import FilterSection from './FilterSection';
import PaginationControls from './PaginationControls';
import ErrorNotification from './ErrorNotification';
import ConfirmModal from './ConfirmModal';
import RejectModal from './RejectModal';
import StatusModal from './StatusModal';
import OrderDetailsModal from './OrderDetailsModal';
import SuccessNotification from './SuccessNotification';
import OrdersTable from './OrdersTable';
import CancelModal from './CancelModal';

interface OrdersManagerProps {
  branchId?: number;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ branchId }) => {
  const { t, language } = useLanguage();
  const lang = language;
  const intervalRef = useRef<number | null>(null);

  // Custom hooks for state management
  const {
    state,
    actions: {
      fetchPendingOrders,
      handleConfirmOrder,
      handleRejectOrder,
      handleCancelOrder,
      handleUpdateStatus,
      switchViewMode,
      openConfirmModal,
      openRejectModal,
      openCancelModal,
      openStatusModal,
      openDetailsModal,
      closeModals,
      toggleRowExpansion,
      handleSort,
      fetchBranchOrders,
      handlePendingPageChange,
      handlePendingItemsPerPageChange,
      handleBranchPageChange,
      handleBranchItemsPerPageChange,
      setState
    }
  } = useOrdersManager();

  // Client-side filtering only for pending orders (now disabled since we use server-side pagination)
  const {
    filteredOrders,
    updateFilter,
    updateNestedFilter,
    clearFilters,
    hasActiveFilters
  } = useFiltering(state, setState);

  // Refs to track what's been fetched to prevent duplicates
  const fetchedInitially = useRef(false);
  const isFetchingRef = useRef(false);
  const lastFetchedConfig = useRef<{viewMode: string, page: number, pageSize: number} | null>(null);

  // Determine which orders to display and which handlers to use based on view mode
  // Now both modes use server-side pagination
  const displayOrders = state.viewMode === 'branch'
    ? state.branchOrders
    : state.pendingOrders;

  const displayTotalFiltered = state.pagination.totalItems;

  const handlePageChangeInternal = state.viewMode === 'branch'
    ? handleBranchPageChange
    : handlePendingPageChange;

  const handleItemsPerPageChangeInternal = state.viewMode === 'branch'
    ? handleBranchItemsPerPageChange
    : handlePendingItemsPerPageChange;

  // Initial fetch on mount - only once
  useEffect(() => {
    if (!fetchedInitially.current) {
      fetchedInitially.current = true;
      fetchPendingOrders();
      // Don't fetch branch orders here - let the main effect handle it
    }
  }, []); // Run only once on mount

  // Main fetch effect - handles view mode and pagination changes
  useEffect(() => {
   

    // Skip if already fetching
    if (isFetchingRef.current) {
      return;
    }

    const currentConfig = {
      viewMode: state.viewMode,
      page: state.pagination.currentPage,
      pageSize: state.pagination.itemsPerPage
    };

    // Check if this exact configuration has already been fetched
    if (lastFetchedConfig.current &&
        lastFetchedConfig.current.viewMode === currentConfig.viewMode &&
        lastFetchedConfig.current.page === currentConfig.page &&
        lastFetchedConfig.current.pageSize === currentConfig.pageSize) {
      return;
    }

    
    // Set fetching flag BEFORE updating ref
    isFetchingRef.current = true;
    lastFetchedConfig.current = currentConfig;

    const fetchData = async () => {
      try {
        if (state.viewMode === 'pending') {
          await fetchPendingOrders(
            undefined, // branchId (for branch users, it's handled internally)
            state.pagination.currentPage,
            state.pagination.itemsPerPage
          );
        } else if (state.viewMode === 'branch') {
          await fetchBranchOrders(
            undefined, // branchId (for branch users, it's handled internally)
            state.pagination.currentPage,
            state.pagination.itemsPerPage
          );
        }
      } finally {
        // Clear fetching flag after completion
        isFetchingRef.current = false;
      }
    };

    fetchData();
  }, [
    state.viewMode,
    state.pagination.currentPage,
    state.pagination.itemsPerPage,
    fetchPendingOrders,
    fetchBranchOrders
  ]);

  // Auto-refresh pending orders every 30 seconds
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up auto-refresh if we're in pending view mode
    if (state.viewMode === 'pending') {
      intervalRef.current = window.setInterval(() => {
        fetchPendingOrders(
          undefined,
          state.pagination.currentPage,
          state.pagination.itemsPerPage
        );
      }, 30000); // 30 seconds
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.viewMode, state.pagination.currentPage, state.pagination.itemsPerPage, fetchPendingOrders]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <OrdersHeader t={t} />

        <ViewModeToggle 
          viewMode={state.viewMode}
          pendingCount={state.pendingOrders.length}
          branchCount={state.pagination.totalItems || state.branchOrders.length}
          onModeChange={switchViewMode}
          t={t}
        />

        {/* Filter Section - Only for pending orders */}
        {state.viewMode === 'pending' && (
          <FilterSection
            filters={state.filters}
            showAdvancedFilters={state.showAdvancedFilters}
            hasActiveFilters={hasActiveFilters}
            viewMode={state.viewMode}
            lang={lang}
            filteredCount={filteredOrders.length}
            totalCount={state.pendingOrders.length}
            onUpdateFilter={updateFilter}
            onUpdateNestedFilter={updateNestedFilter}
            onClearFilters={clearFilters}
            onToggleAdvanced={() => setState(prev => ({ ...prev, showAdvancedFilters: !prev.showAdvancedFilters }))}
            t={t}
          />
        )}

        <PaginationControls
          pagination={state.pagination}
          totalFiltered={displayTotalFiltered}
          onPageChange={handlePageChangeInternal}
          onItemsPerPageChange={handleItemsPerPageChangeInternal}
          t={t}
        />

        <ErrorNotification error={state.error} />

        <OrdersTable
          orders={displayOrders}
          viewMode={state.viewMode}
          loading={state.loading}
          expandedRows={state.expandedRows}
          sortField={state.sortField}
          sortDirection={state.sortDirection}
          hasActiveFilters={state.viewMode === 'pending' ? hasActiveFilters : false}
          lang={lang}
          onSort={handleSort}
          onToggleExpansion={toggleRowExpansion}
          onOpenDetails={openDetailsModal}
          onOpenConfirm={openConfirmModal}
          onOpenReject={openRejectModal}
          onOpenStatus={openStatusModal}
          onOpenCancel={openCancelModal}
          onClearFilters={clearFilters}
          t={t}
        />

        {/* Modals */}
        <ConfirmModal
          show={state.showConfirmModal}
          loading={state.loading}
          onConfirm={handleConfirmOrder}
          onClose={closeModals}
          t={t}
        />

        <RejectModal
          show={state.showRejectModal}
          loading={state.loading}
          rejectReason={state.rejectReason}
          onReasonChange={(reason) => setState(prev => ({ ...prev, rejectReason: reason }))}
          onReject={handleRejectOrder}
          onClose={closeModals}
          t={t}
        />

        <CancelModal
          show={state.showCancelModal}
          loading={state.loading}
          onCancel={handleCancelOrder}
          onClose={closeModals}
          t={t}
        />

        <StatusModal
          show={state.showStatusModal}
          loading={state.loading}
          newStatus={state.newStatus}
          lang={lang}
          onUpdate={handleUpdateStatus}
          onClose={closeModals}
          t={t}
        />

        <OrderDetailsModal
          show={state.showDetailsModal}
          order={state.selectedOrder}
          viewMode={state.viewMode}
          lang={lang}
          onClose={closeModals}
          t={t}
        />

        <SuccessNotification order={state.selectedOrder} t={t} />
      </div>
    </div>
  );
};

export default OrdersManager;