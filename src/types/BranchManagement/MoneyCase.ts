export interface OpenMoneyCaseRequest {
  openingBalance: number;
  branchId: number;
}

export interface CloseMoneyCaseRequest {
  branchId: number;
  actualCash: number;
  notes: string;
}

export interface ActiveMoneyCase {
  id: number;
  branchId: number;
  branchName?: string;
  openingBalance: number;
  openedAt: string;
  openedBy?: string;
  currentBalance?: number;
  transactionCount?: number;
  status: string;
}

export interface MoneyCaseHistoryItem {
  id: number;
  branchId: number;
  branchName?: string;
  openingBalance: number;
  closingBalance: number;
  actualCash: number;
  difference?: number;
  openedAt: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  notes?: string;
  status: string;
  transactionCount?: number;
  shiftDuration?: string;
}

export interface ZReportApiResponse {
  branchMoneyCaseId: number;
  branchId: number;
  branchName: string;
  openedAt: string;
  closedAt: string;
  shiftDuration: string;
  openedBy: string;
  openedByEmail: string;
  closedBy: string;
  closedByEmail: string;
  totalOrders: number;
  transactionCount: number;
  subTotal: number;
  serviceFee: number;
  totalRevenue: number;
  actualCash: number;
  discrepancy: number;
  notes: string;
}



export interface MoneyCaseHistoryResponse {
  items: MoneyCaseHistoryItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface MoneyCaseHistoryParams {
  branchId?: number;
  fromDate?: string;
  toDate?: string;
  pageSize?: number;
}

export interface ZReport {
  moneyCaseId: number;
  branchId: number;
  branchName: string;
  reportDate: string;
  openingBalance: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalRefunds: number;
  totalExpenses: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  transactionCount: number;
  totalOrders: number;
  openedAt: string;
  closedAt: string;
  shiftDuration: string;
  openedBy: string;
  closedBy: string;
  notes: string;
}

export interface BranchSummaryParams {
  branchId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface RestaurantSummaryParams {
  restaurantId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface MoneyCaseSummary {
  branchId?: number;
  branchName?: string;
  restaurantId?: number;
  restaurantName?: string;
  fromDate?: string;
  toDate?: string;
  totalCases: number;
  totalOpeningBalance: number;
  totalClosingBalance: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalDifference: number;
  averageDifference: number;
  totalOrders: number;
  totalTransactions: number;
  averageOrderValue: number;
  averageShiftDuration?: string;
  shiftsWithDiscrepancy: number;
}

export interface QuickSummary {
  branchId?: number;
  branchName?: string;
  activeCaseId?: number;
  isOpen: boolean;
  todaySales: number;
  todayCash: number;
  todayCard: number;
  currentBalance: number;
  transactionCount: number;
  lastUpdated: string;
  // Additional fields from API
  ordersToday: number;
  shiftStartTime?: string;
  currentShiftDuration?: string;
  closedShiftsRevenue: number;
  weekToDate: {
    totalRevenue: number;
    shiftCount: number;
    orderCount: number;
  };
  monthToDate: {
    totalRevenue: number;
    shiftCount: number;
    orderCount: number;
  };
}

export interface ActiveMoneyCaseResponse {
  branchMoneyCaseId: number;
  branchId: number;
  subTotalAmount: number;
  serviceFeeAmount: number;
  totalAmount: number;
  status: boolean;
  openedAt: string;
  lastUpdatedAt: string;
  closedAt: string | null;
  openedBy: string;
  openedByEmail: string;
  closedBy: string | null;
  closedByEmail: string | null;
  branch: any | null;
}
export interface MoneyCaseHistoryItemResponse {
  id: number;
  branchId: number;
  branchName: string;
  subTotalAmount: number;
  serviceFeeAmount: number;
  totalAmount: number;
  openedAt: string;
  closedAt: string | null;
  shiftDuration: string;
  openedBy: string;
  openedByEmail: string;
  closedBy: string | null;
  closedByEmail: string | null;
  transactionCount: number;
  actualCash: number;
  discrepancy: number;
  notes: string;
}

// API Response for history (notice it's different from expected)
export interface MoneyCaseHistoryApiResponse {
  message: string;
  data: MoneyCaseHistoryItemResponse[];
  count: number;
}


// src/types/BranchManagement/MoneyCase.ts

// API Response for Branch Summary
export interface BranchSummaryApiResponse {
  branchId: number;
  branchName: string;
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  subTotal: number;
  serviceFee: number;
  totalShifts: number;
  averageRevenuePerShift: number;
  averageShiftDuration: string;
  totalOrders: number;
  averageOrderValue: number;
  totalTransactions: number;
  totalCashDiscrepancy: number;
  shiftsWithDiscrepancy: number;
}

// UI format for Money Case Summary

export interface RestaurantSummaryApiResponse {
  restaurantId: number;
  restaurantName: string;
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  subTotal: number;
  serviceFee: number;
  totalShifts: number;
  averageRevenuePerShift: number;
  averageShiftDuration: string;
  totalOrders: number;
  averageOrderValue: number;
  totalTransactions: number;
  totalCashDiscrepancy: number;
  shiftsWithDiscrepancy: number;
}

export interface QuickSummaryApiResponse {
  isBranchLevel: boolean;
  branchId: number | null;
  branchName: string | null;
  restaurantId: number | null;
  restaurantName: string | null;
  today: {
    hasActiveShift: boolean;
    activeCaseId: number | null;
    shiftStartTime: string | null;
    currentRevenue: number;
    ordersToday: number;
    currentShiftDuration: string | null;
    closedShiftsRevenue: number;
    totalRevenueToday: number;
  };
  weekToDate: {
    fromDate: string;
    toDate: string;
    totalRevenue: number;
    shiftCount: number;
    orderCount: number;
  };
  monthToDate: {
    fromDate: string;
    toDate: string;
    totalRevenue: number;
    shiftCount: number;
    orderCount: number;
  };
}