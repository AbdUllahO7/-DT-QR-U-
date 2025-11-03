// src/services/Branch/MoneyCaseService.ts

import { httpClient } from "../../utils/http";
import { logger } from "../../utils/logger";
import {
  ActiveMoneyCase,
  ActiveMoneyCaseResponse,
  OpenMoneyCaseRequest,
  CloseMoneyCaseRequest,
  MoneyCaseHistoryItem,
  MoneyCaseHistoryResponse,
  MoneyCaseHistoryParams,
  QuickSummary,
  ZReport,
  BranchSummaryParams,
  RestaurantSummaryParams,
  MoneyCaseSummary,
  MoneyCaseHistoryItemResponse,
  ZReportApiResponse,
  BranchSummaryApiResponse,
  RestaurantSummaryApiResponse,
  QuickSummaryApiResponse
} from "../../types/BranchManagement/MoneyCase";

// API Response wrapper type
interface ApiResponse<T> {
  message: string;
  data: T;
}

class MoneyCaseService {
  private baseUrl = '/api/BranchMoneyCase';

  /**
   * Transform API response to UI format
   */
  private transformActiveMoneyCase(apiResponse: ActiveMoneyCaseResponse): ActiveMoneyCase {
    logger.info('Transforming active money case', { apiResponse });
    
    return {
      id: apiResponse.branchMoneyCaseId,
      branchId: apiResponse.branchId,
      branchName: apiResponse.branch?.branchName,
      openingBalance: apiResponse.subTotalAmount,
      openedAt: apiResponse.openedAt,
      openedBy: apiResponse.openedByEmail,
      currentBalance: apiResponse.totalAmount,
      transactionCount: 0,
      status: apiResponse.status ? 'OPEN' : 'CLOSED',
      subTotalAmount: apiResponse.subTotalAmount,
      serviceFeeAmount: apiResponse.serviceFeeAmount,
      totalAmount: apiResponse.totalAmount
    };
  }

  private transformHistoryItem(apiItem: MoneyCaseHistoryItemResponse): MoneyCaseHistoryItem {
  return {
    id: apiItem.id,
    branchId: apiItem.branchId,
    branchName: apiItem.branchName,
    openingBalance: apiItem.subTotalAmount,
    closingBalance: apiItem.totalAmount,
    actualCash: apiItem.actualCash,
    difference: apiItem.discrepancy,
    openedAt: apiItem.openedAt,
    closedAt: apiItem.closedAt || undefined,
    openedBy: apiItem.openedByEmail,
    closedBy: apiItem.closedByEmail || undefined,
    notes: apiItem.notes || undefined,
    status: apiItem.closedAt ? 'CLOSED' : 'OPEN',
    transactionCount: apiItem.transactionCount,
    shiftDuration: apiItem.shiftDuration
  };
  }

  private transformZReport(apiReport: ZReportApiResponse): ZReport {
  return {
    moneyCaseId: apiReport.branchMoneyCaseId,
    branchId: apiReport.branchId,
    branchName: apiReport.branchName,
    reportDate: apiReport.closedAt || apiReport.openedAt,
    openingBalance: apiReport.subTotal,
    totalSales: apiReport.totalRevenue,
    totalCash: apiReport.subTotal, // Using subTotal as cash since API doesn't separate
    totalCard: apiReport.serviceFee, // Using serviceFee as card
    totalRefunds: 0, // Not provided by API
    totalExpenses: 0, // Not provided by API
    expectedCash: apiReport.totalRevenue,
    actualCash: apiReport.actualCash,
    difference: apiReport.discrepancy,
    transactionCount: apiReport.transactionCount,
    totalOrders: apiReport.totalOrders,
    openedAt: apiReport.openedAt,
    closedAt: apiReport.closedAt,
    shiftDuration: apiReport.shiftDuration,
    openedBy: apiReport.openedByEmail,
    closedBy: apiReport.closedByEmail,
    notes: apiReport.notes
  };
  }

  private transformBranchSummary(apiSummary: BranchSummaryApiResponse): MoneyCaseSummary {
    return {
      branchId: apiSummary.branchId,
      branchName: apiSummary.branchName,
      fromDate: apiSummary.fromDate,
      toDate: apiSummary.toDate,
      totalCases: apiSummary.totalShifts,
      totalOpeningBalance: apiSummary.subTotal,
      totalClosingBalance: apiSummary.totalRevenue,
      totalSales: apiSummary.totalRevenue,
      totalCash: apiSummary.subTotal,
      totalCard: apiSummary.serviceFee,
      totalDifference: apiSummary.totalCashDiscrepancy,
      averageDifference: apiSummary.totalShifts > 0 
        ? apiSummary.totalCashDiscrepancy / apiSummary.totalShifts 
        : 0,
      totalOrders: apiSummary.totalOrders,
      totalTransactions: apiSummary.totalTransactions,
      averageOrderValue: apiSummary.averageOrderValue,
      averageShiftDuration: apiSummary.averageShiftDuration,
      shiftsWithDiscrepancy: apiSummary.shiftsWithDiscrepancy
    };
  }

  private transformRestaurantSummary(apiSummary: RestaurantSummaryApiResponse): MoneyCaseSummary {
  return {
    restaurantId: apiSummary.restaurantId,
    restaurantName: apiSummary.restaurantName,
    fromDate: apiSummary.fromDate,
    toDate: apiSummary.toDate,
    totalCases: apiSummary.totalShifts,
    totalOpeningBalance: apiSummary.subTotal,
    totalClosingBalance: apiSummary.totalRevenue,
    totalSales: apiSummary.totalRevenue,
    totalCash: apiSummary.subTotal,
    totalCard: apiSummary.serviceFee,
    totalDifference: apiSummary.totalCashDiscrepancy,
    averageDifference: apiSummary.totalShifts > 0 
      ? apiSummary.totalCashDiscrepancy / apiSummary.totalShifts 
      : 0,
    totalOrders: apiSummary.totalOrders,
    totalTransactions: apiSummary.totalTransactions,
    averageOrderValue: apiSummary.averageOrderValue,
    averageShiftDuration: apiSummary.averageShiftDuration,
    shiftsWithDiscrepancy: apiSummary.shiftsWithDiscrepancy
  };
}

private transformQuickSummary(apiSummary: QuickSummaryApiResponse): QuickSummary {
  return {
    branchId: apiSummary.branchId || undefined,
    branchName: apiSummary.branchName || undefined,
    activeCaseId: apiSummary.today.activeCaseId || undefined,
    isOpen: apiSummary.today.hasActiveShift,
    todaySales: apiSummary.today.totalRevenueToday,
    todayCash: apiSummary.today.currentRevenue, // Current shift revenue
    todayCard: apiSummary.today.closedShiftsRevenue, // Closed shifts revenue
    currentBalance: apiSummary.today.currentRevenue,
    transactionCount: apiSummary.today.ordersToday,
    lastUpdated: new Date().toISOString(),
    ordersToday: apiSummary.today.ordersToday,
    shiftStartTime: apiSummary.today.shiftStartTime || undefined,
    currentShiftDuration: apiSummary.today.currentShiftDuration || undefined,
    closedShiftsRevenue: apiSummary.today.closedShiftsRevenue,
    weekToDate: apiSummary.weekToDate,
    monthToDate: apiSummary.monthToDate
  };
}



  /**
   * Kasa açma işlemi
   */
  async openMoneyCase(request: OpenMoneyCaseRequest): Promise<ActiveMoneyCase> {
    try {
      logger.info('Kasa açılıyor', { 
        branchId: request.branchId, 
        openingBalance: request.openingBalance 
      });
      
      const response = await httpClient.post<ApiResponse<ActiveMoneyCaseResponse>>(
        `${this.baseUrl}/open`, 
        request
      );
      
      logger.info('✅ Kasa başarıyla açıldı', { 
        response: response.data
      });
      
      return this.transformActiveMoneyCase(response.data.data);
    } catch (error: any) {
      logger.error('❌ Kasa açılırken hata:', error);
      throw new Error(error?.response?.data?.message || 'Failed to open money case');
    }
  }

  /**
   * Kasa kapatma işlemi
   */
// In MoneyCaseService class, update closeMoneyCase method:

/**
 * Kasa kapatma işlemi
 */
async closeMoneyCase(request: CloseMoneyCaseRequest): Promise<MoneyCaseHistoryItem> {
  try {
    logger.info('Kasa kapatılıyor', { 
      branchId: request.branchId, 
      actualCash: request.actualCash 
    });
    
    const response = await httpClient.post<{
      message: string;
      data: any;
    }>(
      `${this.baseUrl}/close`, 
      request
    );
    
    logger.info('✅ Kasa başarıyla kapatıldı', { 
      response: response.data
    });
    
    // Transform the response to ensure it has the expected structure
    const closedCase = response.data.data || response.data;
    
    // Create a properly structured MoneyCaseHistoryItem
    const historyItem: MoneyCaseHistoryItem = {
      id: closedCase.id || closedCase.branchMoneyCaseId || 0,
      branchId: closedCase.branchId,
      branchName: closedCase.branchName,
      openingBalance: closedCase.subTotalAmount || closedCase.openingBalance || 0,
      closingBalance: closedCase.totalAmount || closedCase.closingBalance || 0,
      actualCash: closedCase.actualCash || 0,
      difference: closedCase.discrepancy ?? closedCase.difference ?? 0,
      openedAt: closedCase.openedAt,
      closedAt: closedCase.closedAt,
      openedBy: closedCase.openedByEmail || closedCase.openedBy,
      closedBy: closedCase.closedByEmail || closedCase.closedBy,
      notes: closedCase.notes || '',
      status: 'CLOSED',
      transactionCount: closedCase.transactionCount || 0,
      shiftDuration: closedCase.shiftDuration
    };
    
    logger.info('✅ Transformed closed case:', historyItem);
    
    return historyItem;
  } catch (error: any) {
    logger.error('❌ Kasa kapatılırken hata:', error);
    throw new Error(error?.response?.data?.message || 'Failed to close money case');
  }
}

  /**
   * Aktif kasayı getir
   */
  async getActiveMoneyCase(branchId?: number): Promise<ActiveMoneyCase | null> {
    try {
      logger.info('Aktif kasa getiriliyor', { branchId });
      
      const params = branchId ? { branchId } : {};
      const response = await httpClient.get<ApiResponse<ActiveMoneyCaseResponse | null>>(
        `${this.baseUrl}/active`,
        { params }
      );
      
      logger.info('✅ API Response:', { 
        fullResponse: response,
        data: response.data,
        innerData: response.data?.data
      });
      
      if (!response.data || !response.data.data) {
        logger.info('No active money case found');
        return null;
      }
      
      const transformed = this.transformActiveMoneyCase(response.data.data);
      logger.info('✅ Transformed active money case:', transformed);
      
      return transformed;
    } catch (error: any) {
      logger.error('❌ Aktif kasa getirilirken hata:', error);
      
      // If no active case (404), return null
      if (error?.response?.status === 404) {
        logger.info('No active case (404)');
        return null;
      }
      
      // For other errors, throw
      throw new Error(error?.response?.data?.message || 'Failed to fetch active money case');
    }
  }

  /**
   * Kasa geçmişini getir
   */
async getMoneyCaseHistory(params: MoneyCaseHistoryParams = {}): Promise<MoneyCaseHistoryResponse> {
  try {
    logger.info('Kasa geçmişi getiriliyor', params);
    
    const queryParams = {
      ...params,
      pageSize: params.pageSize || 30
    };
    
    // API returns array directly in data, not wrapped in items
    const response = await httpClient.get<{
      message: string;
      data: MoneyCaseHistoryItemResponse[];
      count: number;
    }>(
      `${this.baseUrl}/history`,
      { params: queryParams }
    );
    
    logger.info('✅ Kasa geçmişi API response:', { 
      response: response.data
    });
    
    // Transform the response
    const items = (response.data.data || []).map(item => this.transformHistoryItem(item));
    const totalCount = response.data.count || 0;
    const pageSize = queryParams.pageSize;
    
    const result: MoneyCaseHistoryResponse = {
      items,
      totalCount,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(totalCount / pageSize)
    };
    
    logger.info('✅ Transformed history:', result);
    
    return result;
  } catch (error: any) {
    logger.error('❌ Kasa geçmişi getirilirken hata:', error);
    
    // Return empty result on error
    return {
      items: [],
      totalCount: 0,
      pageSize: params.pageSize || 30,
      currentPage: 1,
      totalPages: 0
    };
  }
}

  /**
   * Z raporu getir
   */
async getZReport(moneyCaseId: number): Promise<ZReport> {
  try {
    logger.info('Z raporu getiriliyor', { moneyCaseId });
    
    const response = await httpClient.get<{
      message: string;
      zReport: ZReportApiResponse;
    }>(
      `${this.baseUrl}/${moneyCaseId}/z-report`
    );
    
    logger.info('✅ Z raporu API response:', { 
      response: response.data
    });
    
    const transformed = this.transformZReport(response.data.zReport);
    logger.info('✅ Transformed Z report:', transformed);
    
    return transformed;
  } catch (error: any) {
    logger.error('❌ Z raporu getirilirken hata:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch Z report');
  }
}

  /**
   * Şube bazında özet rapor getir
   */
async getBranchSummary(params: BranchSummaryParams = {}): Promise<MoneyCaseSummary> {
  try {
    logger.info('Şube özet raporu getiriliyor', params);
    
    const response = await httpClient.get<{
      message: string;
      data: BranchSummaryApiResponse;
    }>(
      `${this.baseUrl}/summary/branch`,
      { params }
    );
    
    logger.info('✅ Şube özet raporu API response:', { 
      response: response.data
    });
    
    const transformed = this.transformBranchSummary(response.data.data);
    logger.info('✅ Transformed branch summary:', transformed);
    
    return transformed;
  } catch (error: any) {
    logger.error('❌ Şube özet raporu getirilirken hata:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch branch summary');
  }
}
  /**
   * Restoran bazında özet rapor getir
   */
async getRestaurantSummary(params: RestaurantSummaryParams = {}): Promise<MoneyCaseSummary> {
  try {
    logger.info('Restoran özet raporu getiriliyor', params);
    
    const response = await httpClient.get<{
      message: string;
      data: RestaurantSummaryApiResponse;
    }>(
      `${this.baseUrl}/summary/restaurant`,
      { params }
    );
    
    logger.info('✅ Restoran özet raporu API response:', { 
      response: response.data
    });
    
    const transformed = this.transformRestaurantSummary(response.data.data);
    logger.info('✅ Transformed restaurant summary:', transformed);
    
    return transformed;
  } catch (error: any) {
    logger.error('❌ Restoran özet raporu getirilirken hata:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch restaurant summary');
  }
}

  /**
   * Hızlı özet getir (günlük durum)
   */
async getQuickSummary(branchId?: number): Promise<QuickSummary> {
  try {
    logger.info('Hızlı özet getiriliyor', { branchId });
    
    const params = branchId ? { branchId } : {};
    const response = await httpClient.get<{
      message: string;
      data: QuickSummaryApiResponse;
    }>(
      `${this.baseUrl}/summary/quick`,
      { params }
    );
    
    logger.info('✅ Hızlı özet API response:', { 
      response: response.data
    });
    
    const transformed = this.transformQuickSummary(response.data.data);
    logger.info('✅ Transformed quick summary:', transformed);
    
    return transformed;
  } catch (error: any) {
    logger.error('❌ Hızlı özet getirilirken hata:', error);
    
    // Return default values if API fails
    return {
      isOpen: false,
      todaySales: 0,
      todayCash: 0,
      todayCard: 0,
      currentBalance: 0,
      transactionCount: 0,
      lastUpdated: new Date().toISOString(),
      ordersToday: 0,
      closedShiftsRevenue: 0,
      weekToDate: {
        totalRevenue: 0,
        shiftCount: 0,
        orderCount: 0
      },
      monthToDate: {
        totalRevenue: 0,
        shiftCount: 0,
        orderCount: 0
      }
    };
  }
}

  /**
   * Kasanın açık olup olmadığını kontrol et
   */
  async isMoneyCaseOpen(branchId?: number): Promise<boolean> {
    try {
      const activeCase = await this.getActiveMoneyCase(branchId);
      return activeCase !== null && activeCase.status === 'OPEN';
    } catch (error: any) {
      logger.error('❌ Kasa durumu kontrol edilirken hata:', error);
      return false;
    }
  }

  /**
   * Bugünkü kasa işlemlerini getir
   */
  async getTodayHistory(branchId?: number): Promise<MoneyCaseHistoryItem[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const response = await this.getMoneyCaseHistory({
        branchId,
        fromDate: today.toISOString(),
        toDate: tomorrow.toISOString(),
        pageSize: 100
      });
      
      return response.items || [];
    } catch (error: any) {
      logger.error('❌ Bugünkü kasa geçmişi getirilirken hata:', error);
      return [];
    }
  }
}

// Export service instance
export const moneyCaseService = new MoneyCaseService();
export { MoneyCaseService };