import { useState, useCallback } from 'react';
import { ActiveMoneyCase, MoneyCaseHistoryItem, QuickSummary, ZReport } from '../../types/BranchManagement/MoneyCase';
import { moneyCaseService } from '../../services/Branch/MoneyCaseService';
import { branchService } from '../../services/Branch/BranchService';

interface Branch {
  branchId: number;
  branchName: string;
}

interface MoneyCaseState {
  // Branch Management
  branches: Branch[];
  selectedBranch: Branch | null;
  isBranchDropdownOpen: boolean;

  // Money Case Data
  activeCase: ActiveMoneyCase | null;
  history: MoneyCaseHistoryItem[];
  quickSummary: QuickSummary | null;
  selectedCase: MoneyCaseHistoryItem | null;
  zReport: ZReport | null;

  // UI States
  loading: boolean;
  error: string | null;
  success: string | null;

  // Modals
  showOpenModal: boolean;
  showCloseModal: boolean;
  showZReportModal: boolean;
  showSummaryModal: boolean;

  // Form Data
  openingBalance: number;
  actualCash: number;
  closingNotes: string;

  // Filters & Pagination
  filters: {
    fromDate: string;
    toDate: string;
    status: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

const initialState: MoneyCaseState = {
  branches: [],
  selectedBranch: null,
  isBranchDropdownOpen: false,
  activeCase: null,
  history: [],
  quickSummary: null,
  selectedCase: null,
  zReport: null,
  loading: false,
  error: null,
  success: null,
  showOpenModal: false,
  showCloseModal: false,
  showZReportModal: false,
  showSummaryModal: false,
  openingBalance: 0,
  actualCash: 0,
  closingNotes: '',
  filters: {
    fromDate: '',
    toDate: '',
    status: ''
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }
};

export const useMoneyCaseManager = () => {
  const [state, setState] = useState<MoneyCaseState>(initialState);

  // Fetch branches using branchService and auto-select first branch
  const fetchBranches = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const branchData = await branchService.getBranches();
      
      // Transform BranchData[] to Branch[] format
      const branches: Branch[] = branchData.map(branch => ({
        branchId: branch.branchId,
        branchName: branch.branchName
      }));
      
      // Auto-select first branch if available
      const firstBranch = branches.length > 0 ? branches[0] : null;
      
      setState(prev => ({ 
        ...prev, 
        branches, 
        selectedBranch: firstBranch, // Automatically select first branch
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to fetch branches',
        loading: false 
      }));
    }
  }, []);

  // Handle branch selection
  const handleBranchSelect = useCallback((branch: Branch) => {
    setState(prev => ({ 
      ...prev, 
      selectedBranch: branch,
      isBranchDropdownOpen: false 
    }));
  }, []);

  // Fetch active money case
  const fetchActiveCase = useCallback(async (branchId?: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const activeCase = await moneyCaseService.getActiveMoneyCase(branchId);
      setState(prev => ({ ...prev, activeCase, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to fetch active case',
        loading: false,
        activeCase: null
      }));
    }
  }, []);

  // Fetch quick summary
  const fetchQuickSummary = useCallback(async (branchId?: number) => {
    try {
      const quickSummary = await moneyCaseService.getQuickSummary(branchId);
      setState(prev => ({ ...prev, quickSummary }));
    } catch (error: any) {
      console.error('Failed to fetch quick summary:', error);
    }
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async (branchId?: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await moneyCaseService.getMoneyCaseHistory({
        branchId,
        fromDate: state.filters.fromDate || undefined,
        toDate: state.filters.toDate || undefined,
        pageSize: state.pagination.itemsPerPage
      });
      
      setState(prev => ({ 
        ...prev, 
        history: response.items || [],
        pagination: {
          ...prev.pagination,
          totalItems: response.totalCount || 0
        },
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to fetch history',
        loading: false 
      }));
    }
  }, [state.filters, state.pagination.itemsPerPage]);

  // Open money case
  const handleOpenCase = useCallback(async () => {
    if (!state.selectedBranch) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await moneyCaseService.openMoneyCase({
        branchId: state.selectedBranch.branchId,
        openingBalance: state.openingBalance
      });
      
      setState(prev => ({ 
        ...prev, 
        activeCase: result,
        showOpenModal: false,
        loading: false,
        success: 'Money case opened successfully!',
        openingBalance: 0
      }));

      // Refresh data
      await fetchQuickSummary(state.selectedBranch.branchId);
      await fetchHistory(state.selectedBranch.branchId);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to open case',
        loading: false 
      }));
    }
  }, [state.selectedBranch, state.openingBalance, fetchQuickSummary, fetchHistory]);

  // Close money case
// Close money case
// In useMoneyCaseManager.ts, update error handling:

const handleCloseCase = useCallback(async () => {
  if (!state.selectedBranch) {
    setState(prev => ({ 
      ...prev, 
      error: 'Please select a branch first' 
    }));
    return;
  }
  
  if (state.actualCash === undefined || state.actualCash === null) {
    setState(prev => ({ 
      ...prev, 
      error: 'Please enter actual cash amount' 
    }));
    return;
  }
  
  setState(prev => ({ ...prev, loading: true, error: null }));
  try {
    const result = await moneyCaseService.closeMoneyCase({
      branchId: state.selectedBranch.branchId,
      actualCash: state.actualCash,
      notes: state.closingNotes
    });
    
    console.log('Close money case result:', result);
    
    // Safely access difference with multiple fallbacks
    const difference = result?.difference ?? result?.discrepancy ?? 0;
    const formattedDifference = typeof difference === 'number' 
      ? difference.toFixed(2) 
      : '0.00';
    
    setState(prev => ({ 
      ...prev, 
      activeCase: null,
      showCloseModal: false,
      loading: false,
      success: `Money case closed successfully! Difference: $${formattedDifference}`,
      actualCash: 0,
      closingNotes: ''
    }));

    // Refresh data
    if (state.selectedBranch) {
      await Promise.all([
        fetchQuickSummary(state.selectedBranch.branchId),
        fetchHistory(state.selectedBranch.branchId),
        fetchActiveCase(state.selectedBranch.branchId)
      ]);
    }

    // Clear success message after 5 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, success: null }));
    }, 5000);
  } catch (error: any) {
    console.error('Error closing money case:', error);
    setState(prev => ({ 
      ...prev, 
      error: error.message || 'Failed to close case',
      loading: false 
    }));
  }
}, [state.selectedBranch, state.actualCash, state.closingNotes, fetchQuickSummary, fetchHistory, fetchActiveCase]);

  // Fetch Z Report
  const fetchZReport = useCallback(async (moneyCaseId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const zReport = await moneyCaseService.getZReport(moneyCaseId);
      setState(prev => ({ 
        ...prev, 
        zReport,
        showZReportModal: true,
        loading: false 
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to fetch Z report',
        loading: false 
      }));
    }
  }, []);

  // Modal controls
  const openOpenModal = useCallback(() => {
    setState(prev => ({ ...prev, showOpenModal: true }));
  }, []);

  const openCloseModal = useCallback(() => {
    setState(prev => ({ ...prev, showCloseModal: true }));
  }, []);

  const closeModals = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showOpenModal: false,
      showCloseModal: false,
      showZReportModal: false,
      showSummaryModal: false,
      error: null
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
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
  };
};