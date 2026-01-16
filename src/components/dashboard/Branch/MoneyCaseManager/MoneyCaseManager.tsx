'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Users, Calendar, Filter, X, Check } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useCurrency } from '../../../../hooks/useCurrency';
import { useMoneyCaseManager } from '../../../../hooks/useMoneyCaseManager/useMoneyCaseManager';
import { useClickOutside } from '../../../../hooks';
import CloseMoneyCaseModal from './CloseMoneyCaseModal';
import MoneyCaseHeader from './MoneyCaseHeader';
import QuickSummaryCards from './QuickSummaryCards';
import MoneyCaseActions from './MoneyCaseActions';
import ZReportModal from './ZReportModal';
import OpenMoneyCaseModal from './OpenMoneyCaseModal';
import MoneyCaseHistoryTable from './MoneyCaseHistoryTable';
import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';
import { MoneyCaseSummary, PreviousCloseInfo, BranchSummaryParams } from '../../../../types/BranchManagement/MoneyCase';
import { moneyCaseService } from '../../../../services/Branch/MoneyCaseService';
import MoneyCaseSummaryCard from './MoneyCaseSummaryCard';

/**
 * Format date for input fields (YYYY-MM-DD)
 */
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Date preset options
 */
const getDatePresets = (t: any) => [
  {
    label: t('moneyCase.filters.today'),
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        fromDate: today.toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
      };
    }
  },
  {
    label: t('moneyCase.filters.yesterday'),
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return {
        fromDate: yesterday.toISOString().split('T')[0],
        toDate: yesterday.toISOString().split('T')[0]
      };
    }
  },
  {
    label: t('moneyCase.filters.last7Days'),
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return {
        fromDate: start.toISOString().split('T')[0],
        toDate: end.toISOString().split('T')[0]
      };
    }
  },
  {
    label: t('moneyCase.filters.last30Days'),
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return {
        fromDate: start.toISOString().split('T')[0],
        toDate: end.toISOString().split('T')[0]
      };
    }
  },
  {
    label: t('moneyCase.filters.thisMonth'),
    getValue: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        fromDate: start.toISOString().split('T')[0],
        toDate: today.toISOString().split('T')[0]
      };
    }
  },
  {
    label: t('moneyCase.filters.lastMonth'),
    getValue: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        fromDate: start.toISOString().split('T')[0],
        toDate: end.toISOString().split('T')[0]
      };
    }
  }
];

interface MoneyCaseManagerProps {
  branchId?: number;
}

const MoneyCaseManager: React.FC<MoneyCaseManagerProps> = ({ branchId }) => {
  const { t, isRTL } = useLanguage();
  const currency = useCurrency();

  const {
    state,
    actions: {
      fetchBranches,
      handleBranchSelect,
      fetchActiveCase,
      fetchQuickSummary,
      fetchHistory,
      handleOpenCase,
      handleCloseCase,
      fetchZReport,
      openOpenModal,
      openCloseModal,
      closeModals,
      clearError,
      setState
    }
  } = useMoneyCaseManager();

  // Dropdown ref for click outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => 
    setState(prev => ({ ...prev, isBranchDropdownOpen: false }))
  );

  // Summary state
  const [showSummary, setShowSummary] = useState(false);
  const [branchSummary, setBranchSummary] = useState<MoneyCaseSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [previousCloseInfo, setPreviousCloseInfo] = useState<PreviousCloseInfo | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default: last 30 days
    return formatDateForInput(date);
  });
  const [toDate, setToDate] = useState<string>(() => {
    return formatDateForInput(new Date()); // Default: today
  });
  const [appliedFilters, setAppliedFilters] = useState<BranchSummaryParams>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return {
      fromDate: date.toISOString(),
      toDate: new Date().toISOString()
    };
  });
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(true); // True by default since we have default dates

  // Initial fetch on mount
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Fetch data when branch is selected
  useEffect(() => {
    if (state.selectedBranch) {
      const branchId = state.selectedBranch.branchId;
      fetchActiveCase(branchId);
      fetchQuickSummary(branchId);
      fetchHistory(branchId);
    }
  }, [state.selectedBranch, fetchActiveCase, fetchQuickSummary, fetchHistory]);

  const fetchBranchSummary = async () => {
    if (!state.selectedBranch) return;

    try {
      setSummaryLoading(true);
      const summary = await moneyCaseService.getBranchSummary({
        branchId: state.selectedBranch.branchId,
        ...appliedFilters
      });
      setBranchSummary(summary);
    } catch (error: any) {
      console.error('Failed to fetch branch summary:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch branch summary'
      }));
    } finally {
      setSummaryLoading(false);
    }
  };

  const toggleBranchDropdown = () => {
    setState(prev => ({ 
      ...prev, 
      isBranchDropdownOpen: !prev.isBranchDropdownOpen 
    }));
  };

  const handleShowOpenModal = async () => {
    if (!state.selectedBranch) return;

    try {
      const info = await moneyCaseService.getPreviousCloseInfo(state.selectedBranch.branchId);
      setPreviousCloseInfo(info);

      const suggestedBalance = info?.suggestedOpeningBalance || 0;
      setState(prev => ({
        ...prev,
        openingBalance: suggestedBalance,
        showOpenModal: true,
        error: null // Clear any previous errors when opening modal
      }));
    } catch (error: any) {
      console.error("Failed to get previous close info", error);
      setPreviousCloseInfo(null);
      setState(prev => ({
        ...prev,
        openingBalance: 0,
        showOpenModal: true,
        error: error.message || 'Failed to get previous close information'
      }));
    }
  };

  const handleToggleSummary = () => {
    const newShowState = !showSummary;
    setShowSummary(newShowState);
    if (newShowState) {
      fetchBranchSummary();
    }
  };

  const handleApplyFilters = () => {
    const filters: BranchSummaryParams = {};
    
    if (fromDate) {
      filters.fromDate = new Date(fromDate).toISOString();
    }
    if (toDate) {
      filters.toDate = new Date(toDate).toISOString();
    }

    setAppliedFilters(filters);
    setHasActiveFilters(fromDate !== '' || toDate !== '');
    setShowFilters(false);
    
    // Auto-refresh if summary is visible
    if (showSummary) {
      fetchBranchSummary();
    }
  };

  const handleClearFilters = () => {
    // Reset to default (last 30 days)
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const defaultFromDate = formatDateForInput(date);
    const defaultToDate = formatDateForInput(new Date());
    
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    
    setAppliedFilters({
      fromDate: new Date(defaultFromDate).toISOString(),
      toDate: new Date(defaultToDate).toISOString()
    });
    setHasActiveFilters(true); // Still active with default dates
    
    // Auto-refresh if summary is visible
    if (showSummary) {
      fetchBranchSummary();
    }
  };

  const handlePresetSelect = (preset: any) => {
    const dates = preset.getValue();
    setFromDate(dates.fromDate);
    setToDate(dates.toDate);
  };

  // Show branch selection if no branch is selected
  if (!state.selectedBranch && !state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <span className=''>{currency.symbol}</span>

              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                {t('moneyCase.selectBranch') || 'Select a branch to manage money case'}
              </p>
              
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={toggleBranchDropdown}
                  className={`flex items-center justify-between min-w-[250px] px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    {t('moneyCase.selectBranchToView') || 'Select Branch'}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      state.isBranchDropdownOpen ? 'transform rotate-180' : ''
                    } ${isRTL ? 'mr-3' : 'ml-3'}`} 
                  />
                </button>

                {state.isBranchDropdownOpen && (
                  <div className={`absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                    {state.branches.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('moneyCase.noBranches') || 'No branches available'}
                      </div>
                    ) : (
                      state.branches.map(branch => (
                        <button
                          key={branch.branchId}
                          onClick={() => handleBranchSelect(branch)}
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
        <div className={`flex flex-wrap justify-center items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MoneyCaseHeader t={t} />
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleBranchDropdown}
              className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('moneyCase.branchSelector')}
            >
              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {state.selectedBranch ? state.selectedBranch.branchName : t('moneyCase.selectBranch')}
              </span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  state.isBranchDropdownOpen ? 'transform rotate-180' : ''
                } ${isRTL ? 'mr-2' : 'ml-2'}`} 
              />
            </button>

            {state.isBranchDropdownOpen && (
              <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                {state.branches.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('moneyCase.noBranches')}
                  </div>
                ) : (
                  state.branches.map(branch => (
                    <button
                      key={branch.branchId}
                      onClick={() => handleBranchSelect(branch)}
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

        {/* Notifications */}
        <ErrorNotification error={state.error} onClose={clearError} />
        <SuccessNotification message={state.success} />

        {/* Quick Summary Cards */}
        <QuickSummaryCards
          quickSummary={state.quickSummary}
          activeCase={state.activeCase}
          loading={state.loading}
          t={t}
          isRTL={isRTL}
          currencySymbol={currency.symbol}
        />

        {/* Branch Summary Section with Enhanced Filtering */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={handleToggleSummary}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
                <span className=''>{currency.symbol}</span>

              {showSummary ? t('moneyCase.hideSummary') : t('moneyCase.showSummary')}
            </button>

            {showSummary && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  hasActiveFilters
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Filter className="h-4 w-4" />
                {t('moneyCase.filters.title')}
                {hasActiveFilters && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-500 text-white rounded-full">
                    !
                  </span>
                )}
              </button>
            )}
          </div>

          {showSummary && (
            <div className="space-y-4">
              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      {t('moneyCase.filters.title')}
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Date Presets */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {t('moneyCase.filters.quickSelect')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {getDatePresets(t).map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handlePresetSelect(preset)}
                          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {t('moneyCase.filters.fromDate')}
                      </label>
                      <input
                      title='From Date'
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        max={toDate || undefined}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {t('moneyCase.filters.toDate')}
                      </label>
                      <input
                      title='To Date'
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate || undefined}
                        max={formatDateForInput(new Date())}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Check className="h-4 w-4" />
                      {t('moneyCase.filters.apply')}
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <X className="h-4 w-4" />
                      {t('moneyCase.filters.clear')}
                    </button>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('moneyCase.filters.active')}:
                  </span>
                  {fromDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                      <Calendar className="h-3 w-3" />
                      {t('moneyCase.filters.from')}: {new Date(fromDate).toLocaleDateString()}
                    </span>
                  )}
                  {toDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                      <Calendar className="h-3 w-3" />
                      {t('moneyCase.filters.to')}: {new Date(toDate).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    {t('moneyCase.filters.clearAll')}
                  </button>
                </div>
              )}

              {/* Summary Info Text */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.showingDataFor')} 
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {' '}{state.selectedBranch?.branchName}{' '}
                  </span>
                  {t('moneyCase.from')}{' '}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toLocaleDateString() : '-'}
                  </span>
                  {' '}{t('moneyCase.to')}{' '}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {appliedFilters.toDate ? new Date(appliedFilters.toDate).toLocaleDateString() : '-'}
                  </span>
                </p>
              </div>

              {/* Summary Card */}
              <MoneyCaseSummaryCard
                summary={branchSummary}
                loading={summaryLoading}
                t={t}
                isRTL={isRTL}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <MoneyCaseActions
          activeCase={state.activeCase}
          loading={state.loading}
          onOpenCase={handleShowOpenModal}
          onCloseCase={openCloseModal}
          t={t}
          isRTL={isRTL}
        />

        {/* History Table */}
        <MoneyCaseHistoryTable
          history={state.history}
          loading={state.loading}
          onViewZReport={fetchZReport}
          t={t}
          isRTL={isRTL}
          branchName={state.selectedBranch?.branchName}
          fromDate={fromDate}
          toDate={toDate}
        />

        {/* Modals */}
        <OpenMoneyCaseModal
          previousCloseInfo={previousCloseInfo}
          show={state.showOpenModal}
          loading={state.loading}
          openingBalance={state.openingBalance}
          onOpeningBalanceChange={(value) =>
            setState(prev => ({ ...prev, openingBalance: value }))
          }
          onConfirm={handleOpenCase}
          onClose={closeModals}
          t={t}
          isRTL={isRTL}
          error={state.showOpenModal ? state.error : null}
        />

        <CloseMoneyCaseModal
          show={state.showCloseModal}
          loading={state.loading}
          activeCase={state.activeCase}
          actualCash={state.actualCash}
          closingNotes={state.closingNotes}
          onActualCashChange={(value) =>
            setState(prev => ({ ...prev, actualCash: value }))
          }
          onNotesChange={(value) =>
            setState(prev => ({ ...prev, closingNotes: value }))
          }
          onConfirm={handleCloseCase}
          onClose={closeModals}
          t={t}
          isRTL={isRTL}
          error={state.showCloseModal ? state.error : null}
        />

        <ZReportModal
          show={state.showZReportModal}
          zReport={state.zReport}
          loading={state.loading}
          onClose={closeModals}
          t={t}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
};

export default MoneyCaseManager;