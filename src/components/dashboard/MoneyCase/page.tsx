'use client';

// app/restaurant-summary/page.tsx
// Redesigned with dark mode, improved UI, and using the production service.
// Added Branch Selector functionality and comprehensive filtering system.
// Now using the app's native useLanguage hook.

import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronDown, Calendar, Filter, X, Check } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { branchService } from '../../../services/branchService';
import { moneyCaseService } from '../../../services/Branch/MoneyCaseService';
import type { MoneyCaseSummary, RestaurantSummaryParams } from '../../../types/BranchManagement/MoneyCase';
import { BranchData } from '../../../types/BranchManagement/type';

/**
 * A simple icon wrapper for inline SVGs.
 * This makes the SummaryCard cleaner.
 */
const CardIcon: React.FC<{ icon: 'dollar' | 'bank' | 'card' | 'cart' | 'scale' | 'clock' | 'alert' }> = ({ icon }) => {
  const iconMap = {
    dollar: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    bank: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75H3.75m0 0v-.375c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v.375m0 0v9m0 0c0 .414-.336.75-.75.75H3.75m0 0v.375c0 .621-.504-1.125-1.125 1.125H2.25m16.5 0c.621 0 1.125-.504 1.125-1.125v-.375m0 0H3.75" />
      </svg>
    ),
    card: (
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
      </svg>
    ),
    cart: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
    scale: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-1.11.128-2.27.188-3.468.188s-2.358-.06-3.468-.188m0 0A48.45 48.45 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47M4.5 19.5A48.45 48.45 0 0 1 12 19.5c2.291 0 4.545.16 6.75.47M18.75 19.03A48.416 48.416 0 0 0 12 19.5c-2.291 0-4.545-.16-6.75-.47m13.5 0c-1.11.128-2.27.188-3.468.188s-2.358-.06-3.468-.188m0 0A48.416 48.416 0 0 1 12 19.5c2.291 0 4.545.16 6.75.47" />
      </svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    alert: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  };
  
  return (
    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
      {iconMap[icon] || null}
    </div>
  );
};

/**
 * Formats a number as USD currency.
 */
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * A redesigned, reusable summary card component.
 */
const SummaryCard: React.FC<{ 
  title: string; 
  value: string; 
  description: string;
  icon: React.ComponentProps<typeof CardIcon>['icon'];
  className?: string;
}> = ({ title, value, description, icon, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl dark:hover:bg-gray-700/70 hover:-translate-y-1 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      <CardIcon icon={icon} />
    </div>
    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

/**
 * Loading state component
 */
const LoadingState: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400 p-8">
      <svg className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-medium">{t('moneyCase.loadingSummary')}</p>
      <p className="text-sm">{t('moneyCase.pleaseWait')}</p>
    </div>
  );
};

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string }> = ({ error }) => {
  const { t } = useLanguage();
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ltr:mr-4 rtl:ml-4 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
          </svg>
          <div>
            <h2 className="text-xl font-bold mb-1 text-red-800 dark:text-red-200">{t('moneyCase.dataError')}</h2>
            <p>{t('moneyCase.error.fetchSummary')}</p>
            <p className="font-mono text-sm mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * No data state component
 */
const NoDataState: React.FC = () => {
  const { t } = useLanguage();
  return (
     <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400 p-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <h2 className="text-xl font-semibold mb-1">{t('moneyCase.noData')}</h2>
      <p>{t('moneyCase.noDataDesc')}</p>
    </div>
  );
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

export default function RestaurantSummaryPage() {
  const { t, isRTL } = useLanguage();

  const [summary, setSummary] = useState<MoneyCaseSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [branches, setBranches] = useState<BranchData[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState<boolean>(false);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
  const [branchError, setBranchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState<RestaurantSummaryParams>({});
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);

  // Fetch Branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        setBranchError(null);
        const data = await branchService.getBranches();
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0]);
        }
      } catch (e: any) {
        setBranchError(e.message || t('moneyCase.error.fetchBranches'));
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, [t]);

  // Fetch Summary data when selectedBranch or appliedFilters change
  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedBranch) return;

      try {
        setLoading(true);
        setError(null);
        const data = await moneyCaseService.getRestaurantSummary(appliedFilters);
        console.log("Fetched restaurant summary:", data); 
        setSummary(data);
      } catch (e: any) {
        console.error("Failed to fetch restaurant summary:", e);
        setError(e.message || t('moneyCase.error.unknown'));
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedBranch, appliedFilters, t]);

  // Click-outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleBranchDropdown = () => {
    if (!loadingBranches) {
      setIsBranchDropdownOpen(prev => !prev);
    }
  };

  const handleBranchSelect = (branch: BranchData) => {
    setSelectedBranch(branch);
    setIsBranchDropdownOpen(false);
  };

  const handleApplyFilters = () => {
    const filters: RestaurantSummaryParams = {};
    
    if (fromDate) {
      filters.fromDate = new Date(fromDate).toISOString();
    }
    if (toDate) {
      filters.toDate = new Date(toDate).toISOString();
    }

    setAppliedFilters(filters);
    setHasActiveFilters(fromDate !== '' || toDate !== '');
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setAppliedFilters({});
    setHasActiveFilters(false);
  };

  const handlePresetSelect = (preset: any) => {
    const dates = preset.getValue();
    setFromDate(dates.fromDate);
    setToDate(dates.toDate);
  };

  if (loading && !summary) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        <LoadingState />
      </div>
    );
  }

  if (error) {
     return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        <ErrorState error={error} />
      </div>
    );
  }

  if (!summary && !loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
        <NoDataState />
      </div>
    );
  }

  const discrepancyAmount = summary?.totalDifference || 0;
  const discrepancyColorClass = discrepancyAmount < 0 
    ? 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500' 
    : discrepancyAmount > 0
    ? 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500'
    : 'border-l-4 border-green-500';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            💰 {t('moneyCase.financialOverview')}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Branch Selector */}
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                onClick={toggleBranchDropdown}
                disabled={loadingBranches}
                className={`flex items-center justify-between w-full min-w-[250px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-blue-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label={t('moneyCase.branchSelector')}
              >
                <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {loadingBranches ? t('moneyCase.loadingBranches') : selectedBranch ? selectedBranch.branchName : t('moneyCase.selectBranch')}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isBranchDropdownOpen ? 'transform rotate-180' : ''
                  } ${isRTL ? 'mr-2' : 'ml-2'}`} 
                />
              </button>

              {isBranchDropdownOpen && (
                <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                  {branchError ? (
                    <div className="px-4 py-3 text-center text-sm text-red-500 dark:text-red-400">
                      {branchError}
                    </div>
                  ) : branches.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {t('moneyCase.noBranches')}
                    </div>
                  ) : (
                    branches.map(branch => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedBranch?.branchId === branch.branchId
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
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

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
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
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
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
          <div className="mb-6 flex flex-wrap items-center gap-2">
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
          
        {/* Summary Information */}
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
          {t('moneyCase.showingResults')} <span className="font-semibold text-gray-700 dark:text-gray-200">{summary?.restaurantName || t('moneyCase.yourRestaurant')}</span> {t('moneyCase.from')} <span className="font-semibold text-gray-700 dark:text-gray-200">{summary?.fromDate ? new Date(summary.fromDate).toLocaleDateString() : '-'}</span> {t('moneyCase.to')} <span className="font-semibold text-gray-700 dark:text-gray-200">{summary?.toDate ? new Date(summary.toDate).toLocaleDateString() : '-'}</span>
        </p>
        
        {/* Summary Cards */}
        <div className={`relative transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <SummaryCard 
              title={t('moneyCase.totalRevenue')}
              value={formatCurrency(summary?.totalSales)} 
              description={t('moneyCase.grossSalesDesc')}
              icon="dollar"
            />
            <SummaryCard 
              title={t('moneyCase.netCash')}
              value={formatCurrency(summary?.totalCash)} 
              description={t('moneyCase.netCashDesc')}
              icon="bank"
            />
            <SummaryCard 
              title={t('moneyCase.serviceFee')}
              value={formatCurrency(summary?.totalCard)} 
              description={t('moneyCase.serviceFeeDesc')}
              icon="card"
            />
          </div>

          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            {t('moneyCase.operationalMetrics')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              title={t('moneyCase.totalOrders')}
              value={summary?.totalOrders.toString() || '0'} 
              description={t('moneyCase.totalOrdersDesc')}
              icon="cart"
            />
            <SummaryCard 
              title={t('moneyCase.avgOrderValue')}
              value={formatCurrency(summary?.averageOrderValue)} 
              description={t('moneyCase.avgOrderValueDesc')}
              icon="scale"
            />
            <SummaryCard 
              title={t('moneyCase.totalShifts')}
              value={summary?.totalCases.toString() || '0'} 
              description={t('moneyCase.totalShiftsDesc')}
              icon="clock"
            />
            <SummaryCard 
              title={t('moneyCase.cashDiscrepancy')}
              value={formatCurrency(summary?.totalDifference)} 
              description={t('moneyCase.cashDiscrepancyDesc', { count: summary?.shiftsWithDiscrepancy || 0 })}
              icon="alert"
              className={discrepancyColorClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}