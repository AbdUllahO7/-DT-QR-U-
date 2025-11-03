'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Users, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
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
import { MoneyCaseSummary } from '../../../../types/BranchManagement/MoneyCase';
import { moneyCaseService } from '../../../../services/Branch/MoneyCaseService';
import MoneyCaseSummaryCard from './MoneyCaseSummaryCard';


const MoneyCaseManager: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

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


  const [showSummary, setShowSummary] = useState(false);
const [branchSummary, setBranchSummary] = useState<MoneyCaseSummary | null>(null);

const fetchBranchSummary = async () => {
  if (!state.selectedBranch) return;
  
  try {
    const summary = await moneyCaseService.getBranchSummary({
      branchId: state.selectedBranch.branchId,
      fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      toDate: new Date().toISOString()
    });
    setBranchSummary(summary);
  } catch (error) {
    console.error('Failed to fetch branch summary:', error);
  }
};

  const toggleBranchDropdown = () => {
    setState(prev => ({ 
      ...prev, 
      isBranchDropdownOpen: !prev.isBranchDropdownOpen 
    }));
  };

  // Show branch selection if no branch is selected
  if (!state.selectedBranch && !state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                {t('moneyCase.selectBranch') || 'Select a branch to manage money case'}
              </p>
              
              {/* Branch Selector */}
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
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MoneyCaseHeader t={t} />
          
          {/* Branch Selector */}
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
        />
        <button
            onClick={() => {
                setShowSummary(!showSummary);
                if (!showSummary) fetchBranchSummary();
              }}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {showSummary ? 'Hide' : 'Show'} Summary
            </button>

            {showSummary && (
              <MoneyCaseSummaryCard
                summary={branchSummary}
                loading={false}
                t={t}
                isRTL={isRTL}
              />
            )}

        {/* Action Buttons */}
        <MoneyCaseActions
          activeCase={state.activeCase}
          loading={state.loading}
          onOpenCase={openOpenModal}
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
        />

        {/* Modals */}
        <OpenMoneyCaseModal
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