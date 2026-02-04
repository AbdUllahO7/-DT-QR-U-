import React from 'react';
import { FileText, Calendar, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { MoneyCaseHistoryItem } from '../../../../types/BranchManagement/MoneyCase';
import { exportToCSV, getMoneyCaseHistoryColumns, generateFilename } from '../../../../utils/csvExport';

interface Props {
  history: MoneyCaseHistoryItem[];
  loading: boolean;
  onViewZReport: (moneyCaseId: number) => void;
  t: (key: string) => string;
  isRTL: boolean;
  branchName?: string;
  fromDate?: string;
  toDate?: string;
}

const MoneyCaseHistoryTable: React.FC<Props> = ({
  history,
  loading,
  onViewZReport,
  t,
  isRTL,
  branchName,
  fromDate,
  toDate
}) => {
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const columns = getMoneyCaseHistoryColumns(t);
    const filename = generateFilename('money-case-history', branchName, fromDate, toDate);
    exportToCSV(history, filename, columns);
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      OPEN: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.CLOSED}`}>
        {status}
      </span>
    );
  };

  const getDifferenceBadge = (difference?: number) => {
    if (difference === undefined || difference === 0) return null;

    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
        difference > 0 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {difference > 0 ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {formatCurrency(Math.abs(difference))}
      </span>
    );
  };

  if (loading && history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('moneyCase.history')}
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar className={`h-5 w-5 text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('moneyCase.history')}
          </h2>
        </div>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {history.length} {t('moneyCase.records')}
          </span>
          {history.length > 0 && (
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              title={t('moneyCase.export.exportCSV')}
            >
              <Download className="h-4 w-4" />
              {t('moneyCase.export.csv')}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.date')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.openingBalance')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.closingBalance')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.actualCash')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.difference')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.status')}
              </th>
              <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mb-4 text-gray-400" />
                    <p className="text-lg font-medium">{t('moneyCase.noHistory')}</p>
                    <p className="text-sm">{t('moneyCase.noHistoryDescription')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {formatDateTime(item.openedAt)}
                    </div>
                    {item.closedAt && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t('moneyCase.closedAt')}: {formatDateTime(item.closedAt)}
                      </div>
                    )}
                  </td>

                  {/* Opening Balance */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.openingBalance)}
                    </div>
                  </td>

                  {/* Closing Balance */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.closingBalance ? formatCurrency(item.closingBalance) : '-'}
                    </div>
                  </td>

                  {/* Actual Cash */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.actualCash ? formatCurrency(item.actualCash) : '-'}
                    </div>
                  </td>

                  {/* Difference */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getDifferenceBadge(item.difference)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.status === 'CLOSED' && (
                      <button
                        onClick={() => onViewZReport(item.id)}
                        className={`flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <FileText className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('moneyCase.viewZReport')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with user info */}
      {history.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('moneyCase.lastUpdated')}: {formatDateTime(history[0]?.openedAt || new Date().toISOString())}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyCaseHistoryTable;