import { BranchData } from "./BranchManagement/type";

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  response?: any; 
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterDto {
  name: string;
  surName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  profileImagePath: string; 
  termsofUserService: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  expiresIn: number;
  tokenType: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

// Restaurant Types
export interface CreateRestaurantDto {
  restaurantName: string;
  userId: string;
  restaurantLogoPath?: string;
  description?: string;
  workPermitFilePath?: string;
  foodCertificateFilePath?: string;
  cuisineType: number;
  hasAlcoholService: boolean;
  companyTitle: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber?: string;
  tradeRegistryNumber?: string;
  legalType: string;
  isActive: boolean;
  supportedLanguages?: string[];
  defaultLanguage?: string;
}

export interface CreateRestaurantResponse {
  message: string;
  restaurantId: number;
}
export interface CreateBranchWithDetailsDto {
  branchName: string | null;
  whatsappOrderNumber: string | null;
  restaurantId: number;
  branchLogoPath?: string | null;
  createAddressDto: CreateAddressCoreDto;
  createContactDto: CreateContactCoreDto;
  createBranchWorkingHourCoreDto: CreateBranchWorkingHourCoreDto[] | null;
}

export interface CreateAddressCoreDto {
  country: string | null;
  city: string | null;
  street: string | null;
  zipCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
}

export interface CreateContactCoreDto {
  phone: string | null;
  mail: string | null;
  location: string | null;
  contactHeader: string | null;
  footerTitle: string | null;
  footerDescription: string | null;
  openTitle: string | null;
  openDays: string | null;
  openHours: string | null;
}

export interface TimeSpan {
  hours: number;
  minutes: number;
}

export interface CreateBranchWorkingHourCoreDto {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isWorkingDay: boolean;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export interface CreateBranchResponse {
  branchId: number;
  message: string;
}

export interface MediaUploadResponse {
  url: string;
  publicId?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
}

export enum CuisineType {
  Turkish = 0,
  Italian = 1,
  Chinese = 2,
  Japanese = 3,
  Mexican = 4,
  Indian = 5,
  French = 6,
  American = 7,
  Mediterranean = 8,
  Thai = 9,
  Korean = 10,
  Vietnamese = 11,
  Greek = 12,
  Spanish = 13,
  Lebanese = 14,
  Brazilian = 15,
  German = 16,
  Russian = 17,
  British = 18,
  Ethiopian = 19,
  Moroccan = 20,
  Argentinian = 21,
  Peruvian = 22,
  Caribbean = 23,
  Fusion = 24,
  Vegan = 25,
  Seafood = 26,
  Steakhouse = 27,
  FastFood = 28
}

export interface MediaUploadRequest {
  file: File;
  uploadType?: 'restaurant-logo' | 'work-permit' | 'food-certificate' | 'branch-logo' | 'other';
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  restaurantId: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateBranchDto {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  restaurantId: string;
  latitude?: number;
  longitude?: number;
}

export interface SelectionScreenData {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoPath: string;
  restaurantStatus: boolean;
  canAccessRestaurantPanel: boolean;
  userType: string;
  availableBranches: BranchData[];
}

export interface RestaurantManagementInfo {
  restaurantId: number;
  restaurantName: string;
  restaurantLogoPath: string;
  restaurantStatus: boolean;
  cuisineTypeId: number;
  hasAlcoholService: boolean;
  companyTitle: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  tradeRegistryNumber: string;
  legalType: string;
  workPermitFilePath: string;
  foodCertificateFilePath: string;
  restaurantDateCreated: string;
  about: string | null;
}

export interface UpdateRestaurantDto {
  restaurantId: number;
  restaurantName?: string | null;
  restaurantLogoPath?: string | null;
  cuisineType?: number;
  hasAlcoholService?: boolean | null;
  companyTitle?: string | null;
  taxNumber?: string | null;
  taxOffice?: string | null;
  mersisNumber?: string | null;
  tradeRegistryNumber?: string | null;
  legalType?: string | null;
  workPermitFilePath?: string | null;
  foodCertificateFilePath?: string | null;
  restaurantStatus?: boolean | null;
  restaurantDateModified?: string | null;
}






export interface OldRoleType {
  id: string; 
  name: string;
  description?: string;
  category: string;
  restaurantName: string;
  branchName?: string;
  isActive: boolean;
  isSystemRole: boolean;
  userCount: number; // This property is MISSING from the new API
  permissionCount: number; // This property is MISSING from the new API
}
export interface UpdateAboutDto {
  about?: string | null;
}

export interface UpdateRestaurantManagementRequest {
  updateRestaurantDto: UpdateRestaurantDto;
  updateAboutDto: UpdateAboutDto;
}








// About Types
export interface CreateAboutDto {
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
  restaurantId: number;
}

export interface AboutInfo {
  about: string;
  id?: number;
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
  restaurantId: number;
  createdDate?: string;
  modifiedDate?: string;
}

export interface CreateAboutResponse {
  message: string;
  aboutId?: number;
}


export interface BranchInfo {
  branchId: string;
  branchName: string;
  branchStatus: boolean;
  isTemporarilyClosed: boolean;
  isOpenNow: boolean;
  branchLogoPath: string | null;
  BranchIsOpen?: boolean;
}

export interface BranchesResponseItem {
  branch: BranchInfo;
}

export type BranchesResponse = BranchesResponseItem[]; 

export interface BranchAddress {
  addressId: number;
  country: string | null;
  fullAdress?: string | null;
  city: string | null;
  street?: string | null;
  zipCode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
}

export interface BranchContact {
  contactId: number;
  phone: string | null;
  mail: string | null;
  location?: string | null;
  contactHeader?: string | null;
  footerTitle?: string | null;
  footerDescription?: string | null;
  openTitle?: string | null;
  openDays?: string | null;
  openHours?: string | null;
}

export interface BranchWorkingHour {
  id: number;
  dayOfWeek: number; 
  openTime: string; 
  closeTime: string; 
  isWorkingDay: boolean;
}

export interface BranchDetailResponse {
  id: number;
  branchId: number; 
  branchName: string;
  branchTag?: string | null;
  branchStatus: boolean;
  isTemporarilyClosed: boolean;
  isOpenNow: boolean | null;
  whatsappOrderNumber: string | null;
  branchLogoPath: string | null;
  branchDateCreated: string;
  branchDateModified: string | null;
  restaurantId: number;
  restaurant?: any | null;
  address: BranchAddress | null;
  contact: BranchContact | null;
  workingHours: BranchWorkingHour[] | null;
  categories?: any | null;
  menuTables?: any | null;
  activeOrders?: any | null;
}

export interface BranchEditFormData {
  branchName: string;
  restaurantId: number;
  whatsappOrderNumber: string | null;
  branchLogoPath: string | null;
  createAddressDto: {
    country: string | null;
    city: string | null;
    street: string | null;
    zipCode: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
  };
  createContactDto: {
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
  createBranchWorkingHourCoreDto: CreateBranchWorkingHourCoreDto[];
}

export function convertBranchDetailToFormData(
  branchDetail: BranchDetailResponse,
  defaultWorkingHours: CreateBranchWorkingHourCoreDto[]
): BranchEditFormData {
  return {
    branchName: branchDetail.branchName || '',
    restaurantId: branchDetail.restaurantId,
    whatsappOrderNumber: branchDetail.whatsappOrderNumber || null,
    branchLogoPath: branchDetail.branchLogoPath || null,
    createAddressDto: {
      country: branchDetail.address?.country || null,
      city: branchDetail.address?.city || null,
      street: branchDetail.address?.street || null,
      zipCode: branchDetail.address?.zipCode || null,
      addressLine1: branchDetail.address?.addressLine1 || null,
      addressLine2: branchDetail.address?.addressLine2 || null,
    },
    createContactDto: {
      phone: branchDetail.contact?.phone || null,
      mail: branchDetail.contact?.mail || null,
      location: branchDetail.contact?.location || null,
      contactHeader: branchDetail.contact?.contactHeader || null,
      footerTitle: branchDetail.contact?.footerTitle || null,
      footerDescription: branchDetail.contact?.footerDescription || null,
      openTitle: branchDetail.contact?.openTitle || null,
      openDays: branchDetail.contact?.openDays || null,
      openHours: branchDetail.contact?.openHours || null,
    },
    createBranchWorkingHourCoreDto: branchDetail.workingHours?.length
      ? branchDetail.workingHours.map(wh => ({
          dayOfWeek: wh.dayOfWeek,
          openTime: wh.openTime || '08:00:00',
          closeTime: wh.closeTime || '22:00:00',
          isWorkingDay: wh.isWorkingDay ?? true,
        }))
      : defaultWorkingHours,
  };
}

export interface BatchUpdateAddressDto {
  country?: string | null;
  city?: string | null;
  street?: string | null;
  adressLine1?: string | null;  
  adressLine2?: string | null;  
  zipCode?: string | null;
}

export interface BatchUpdateContactDto {
  contactHeader?: string | null;
  location?: string | null;
  phone?: string | null;
  mail?: string | null;
  footerTitle?: string | null;
  footerDescription?: string | null;
  openTitle?: string | null;
  openDays?: string | null;
  openHours?: string | null;
}

export interface BatchUpdateBranchWorkingHourDto {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isWorkingDay: boolean;
}

export interface BatchUpdateBranchDto {
  branchName?: string | null;
  whatsappOrderNumber?: string | null;
  branchLogoPath?: string | null;
  batchUpdateAddressDto?: BatchUpdateAddressDto;
  batchUpdateContactDto?: BatchUpdateContactDto;
  batchUpdateBranchWorkingHourDto?: BatchUpdateBranchWorkingHourDto[];
}