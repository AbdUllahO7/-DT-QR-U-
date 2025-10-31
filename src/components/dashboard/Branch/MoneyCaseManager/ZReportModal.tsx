// src/components/Restaurant/MoneyCase/ZReportModal.tsx

import React from 'react';
import { X, FileText, Printer, Download, Clock } from 'lucide-react';
import { ZReport } from '../../../../types/BranchManagement/MoneyCase';

interface Props {
  show: boolean;
  zReport: ZReport | null;
  loading: boolean;
  onClose: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const ZReportModal: React.FC<Props> = ({
  show,
  zReport,
  loading,
  onClose,
  t,
  isRTL
}) => {
  // Debug log
  console.log('ZReportModal - zReport:', zReport);
  console.log('ZReportModal - loading:', loading);

  if (!show) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '-';
    // Duration format: "00:11:52.2472850"
    const parts = duration.split(':');
    if (parts.length >= 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2].split('.')[0]);
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return duration;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!zReport) return;
    
    // Convert report to text format and download
    const reportText = `
Z REPORT
========================================
Branch: ${zReport.branchName}
Report Date: ${formatDateTime(zReport.reportDate)}
Money Case ID: ${zReport.moneyCaseId}

OPENING INFORMATION
----------------------------------------
Opened At: ${formatDateTime(zReport.openedAt)}
Opened By: ${zReport.openedBy}
Opening Balance: ${formatCurrency(zReport.openingBalance)}

SALES SUMMARY
----------------------------------------
Total Orders: ${zReport.totalOrders}
Transaction Count: ${zReport.transactionCount}
Subtotal (Cash): ${formatCurrency(zReport.totalCash)}
Service Fee (Card): ${formatCurrency(zReport.totalCard)}
Total Revenue: ${formatCurrency(zReport.totalSales)}

CLOSING INFORMATION
----------------------------------------
Closed At: ${formatDateTime(zReport.closedAt)}
Closed By: ${zReport.closedBy}
Shift Duration: ${formatDuration(zReport.shiftDuration)}
Expected Cash: ${formatCurrency(zReport.expectedCash)}
Actual Cash: ${formatCurrency(zReport.actualCash)}
Difference: ${formatCurrency(zReport.difference)}

NOTES
----------------------------------------
${zReport.notes || 'No notes'}

========================================
Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `z-report-${zReport.moneyCaseId}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <FileText className={`h-6 w-6 text-white ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <h3 className="text-lg font-medium text-white">
                  {t('moneyCase.zReport')}
                </h3>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={handlePrint}
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  title={t('common.print')}
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  title={t('common.download')}
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="px-6 py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : zReport ? (
            <div className="px-6 py-6 space-y-6" id="z-report-content">
              {/* Branch Info */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {zReport.branchName}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">{t('moneyCase.reportDate')}:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-medium">
                      {formatDateTime(zReport.reportDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">{t('moneyCase.caseId')}:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-medium">
                      #{zReport.moneyCaseId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  {t('moneyCase.openingInformation')}
                </h5>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.openedAt')}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {formatDateTime(zReport.openedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.openedBy')}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {zReport.openedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.openingBalance')}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(zReport.openingBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sales Summary */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  {t('moneyCase.salesSummary')}
                </h5>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('moneyCase.totalRevenue')}</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(zReport.totalSales)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('moneyCase.totalOrders')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {zReport.totalOrders}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('moneyCase.transactionCount')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {zReport.transactionCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('moneyCase.subtotal')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(zReport.totalCash)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('moneyCase.serviceFee')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(zReport.totalCard)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Closing Information */}
              <div>
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  {t('moneyCase.closingInformation')}
                </h5>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.closedAt')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatDateTime(zReport.closedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.closedBy')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {zReport.closedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.shiftDuration')}:</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {formatDuration(zReport.shiftDuration)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.expectedCash')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(zReport.expectedCash)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.actualCash')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(zReport.actualCash)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('moneyCase.difference')}</p>
                      <p className={`text-lg font-bold ${
                        zReport.difference > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : zReport.difference < 0 
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {zReport.difference > 0 ? '+' : ''}{formatCurrency(zReport.difference)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {zReport.notes && (
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    {t('moneyCase.notes')}
                  </h5>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {zReport.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              {t('moneyCase.noReportData')}
            </div>
          )}

          {/* Footer */}
          <div className={`bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZReportModal;