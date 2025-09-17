'use client';

import React, { useState, useEffect } from 'react';
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

const OrdersManager: React.FC = () => {
  const { t, language } = useLanguage();
  const lang = language;

  // Custom hooks for state management
  const {
    state,
    actions: {
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
    }
  } = useOrdersManager();

  const {
    filteredOrders,
    updateFilter,
    updateNestedFilter,
    clearFilters,
    hasActiveFilters
  } = useFiltering(state, setState);

  const {
    paginatedOrders,
    changePage,
    changeItemsPerPage
  } = usePagination(filteredOrders, state.pagination, setState);

  // Initial fetch on mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <OrdersHeader t={t} />

        <ViewModeToggle 
          viewMode={state.viewMode}
          pendingCount={state.pendingOrders.length}
          branchCount={state.branchOrders.length}
          onModeChange={switchViewMode}
          t={t}
        />

        <FilterSection
          filters={state.filters}
          showAdvancedFilters={state.showAdvancedFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={state.viewMode}
          lang={lang}
          filteredCount={filteredOrders.length}
          totalCount={state.viewMode === 'pending' ? state.pendingOrders.length : state.branchOrders.length}
          onUpdateFilter={updateFilter}
          onUpdateNestedFilter={updateNestedFilter}
          onClearFilters={clearFilters}
          onToggleAdvanced={() => setState(prev => ({ ...prev, showAdvancedFilters: !prev.showAdvancedFilters }))}
          t={t}
        />

        <PaginationControls
          pagination={state.pagination}
          totalFiltered={filteredOrders.length}
          onPageChange={changePage}
          onItemsPerPageChange={changeItemsPerPage}
          t={t}
        />

        <ErrorNotification error={state.error} />

        <OrdersTable
          orders={paginatedOrders}
          viewMode={state.viewMode}
          loading={state.loading}
          expandedRows={state.expandedRows}
          sortField={state.sortField}
          sortDirection={state.sortDirection}
          hasActiveFilters={hasActiveFilters}
          lang={lang}
          onSort={handleSort}
          onToggleExpansion={toggleRowExpansion}
          onOpenDetails={openDetailsModal}
          onOpenConfirm={openConfirmModal}
          onOpenReject={openRejectModal}
          onOpenStatus={openStatusModal}
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