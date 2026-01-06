// src/components/Restaurant/MoneyCase/QuickSummaryCards.tsx

import React from 'react';
import { DollarSign, TrendingUp, Clock, AlertCircle, ShoppingCart, Calendar } from 'lucide-react';
import { QuickSummary, ActiveMoneyCase } from '../../../../types/BranchManagement/MoneyCase';

interface Props {
  quickSummary: QuickSummary | null;
  activeCase: ActiveMoneyCase | null;
  loading: boolean;
  t: (key: string) => string;
  isRTL: boolean;
  currencySymbol?: string;
}

const QuickSummaryCards: React.FC<Props> = ({
  quickSummary,
  activeCase,
  loading,
  t,
  isRTL,
  currencySymbol = '₺'
}) => {


  if (loading && !activeCase && !quickSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `${currencySymbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)}`;
  };

  // Use quickSummary data first, then activeCase as fallback
  const isOpen = quickSummary?.isOpen ?? (activeCase !== null && activeCase.status === 'OPEN');
  const todaySales = quickSummary?.todaySales ?? activeCase?.totalAmount ?? 0;
  const currentRevenue = quickSummary?.todayCash ?? activeCase?.subTotalAmount ?? 0;
  const closedRevenue = quickSummary?.closedShiftsRevenue ?? 0;
  const ordersToday = quickSummary?.ordersToday ?? 0;



  return (
    <div className="space-y-6 mb-6">
      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 ${
          isOpen ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('moneyCase.status')}
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isOpen ? t('moneyCase.open') : t('moneyCase.closed')}
              </p>
            </div>
            {isOpen ? (
              <Clock className="h-8 w-8 text-green-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>

        {/* Today's Total Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('moneyCase.todayTotalSales')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(todaySales)}
              </p>
              {closedRevenue > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('moneyCase.closedShifts')}: {formatCurrency(closedRevenue)}
                </p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500 flex-shrink-0" />
          </div>
        </div>

        {/* Current Shift Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('moneyCase.currentShiftRevenue')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(currentRevenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500 flex-shrink-0" />
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('moneyCase.ordersToday')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {ordersToday}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Week and Month Summary */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Week to Date */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('moneyCase.weekToDate')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.totalRevenue')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(quickSummary.weekToDate.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.shifts')}
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {quickSummary.weekToDate.shiftCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.orders')}
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {quickSummary.weekToDate.orderCount}
                </span>
              </div>
            </div>
          </div>

          {/* Month to Date */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('moneyCase.monthToDate')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.totalRevenue')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(quickSummary.monthToDate.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.shifts')}
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {quickSummary.monthToDate.shiftCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('moneyCase.orders')}
                </span>
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {quickSummary.monthToDate.orderCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSummaryCards;