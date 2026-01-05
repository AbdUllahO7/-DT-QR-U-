import { TableCategory, TableData } from "../../types/BranchManagement/type";
import { httpClient, getEffectiveBranchId } from "../../utils/http";
import { logger } from "../../utils/logger";

// Category management interfaces
export interface CreateTableCategoryDto {
  categoryName: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
}
interface DeletedTable {
  id: number;
  displayName: string;
  description: string | null;
  code: string | null;
  entityType: string;
  deletedAt: string;
  deletedBy: string;
  branchId: number;
  branchName: string;
  restaurantId: number | null;
  restaurantName: string | null;
  categoryId: number;
  categoryName: string;
}
export interface UpdateTableCategoryDto {
  id?:number
  categoryName: string;
  description?: string;  // Add this field
  colorCode: string;
  iconClass: string;
  displayOrder: number;  // Remove the optional
  isActive: boolean;
  rowVersion?: string;
}
// New interface for clear table response
export interface ClearTableResponseDto {
  message: string;
  endedSessions: number;
  tableName: string;
}
export interface CategoryStatusToggleDto {
  isActive: boolean;
}

export interface CreateMenuTableDto {
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

export interface UpdateMenuTableDto {
  id: number;
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  rowVersion: string;
}

export interface BatchCreateMenuTableItemDto {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}
// Deleted table category response
interface DeletedTableCategory {
  id: number;
  displayName: string;
  description: string | null;
  code: string | null;
  entityType: string;
  deletedAt: string;
  deletedBy: string;
  branchId: number;
  branchName: string;
  restaurantId: number | null;
  restaurantName: string | null;
  categoryId: number | null;
  categoryName: string | null;
}
export interface CreateBatchMenuTableDto {
  items: BatchCreateMenuTableItemDto[];
}

export interface TableStatusToggleDto {
  isActive: boolean;
}

export interface TableOccupationToggleDto {
  isOccupied: boolean;
}

class TableService {
  private baseUrl = '/api/branches';

    private getLanguageFromStorage(): string {
    return localStorage.getItem('language') || 'en';
  }


  // ==================== CATEGORY METHODS ====================

  /**
   * Get all table categories for the authenticated user's branch
   */
  async getCategories(
    onlyActive: boolean = true,
    includeTableCount: boolean = true
  ): Promise<TableCategory[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Masa kategorileri API çağrısı başlatılıyor', { onlyActive, includeTableCount, branchId }, { prefix: 'TableService' });

      const params = new URLSearchParams({
        includeTableCount: includeTableCount.toString(),
        language: language
      });

      // Add branchId if available
      if (branchId) {
        params.append('branchId', branchId.toString());
      }

      const response = await httpClient.get<TableCategory[]>(`${this.baseUrl}/table-categories?${params.toString()}`);
      
      logger.info('Masa kategorileri alındı', response.data, { prefix: 'TableService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masa kategorileri alınırken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryById(categoryId: number): Promise<TableCategory | null> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Kategori detayları API çağrısı başlatılıyor', { categoryId, branchId }, { prefix: 'TableService' });

      const params = branchId ? { branchId, language: language } : { language: language };
      const response = await httpClient.get<TableCategory>(`${this.baseUrl}/table-categories/${categoryId}`, { params });

      logger.info('Kategori detayları alındı', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error: any) {
      if (error?.status === 404) {
        logger.warn('Kategori bulunamadı (404)', { categoryId }, { prefix: 'TableService' });
        return null;
      }

      logger.error('Kategori detayları alınırken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Create a new table category
   */
  async createCategory(data: CreateTableCategoryDto): Promise<TableCategory> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Kategori oluşturma API çağrısı başlatılıyor', { data, branchId }, { prefix: 'TableService' });

      // Validate input data
      if (!data.categoryName || !data.categoryName.trim()) {
        throw new Error('Kategori adı gereklidir');
      }

      if (!data.colorCode) {
        throw new Error('Renk kodu gereklidir');
      }

      if (!data.iconClass) {
        throw new Error('İkon sınıfı gereklidir');
      }

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post<TableCategory>(`${this.baseUrl}/table-categories`, data, { params });

      logger.info('Kategori başarıyla oluşturuldu', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Kategori oluşturulurken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Update an existing table category
   */
  async updateCategory(categoryId: number, data: UpdateTableCategoryDto, branchId?: number): Promise<TableCategory> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Kategori güncelleme API çağrısı başlatılıyor', { categoryId, data, branchId: effectiveBranchId }, { prefix: 'TableService' });

      // Validate input data
      if (!data.categoryName || !data.categoryName.trim()) {
        throw new Error('Kategori adı gereklidir');
      }

      if (!data.colorCode) {
        throw new Error('Renk kodu gereklidir');
      }

      if (!data.iconClass) {
        throw new Error('İkon sınıfı gereklidir');
      }

      // Format the payload to match API schema
      const payload = {
        categoryName: data.categoryName,
        description: data.description || "",
        colorCode: data.colorCode,
        iconClass: data.iconClass,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive,
        rowVersion: data.rowVersion || ""
      };

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      const response = await httpClient.put<TableCategory>(`${this.baseUrl}/table-categories/${categoryId}`, payload, { params });

      logger.info('Kategori başarıyla güncellendi', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Kategori güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Delete a table category
   */
  async deleteCategory(categoryId: number , branchId?:number): Promise<void> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Kategori silme API çağrısı başlatılıyor', { categoryId, branchId: effectiveBranchId }, { prefix: 'TableService' });

      if (!categoryId || categoryId <= 0) {
        throw new Error('Geçerli bir kategori ID gereklidir');
      }

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      await httpClient.delete(`${this.baseUrl}/table-categories/${categoryId}`, { params });

      logger.info('Kategori başarıyla silindi', { categoryId }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Kategori silinirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Toggle category active/inactive status
   */
  async toggleCategoryStatus(categoryId: number, isActive: boolean): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Kategori durumu güncelleme isteği', { categoryId, isActive, branchId }, { prefix: 'TableService' });

      if (!categoryId || categoryId <= 0) {
        throw new Error('Geçerli bir kategori ID gereklidir');
      }

      const payload: CategoryStatusToggleDto = { isActive };
      const params = branchId ? { branchId } : {};

      await httpClient.patch(`${this.baseUrl}/table-categories/${categoryId}/toggle-status`, payload, { params });

      logger.info('Kategori durumu başarıyla güncellendi', { categoryId, isActive }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Kategori durumu güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Reorder categories
   */
  async reorderCategories(categoryOrders: Array<{ categoryId: number; newDisplayOrder: number }>): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Kategori sıralama güncelleme isteği', { categoryOrders, branchId }, { prefix: 'TableService' });

      if (!categoryOrders || categoryOrders.length === 0) {
        throw new Error('Sıralanacak kategori bilgisi gereklidir');
      }

      const payload = { categoryOrders };
      const params = branchId ? { branchId } : {};

      await httpClient.patch(`${this.baseUrl}/table-categories/reorder`, payload, { params });

      logger.info('Kategori sıralaması başarıyla güncellendi', { count: categoryOrders.length }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Kategori sıralaması güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  // ==================== TABLE METHODS ====================

  /**
   * Get all tables for the authenticated user's branch
   */
  async getTables(
    categoryId?: string,
    onlyActive: boolean = true,
    includeCategory: boolean = true
  ): Promise<TableData[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
      const language = this.getLanguageFromStorage();

      logger.info('Masalar API çağrısı başlatılıyor', { categoryId, onlyActive, includeCategory, branchId }, { prefix: 'TableService' });

      const params = new URLSearchParams({
        onlyActive: onlyActive.toString(),
        language: language,
        includeCategory: includeCategory.toString()
      });

      if (categoryId) {
        params.append('categoryId', categoryId);
      }

      // Add branchId if available
      if (branchId) {
        params.append('branchId', branchId.toString());
      }

      const response = await httpClient.get<TableData[]>(`${this.baseUrl}/tables?${params.toString()}`);
      
      logger.info('Masalar alındı', response.data, { prefix: 'TableService' });
      
      return response.data;
    } catch (error) {
      logger.error('Masalar alınırken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Get table categories for the authenticated user's branch (legacy method for backward compatibility)
   */
  async getTableCategories(
    onlyActive: boolean = true, 
    includeTableCount: boolean = true
  ): Promise<TableCategory[]> {
    
    return this.getCategories(onlyActive, includeTableCount);
  }

  /**
   * Create a single table
   */
  async createTable(data: CreateMenuTableDto): Promise<any> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa oluşturma API çağrısı başlatılıyor', { data, branchId }, { prefix: 'TableService' });

      // Validate input data
      if (!data.menuTableCategoryId) {
        throw new Error('Masa kategorisi gereklidir');
      }

      if (!data.capacity || data.capacity <= 0) {
        throw new Error('Masa kapasitesi en az 1 olmalıdır');
      }

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post(`${this.baseUrl}/tables`, data, { params });

      logger.info('Masa başarıyla oluşturuldu', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Masa oluşturulurken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Create multiple tables in batch
   */
  async createBatchTables(data: CreateBatchMenuTableDto): Promise<any> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Toplu masa oluşturma API çağrısı başlatılıyor', { data, branchId }, { prefix: 'TableService' });

      // Validate batch data
      if (!data.items || data.items.length === 0) {
        throw new Error('En az bir masa oluşturma verisi gereklidir');
      }

      // Validate each item
      data.items.forEach((item, index) => {
        if (!item.categoryId) {
          throw new Error(`${index + 1}. öğe için kategori ID gereklidir`);
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`${index + 1}. öğe için masa sayısı en az 1 olmalıdır`);
        }
        if (!item.capacity || item.capacity <= 0) {
          throw new Error(`${index + 1}. öğe için masa kapasitesi en az 1 olmalıdır`);
        }
      });

      // Batch işlemler için özel timeout konfigürasyonu
      const batchConfig = {
        timeout: 120000, // 2 dakika timeout (batch işlemler için)
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'batch-operation'
        },
        params: branchId ? { branchId } : {}
      };

      const response = await httpClient.post(`${this.baseUrl}/tables/batch`, data, batchConfig);

      logger.info('Toplu masa başarıyla oluşturuldu', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Toplu masa oluşturulurken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Update an existing table
   */
  async updateTable(tableId: number, data: UpdateMenuTableDto): Promise<any> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa güncelleme API çağrısı başlatılıyor', { tableId, data, branchId }, { prefix: 'TableService' });

      // Validate input data
      if (!data.id || data.id !== tableId) {
        throw new Error('Masa ID uyumsuzluğu');
      }

      if (!data.menuTableCategoryId) {
        throw new Error('Masa kategorisi gereklidir');
      }

      if (!data.capacity || data.capacity <= 0) {
        throw new Error('Masa kapasitesi en az 1 olmalıdır');
      }

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put(`${this.baseUrl}/tables/${tableId}`, data, { params });

      logger.info('Masa başarıyla güncellendi', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Masa güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Delete a table
   */
  async deleteTable(tableId: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa silme API çağrısı başlatılıyor', { tableId, branchId }, { prefix: 'TableService' });

      if (!tableId || tableId <= 0) {
        throw new Error('Geçerli bir masa ID gereklidir');
      }

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/tables/${tableId}`, { params });

      logger.info('Masa başarıyla silindi', { tableId }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa silinirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Toggle table active/inactive status
   */
  async toggleTableStatus(tableId: number, isActive: boolean): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa durumu güncelleme isteği', { tableId, isActive, branchId }, { prefix: 'TableService' });

      if (!tableId || tableId <= 0) {
        throw new Error('Geçerli bir masa ID gereklidir');
      }

      const payload: TableStatusToggleDto = { isActive };
      const params = branchId ? { branchId } : {};

      await httpClient.patch(`${this.baseUrl}/tables/${tableId}/status`, payload, { params });

      logger.info('Masa durumu başarıyla güncellendi', { tableId, isActive }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa durumu güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Toggle table occupation status (for when customers sit/leave)
   */
  async toggleTableOccupation(tableId: number, isOccupied: boolean): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa doluluk durumu güncelleme isteği', { tableId, isOccupied, branchId }, { prefix: 'TableService' });

      if (!tableId || tableId <= 0) {
        throw new Error('Geçerli bir masa ID gereklidir');
      }

      const payload: TableOccupationToggleDto = { isOccupied };
      const params = branchId ? { branchId } : {};

      await httpClient.patch(`${this.baseUrl}/tables/${tableId}/occupation`, payload, { params });

      logger.info('Masa doluluk durumu başarıyla güncellendi', { tableId, isOccupied }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa doluluk durumu güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Get a specific table by ID
   */
  async getTableById(tableId: number): Promise<TableData | null> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
          const language = this.getLanguageFromStorage();

      logger.info('Masa detayları API çağrısı başlatılıyor', { tableId, branchId }, { prefix: 'TableService' });

      const params = branchId ? { branchId, language } : { language };
      const response = await httpClient.get<TableData>(`${this.baseUrl}/tables/${tableId}`, { params });

      logger.info('Masa detayları alındı', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error: any) {
      if (error?.status === 404) {
        logger.warn('Masa bulunamadı (404)', { tableId }, { prefix: 'TableService' });
        return null;
      }

      logger.error('Masa detayları alınırken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Batch update table statuses
   */
  async batchUpdateTableStatus(tableIds: number[], isActive: boolean): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Toplu masa durumu güncelleme isteği', { tableIds, isActive, branchId }, { prefix: 'TableService' });

      if (!tableIds || tableIds.length === 0) {
        throw new Error('En az bir masa seçilmelidir');
      }

      const payload = {
        tableIds,
        isActive
      };

      const batchConfig = {
        timeout: 60000, // 1 dakika timeout
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'batch-operation'
        },
        params: branchId ? { branchId } : {}
      };

      await httpClient.patch(`${this.baseUrl}/tables/batch-status`, payload, batchConfig);

      logger.info('Toplu masa durumu başarıyla güncellendi', { count: tableIds.length, isActive }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Toplu masa durumu güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Get table statistics for the authenticated user's branch
   */
  async getTableStatistics(): Promise<{
    totalTables: number;
    activeTables: number;
    occupiedTables: number;
    availableTables: number;
    categoryStats: Array<{
      categoryId: number;
      categoryName: string;
      totalTables: number;
      occupiedTables: number;
    }>;
  }> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
          const language = this.getLanguageFromStorage();

      logger.info('Masa istatistikleri API çağrısı başlatılıyor', { branchId }, { prefix: 'TableService' });

      const params = branchId ? { branchId, language } : { language };
      const response = await httpClient.get(`${this.baseUrl}/tables/statistics`, { params });

      logger.info('Masa istatistikleri alındı', response.data, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Masa istatistikleri alınırken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Reorder tables within a category
   */
  async reorderTables(tableOrders: Array<{ tableId: number; newDisplayOrder: number }>): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa sıralama güncelleme isteği', { tableOrders, branchId }, { prefix: 'TableService' });

      if (!tableOrders || tableOrders.length === 0) {
        throw new Error('Sıralanacak masa bilgisi gereklidir');
      }

      const payload = { tableOrders };
      const params = branchId ? { branchId } : {};

      await httpClient.patch(`${this.baseUrl}/tables/reorder`, payload, { params });

      logger.info('Masa sıralaması başarıyla güncellendi', { count: tableOrders.length }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa sıralaması güncellenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }

  /**
   * Batch delete tables
   */
  async batchDeleteTables(tableIds: number[]): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Toplu masa silme isteği', { tableIds, branchId }, { prefix: 'TableService' });

      if (!tableIds || tableIds.length === 0) {
        throw new Error('Silinecek masa seçilmelidir');
      }

      const payload = { tableIds };

      const batchConfig = {
        timeout: 60000, // 1 dakika timeout
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'batch-operation'
        },
        params: branchId ? { branchId } : {}
      };

      await httpClient.delete(`${this.baseUrl}/tables/batch`, {
        data: payload,
        ...batchConfig
      });

      logger.info('Toplu masa silme başarıyla tamamlandı', { count: tableIds.length }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Toplu masa silinirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }
  /**
   * Clear table - Toggle table occupation status between busy and available
   * This is a simplified endpoint that automatically toggles the current state
   */
  async clearTable(tableId: number): Promise<ClearTableResponseDto> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa temizleme API çağrısı başlatılıyor', { tableId, branchId }, { prefix: 'TableService' });

      if (!tableId || tableId <= 0) {
        throw new Error('Geçerli bir masa ID gereklidir');
      }

      const params = branchId ? { branchId } : {};
      const response = await httpClient.post<ClearTableResponseDto>(
        `${this.baseUrl}/tables/${tableId}/clear`,
        { "reason": "string" },
        { params }
      );

      logger.info('Masa durumu başarıyla temizlendi/değiştirildi', {
        tableId,
        message: response.data.message,
        endedSessions: response.data.endedSessions
      }, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Masa temizlenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }
  /**
   * Get all deleted table categories
   */
  async getDeletedTableCategories(): Promise<DeletedTableCategory[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();
          const language = this.getLanguageFromStorage();

      logger.info('Silinmiş masa kategorileri API çağrısı başlatılıyor', { branchId }, { prefix: 'TableService' });

      const params = branchId ? { branchId, language } : { language };
      const response = await httpClient.get<DeletedTableCategory[]>(`${this.baseUrl}/table-categories/deleted`, { params });

      logger.info('Silinmiş masa kategorileri alındı', {
        count: response.data.length
      }, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Silinmiş masa kategorileri alınırken hata oluştu', error, { prefix: 'TableService' });
      return [];
    }
  }

  /**
   * Restore a deleted table category
   */
  async restoreTableCategory(categoryId: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Masa kategorisi geri yükleme isteği', { categoryId, branchId }, { prefix: 'TableService' });

      if (!categoryId || categoryId <= 0) {
        throw new Error('Geçerli bir kategori ID gereklidir');
      }

      const params = branchId ? { branchId } : {};
      await httpClient.post(`${this.baseUrl}/table-categories/${categoryId}/restore`, {}, { params });

      logger.info('Masa kategorisi başarıyla geri yüklendi', { categoryId }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa kategorisi geri yüklenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }
  /**
   * Get all deleted tables
   */
  async getDeletedTables(branchId?: number): Promise<DeletedTable[]> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || getEffectiveBranchId();

      logger.info('Silinmiş masalar API çağrısı başlatılıyor', { branchId: effectiveBranchId }, { prefix: 'TableService' });
      const language = this.getLanguageFromStorage();

      const params = effectiveBranchId ? { branchId: effectiveBranchId, language } : { language };
      const response = await httpClient.get<DeletedTable[]>(`${this.baseUrl}/tables/deleted`, { params });

      logger.info('Silinmiş masalar alındı', {
        count: response.data.length
      }, { prefix: 'TableService' });

      return response.data;
    } catch (error) {
      logger.error('Silinmiş masalar alınırken hata oluştu', error, { prefix: 'TableService' });
      return [];
    }
  }

  /**
   * Restore a deleted table
   */
  async restoreTable(tableId: number , branchId?:string): Promise<void> {
    try {
      // Get effective branch ID (from parameter, localStorage, or token)
      const effectiveBranchId = branchId || (getEffectiveBranchId()?.toString());

      logger.info('Masa geri yükleme isteği', { tableId, branchId: effectiveBranchId }, { prefix: 'TableService' });

      if (!tableId || tableId <= 0) {
        throw new Error('Geçerli bir masa ID gereklidir');
      }

      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      await httpClient.post(`${this.baseUrl}/tables/${tableId}/restore`, {}, { params });

      logger.info('Masa başarıyla geri yüklendi', { tableId }, { prefix: 'TableService' });
    } catch (error) {
      logger.error('Masa geri yüklenirken hata oluştu', error, { prefix: 'TableService' });
      throw error;
    }
  }
}

export const tableService = new TableService();