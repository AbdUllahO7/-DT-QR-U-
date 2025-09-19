'use client';

import React, {  useEffect } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside } from '../../../../hooks';
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

const OrdersManagerRestaurant: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const lang = language;

  // Custom hooks for state management
  const {
    state,
    actions: {
      fetchBranches,
      handleBranchSelect,
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
      setState,
      handleCancelOrder,
      openCancelModal
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

  // Dropdown ref for click outside
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setState(prev => ({ ...prev, isBranchDropdownOpen: false })));

  // Initial fetch on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch orders when branch is selected
  useEffect(() => {
    if (state.selectedBranch) {
      if (state.viewMode === 'pending') {
        fetchPendingOrders();
      } else {
        fetchBranchOrders();
      }
    }
  }, [state.selectedBranch]);

  const toggleBranchDropdown = () => {
    setState(prev => ({ 
      ...prev, 
      isBranchDropdownOpen: !prev.isBranchDropdownOpen 
    }));
  };

  const handleBranchSelectInternal = (branch: any) => {
    handleBranchSelect(branch);
  };

  // Show branch selection if no branch is selected
  if (!state.selectedBranch && !state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                {t('orders.selectBranch')}
              </p>
              
              {/* Branch Selector */}
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={toggleBranchDropdown}
                  className={`flex items-center justify-between min-w-[250px] px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    {t('orders.selectBranchToView')}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${state.isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-3' : 'ml-3'}`} />
                </button>

                {state.isBranchDropdownOpen && (
                  <div className={`absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                    {state.branches.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('orders.noBranches')}
                      </div>
                    ) : (
                      state.branches.map(branch => (
                        <button
                          key={branch.branchId}
                          onClick={() => handleBranchSelectInternal(branch)}
                          className={`w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {branch.branchName}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Branch Selector */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <OrdersHeader t={t} />
          
          {/* Branch Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleBranchDropdown}
              className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('orders.branchSelector')}
            >
              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {state.selectedBranch ? state.selectedBranch.branchName : t('orders.selectBranch')}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${state.isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </button>

            {state.isBranchDropdownOpen && (
              <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                {state.branches.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('orders.noBranches')}
                  </div>
                ) : (
                  state.branches.map(branch => (
                    <button
                      key={branch.branchId}
                      onClick={() => handleBranchSelectInternal(branch)}
                      className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        state.selectedBranch?.branchId === branch.branchId
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {branch.branchName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

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
          onOpenCancel={openCancelModal}
          onClearFilters={clearFilters}
          t={t}
        />

        <CancelModal
          show={state.showCancelModal}
          loading={state.loading}
          onCancel={handleCancelOrder}
          onClose={closeModals}
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

export default OrdersManagerRestaurant;