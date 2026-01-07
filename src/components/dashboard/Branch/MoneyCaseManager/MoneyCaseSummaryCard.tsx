// src/components/Restaurant/MoneyCase/MoneyCaseSummaryCard.tsx

import React from 'react';
import { TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react';
import { MoneyCaseSummary } from '../../../../types/BranchManagement/MoneyCase';
import { useCurrency } from '../../../../hooks/useCurrency';

interface Props {
  summary: MoneyCaseSummary | null;
  loading: boolean;
  t: (key: string) => string;
  isRTL: boolean;
}

const MoneyCaseSummaryCard: React.FC<Props> = ({
  summary,
  loading,
  t,
  isRTL
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const currency = useCurrency();

  const formatDuration = (duration?: string) => {
    if (!duration) return '-';
    const parts = duration.split(':');
    if (parts.length >= 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('moneyCase.periodSummary')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('moneyCase.totalRevenue')}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.totalSales)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('moneyCase.totalOrders')}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {summary.totalOrders}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('moneyCase.avgOrderValue')}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.averageOrderValue)}
              </p>
            </div>
              <span className=''>{currency.symbol}</span>
          </div>
        </div>

        {/* Discrepancy */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('moneyCase.totalDiscrepancy')}
              </p>
              <p className={`text-xl font-bold ${
                summary.totalDifference > 0 
                  ? 'text-green-600' 
                  : summary.totalDifference < 0 
                  ? 'text-red-600' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {formatCurrency(summary.totalDifference)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('moneyCase.totalShifts')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{summary.totalCases}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('moneyCase.avgShiftDuration')}</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDuration(summary.averageShiftDuration)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('moneyCase.totalTransactions')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{summary.totalTransactions}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('moneyCase.shiftsWithIssues')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{summary.shiftsWithDiscrepancy}</p>
          </div>
        </div>
      </div>

      {/* Date Range */}
      {summary.fromDate && summary.toDate && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          {t('moneyCase.period')}: {new Date(summary.fromDate).toLocaleDateString()} - {new Date(summary.toDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default MoneyCaseSummaryCard;