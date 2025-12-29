import { BatchUpdateBranchDto,  CreateBranchWithDetailsDto } from "../../types/api";
import { BranchData } from "../../types/BranchManagement/type";
import {  httpClient, getEffectiveBranchId } from "../../utils/http";
import { logger } from "../../utils/logger";

export interface UpdateMenuTableDto {
  id: number;
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  rowVersion: string;
}


// Export the interface so it can be used in other files
export interface BranchProductAddon {
  mainBranchProductId: number;
  addonBranchProductId: number;
  mainProductName: string;
  addonProductName: string;
  addonProductDescription: string;
  addonImageUrl: string;
  addonPrice: number;
  addonCategoryName: string;
  isRecommended: boolean;
  marketingText: string;
  suggestedDisplayOrder: number;
}

// Updated BranchData interface to match your API response
interface ApiBranchResponse {
  id: number;
  branchName: string;
  branchTag: string;
  branchStatus: boolean;
  isTemporarilyClosed: boolean;
  isOpenNow: boolean | null;
  whatsappOrderNumber: string;
  branchLogoPath: string;
  branchDateCreated: string;
  branchDateModified: string;
  restaurant: {
    restaurantId: number;
    restaurantName: string;
    restaurantLogoPath: string;
    restaurantStatus: boolean;
  };
  address: {
    addressId: number;
    country: string;
    city: string;
    street: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    fullAddress: string;
  };
  contact: {
     phone: string | null;
    mail: string | null;
    location: string | null;
    contactHeader: string | null;
    footerTitle: string | null;
    footerDescription: string | null;
    openTitle: string | null;
    openDays: string | null;
    openHours: string | null;
  };
  workingHours: Array<{
    id: number;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isWorkingDay: boolean;
  }>;
  categories: Array<{
    id: number;
    branchCategoryId: number;
    branchId: number;
    categoryId: number;
    displayName: string;
    displayOrder: number;
    isActive: boolean;
  }>;
  menuTables: Array<{
    id: number;
    menuTableName: string;
    qrCode: string;
    qrCodeUrl: string;
    menuTableCategoryId: number;
    categoryName: string | null;
    capacity: number;
    displayOrder: number;
    isOccupied: boolean;
    isActive: boolean;
    activeSessionCount: number;
    branchId: number;
  }>;
  activeOrders: any[];
}

class BranchService {
  private baseUrl = '/api/Branches';

  async getBranches(): Promise<BranchData[]> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Kullanıcıya ait branch bilgileri getirme isteği gönderiliyor', { branchId }, { prefix: 'BranchService' });

      // Include related entities in the request
      const includes = [
        'address',
        'contact',
        'workingHours',
      ];

      // Build query parameters
      const queryParams = new URLSearchParams({
        include: includes.join(',')
      });

      // Add branchId if it exists
      if (branchId) {
        queryParams.append('branchId', branchId.toString());
      }

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      logger.info('Branch API Request URL:', url, { prefix: 'BranchService' });
      
      const response = await httpClient.get(url);
      
      logger.info('Branch API Raw Response:', response, { prefix: 'BranchService' });
      logger.info('Branch API Response Data:', response.data, { prefix: 'BranchService' });
      
      let branchData: BranchData[] = [];
      
      // Handle the response structure we see from your log
      if (response.data && response.data.data) {
        const apiData = response.data.data;
        if (Array.isArray(apiData)) {
          branchData = apiData.map(this.transformApiBranchToBranchData);
        } else {
          branchData = [this.transformApiBranchToBranchData(apiData)];
        }
      } else if (response.data) {
        // Direct response without wrapper
        if (Array.isArray(response.data)) {
          branchData = response.data.map(this.transformApiBranchToBranchData);
        } else {
          branchData = [this.transformApiBranchToBranchData(response.data)];
        }
      }
      
      logger.info('Transformed Branch Data:', branchData, { prefix: 'BranchService' });
      logger.info('Kullanıcıya ait branch bilgileri başarıyla alındı', { 
        branchCount: branchData.length,
        includes: includes,
        hasIncludedData: {
          restaurant: !!response.data?.data?.restaurant,
          address: !!response.data?.data?.address,
          contact: !!response.data?.data?.contact,
          workingHours: !!response.data?.data?.workingHours,
          categories: !!response.data?.data?.categories,
          menuTables: !!response.data?.data?.menuTables,
          activeOrders: !!response.data?.data?.activeOrders
        }
      }, { prefix: 'BranchService' });
      
      return branchData;
    } catch (error: any) {
      logger.error('Branch bilgileri getirme hatası', error, { prefix: 'BranchService' });
      logger.error('Error response:', error?.response, { prefix: 'BranchService' });
      logger.error('Error response data:', error?.response?.data, { prefix: 'BranchService' });
      
      // Enhanced error handling
      if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Branch bilgileri getirilirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }



  // Helper method to transform API response to BranchData
  private transformApiBranchToBranchData(apiBranch: ApiBranchResponse): BranchData {
    return {
      id: apiBranch.id,
      branchId: apiBranch.id.toString(),
      branchName: apiBranch.branchName,
      whatsappOrderNumber: apiBranch.whatsappOrderNumber,
      email: apiBranch.contact?.mail || null,
      branchStatus: apiBranch.branchStatus,
      restaurantId: apiBranch.restaurant?.restaurantId || 0,
      branchLogoPath: apiBranch.branchLogoPath,
      isOpenNow: apiBranch.isOpenNow || false,
      isTemporarilyClosed: apiBranch.isTemporarilyClosed,
      createAddressDto: {
        country: apiBranch.address?.country || null,
        city: apiBranch.address?.city || null,
        street: apiBranch.address?.street || null,
        zipCode: apiBranch.address?.zipCode || null,
        addressLine1: apiBranch.address?.addressLine1 || null,
        addressLine2 : apiBranch.address?.addressLine2 || null,
      },
      createContactDto :{
          phone: apiBranch.whatsappOrderNumber || '',
          mail: apiBranch.contact.mail || '',
          location: apiBranch?.contact.location || '',
          contactHeader: apiBranch?.contact.contactHeader || '',
          footerTitle: apiBranch?.contact.footerTitle || '',
          footerDescription: apiBranch?.contact.footerDescription || '',
          openTitle: apiBranch?.contact.openTitle || '',
          openDays: apiBranch?.contact.openDays || '',
          openHours: apiBranch?.contact.openHours || '',
      },
      workingHours: apiBranch.workingHours?.map(wh => ({
        openTime: wh.openTime,
        closeTime: wh.closeTime,
        dayOfWeek: wh.dayOfWeek,
        isWorkingDay : wh.isWorkingDay
      })) || []
    };
  }

  async updateBranch(id: number, data: Partial<CreateBranchWithDetailsDto>): Promise<BranchData> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch güncelleme isteği gönderiliyor', { id, data, branchId }, { prefix: 'BranchService' });

      // Transform the data to match the API's expected format
      const batchUpdateData: BatchUpdateBranchDto = {
        branchName: data.branchName?.trim() || null,
        whatsappOrderNumber: data.whatsappOrderNumber?.trim() || null,
        branchLogoPath: data.branchLogoPath || null,
      };

      // Transform address data if provided
      if (data.createAddressDto) {
        batchUpdateData.batchUpdateAddressDto = {
          country: data.createAddressDto.country?.trim() || null,
          city: data.createAddressDto.city?.trim() || null,
          street: data.createAddressDto.street?.trim() || null,
          adressLine1: data.createAddressDto.addressLine1?.trim() || null,
          adressLine2: data.createAddressDto.addressLine2?.trim() || null,
          zipCode: data.createAddressDto.zipCode?.trim() || null,
        };
      }

      // Transform contact data if provided
      if (data.createContactDto) {
        batchUpdateData.batchUpdateContactDto = {
          contactHeader: data.createContactDto.contactHeader?.trim() || null,
          location: data.createContactDto.location?.trim() || null,
          phone: data.createContactDto.phone?.trim() || null,
          mail: data.createContactDto.mail?.trim() || null,
          footerTitle: data.createContactDto.footerTitle?.trim() || null,
          footerDescription: data.createContactDto.footerDescription?.trim() || null,
          openTitle: data.createContactDto.openTitle?.trim() || null,
          openDays: data.createContactDto.openDays?.trim() || null,
          openHours: data.createContactDto.openHours?.trim() || null,
        };
      }

      // Transform working hours data if provided
      if (data.createBranchWorkingHourCoreDto && data.createBranchWorkingHourCoreDto.length > 0) {
        batchUpdateData.batchUpdateBranchWorkingHourDto = data.createBranchWorkingHourCoreDto.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isWorkingDay: hour.isWorkingDay
        }));
      }

      logger.info('Transformed batch update data', batchUpdateData, { prefix: 'BranchService' });

      const params = branchId ? { branchId } : {};
      const response = await httpClient.put<any>(`${this.baseUrl}/${id}/batch-update`, batchUpdateData, { params });
      logger.info('Branch Update API Response alındı', response.data, { prefix: 'BranchService' });
      return response.data.data!;
    } catch (error: any) {
      logger.error('Branch güncelleme hatası', error, { prefix: 'BranchService' });

      // Enhanced error handling
      if (error.response?.data?.errors) {
        logger.error('API Validation Hataları:', error.response.data.errors, { prefix: 'BranchService' });
      }

      throw error;
    }
  }

  async deleteBranch(id: number): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const branchId = getEffectiveBranchId();

      logger.info('Branch silme isteği gönderiliyor', { id, branchId }, { prefix: 'BranchService' });

      const params = branchId ? { branchId } : {};
      await httpClient.delete(`${this.baseUrl}/${id}`, { params });

      logger.info('Branch başarıyla silindi', { id }, { prefix: 'BranchService' });
    } catch (error: any) {
      logger.error('Branch silme hatası', error, { prefix: 'BranchService' });
      throw error;
    }
  }

  async toggleTemporaryClose(branchId: number, isTemporarilyClosed: boolean, isOpenNow: boolean): Promise<void> {
    try {
      // Get effective branch ID (from localStorage or token)
      const effectiveBranchId = getEffectiveBranchId();

      logger.info('Branch temporary close güncelleme isteği', { branchId, isTemporarilyClosed, isOpenNow, effectiveBranchId }, { prefix: 'BranchService' });

      // Backend sadece boolean değer bekliyor olabilir
      const params = effectiveBranchId ? { branchId: effectiveBranchId } : {};
      await httpClient.patch(`${this.baseUrl}/${branchId}/temporary-close`, isTemporarilyClosed, { params });

      logger.info('Branch temporary close durumu güncellendi', null, { prefix: 'BranchService' });
    } catch (error: any) {
      logger.error('Branch temporary close güncelleme hatası', error, { prefix: 'BranchService' });

      // Detaylı hata mesajı
      if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.errors) {
          // Validation error'ları göster
          const validationErrors = Object.values(errorData.errors).flat();
          throw new Error(`Doğrulama hatası: ${validationErrors.join(', ')}`);
        } else {
          throw new Error('Geçersiz istek. Lütfen verileri kontrol edin.');
        }
      } else if (error?.response?.status === 401) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (error?.response?.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.');
      } else if (error?.response?.status === 404) {
        throw new Error('Şube bulunamadı.');
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      } else {
        throw new Error(`Şube durumu güncellenirken hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
      }
    }
  }
}

export const branchService = new BranchService();