/**
 * CSV Export Utility
 * Provides functions for exporting data to CSV format
 */

export interface ColumnConfig {
  key: string;
  header: string;
  formatter?: (value: any, row: any) => string;
}

/**
 * Escape CSV value to handle commas, quotes, and newlines
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, newline, or quote, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Format date for CSV export
 */
export const formatDateForCSV = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return dateString;
  }
};

/**
 * Format currency value for CSV export
 */
export const formatCurrencyForCSV = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0.00';
  return value.toFixed(2);
};

/**
 * Format duration string for CSV (e.g., "00:11:52.2472850" -> "0h 11m 52s")
 */
export const formatDurationForCSV = (duration: string | null | undefined): string => {
  if (!duration) return '';

  const parts = duration.split(':');
  if (parts.length >= 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2].split('.')[0]);
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return duration;
};

/**
 * Generate CSV content from data array
 */
export const generateCSVContent = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[]
): string => {
  // Generate header row
  const headerRow = columns.map(col => escapeCSVValue(col.header)).join(',');

  // Generate data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      const formattedValue = col.formatter ? col.formatter(value, row) : value;
      return escapeCSVValue(formattedValue);
    }).join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV content as a file
 */
export const downloadCSV = (content: string, filename: string): void => {
  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Export data to CSV file
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: ColumnConfig[]
): void => {
  const content = generateCSVContent(data, columns);
  downloadCSV(content, filename);
};

/**
 * Generate filename with date
 */
export const generateFilename = (
  prefix: string,
  branchName?: string,
  fromDate?: string,
  toDate?: string
): string => {
  const parts = [prefix];

  if (branchName) {
    // Sanitize branch name for filename
    parts.push(branchName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase());
  }

  if (fromDate && toDate) {
    parts.push(`${fromDate}_to_${toDate}`);
  } else if (fromDate) {
    parts.push(fromDate);
  } else {
    parts.push(new Date().toISOString().split('T')[0]);
  }

  return parts.join('_');
};

// ============================================
// Pre-configured export functions for reports
// ============================================

/**
 * Money Case History CSV columns configuration
 */
export const getMoneyCaseHistoryColumns = (t: (key: string) => string): ColumnConfig[] => [
  { key: 'branchName', header: t('moneyCase.export.branchName') || 'Branch Name' },
  {
    key: 'openedAt',
    header: t('moneyCase.export.openedAt') || 'Opened At',
    formatter: (value) => formatDateForCSV(value)
  },
  {
    key: 'closedAt',
    header: t('moneyCase.export.closedAt') || 'Closed At',
    formatter: (value) => formatDateForCSV(value)
  },
  {
    key: 'shiftDuration',
    header: t('moneyCase.export.shiftDuration') || 'Shift Duration',
    formatter: (value) => formatDurationForCSV(value)
  },
  {
    key: 'openingBalance',
    header: t('moneyCase.export.openingBalance') || 'Opening Balance',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'closingBalance',
    header: t('moneyCase.export.closingBalance') || 'Closing Balance',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'actualCash',
    header: t('moneyCase.export.actualCash') || 'Actual Cash',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'discrepancy',
    header: t('moneyCase.export.discrepancy') || 'Discrepancy',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  { key: 'transactionCount', header: t('moneyCase.export.transactionCount') || 'Transaction Count' },
  { key: 'openedBy', header: t('moneyCase.export.openedBy') || 'Opened By' },
  { key: 'closedBy', header: t('moneyCase.export.closedBy') || 'Closed By' },
  { key: 'notes', header: t('moneyCase.export.notes') || 'Notes' }
];

/**
 * Z-Report CSV columns configuration
 */
export const getZReportColumns = (t: (key: string) => string): ColumnConfig[] => [
  { key: 'branchName', header: t('moneyCase.export.branchName') || 'Branch Name' },
  {
    key: 'reportDate',
    header: t('moneyCase.export.reportDate') || 'Report Date',
    formatter: (value) => formatDateForCSV(value)
  },
  { key: 'totalOrders', header: t('moneyCase.export.totalOrders') || 'Total Orders' },
  { key: 'transactionCount', header: t('moneyCase.export.transactionCount') || 'Transaction Count' },
  {
    key: 'totalCash',
    header: t('moneyCase.export.subtotal') || 'Subtotal (Cash)',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'totalCard',
    header: t('moneyCase.export.serviceFee') || 'Service Fee (Card)',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'totalSales',
    header: t('moneyCase.export.totalRevenue') || 'Total Revenue',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'expectedCash',
    header: t('moneyCase.export.expectedCash') || 'Expected Cash',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'actualCash',
    header: t('moneyCase.export.actualCash') || 'Actual Cash',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'difference',
    header: t('moneyCase.export.difference') || 'Difference',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  { key: 'openedBy', header: t('moneyCase.export.openedBy') || 'Opened By' },
  { key: 'closedBy', header: t('moneyCase.export.closedBy') || 'Closed By' },
  {
    key: 'shiftDuration',
    header: t('moneyCase.export.shiftDuration') || 'Shift Duration',
    formatter: (value) => formatDurationForCSV(value)
  },
  { key: 'notes', header: t('moneyCase.export.notes') || 'Notes' }
];

/**
 * Branch Summary CSV columns configuration
 */
export const getBranchSummaryColumns = (t: (key: string) => string): ColumnConfig[] => [
  { key: 'branchName', header: t('moneyCase.export.branchName') || 'Branch Name' },
  { key: 'fromDate', header: t('moneyCase.export.fromDate') || 'From Date' },
  { key: 'toDate', header: t('moneyCase.export.toDate') || 'To Date' },
  { key: 'totalCases', header: t('moneyCase.export.totalShifts') || 'Total Shifts' },
  {
    key: 'totalSales',
    header: t('moneyCase.export.totalRevenue') || 'Total Revenue',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'totalCash',
    header: t('moneyCase.export.totalCash') || 'Total Cash',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  {
    key: 'totalCard',
    header: t('moneyCase.export.totalCard') || 'Total Card',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  { key: 'totalOrders', header: t('moneyCase.export.totalOrders') || 'Total Orders' },
  {
    key: 'averageOrderValue',
    header: t('moneyCase.export.averageOrderValue') || 'Average Order Value',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  { key: 'totalTransactions', header: t('moneyCase.export.totalTransactions') || 'Total Transactions' },
  {
    key: 'totalDifference',
    header: t('moneyCase.export.totalDiscrepancy') || 'Total Discrepancy',
    formatter: (value) => formatCurrencyForCSV(value)
  },
  { key: 'shiftsWithDiscrepancy', header: t('moneyCase.export.shiftsWithDiscrepancy') || 'Shifts with Discrepancy' },
  {
    key: 'averageShiftDuration',
    header: t('moneyCase.export.averageShiftDuration') || 'Average Shift Duration',
    formatter: (value) => formatDurationForCSV(value)
  }
];
