// API Response Types
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
  response?: any; // Orijinal yanıtı saklamak için
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
  profileImagePath: string; // Required field - API'de zorunlu
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
}

export interface CreateRestaurantResponse {
  message: string;
  restaurantId: number;
}

// Restaurant Branch Dropdown Types
export interface RestaurantBranchDropdownItem {
  id: number;
  name: string;
  type: 'branch';
  isActive: boolean;
  branchTag?: string;
}

export interface RestaurantBranchDropdownResponse {
  items: RestaurantBranchDropdownItem[];
}

// Branch Types
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

// Media Types
export interface MediaUploadResponse {
  url: string;
  publicId?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
}

// Restaurant Management Types
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


// Media Upload Types
export interface MediaUploadRequest {
  file: File;
  uploadType?: 'restaurant-logo' | 'work-permit' | 'food-certificate' | 'branch-logo' | 'other';
}

// Branch Management Types
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

export interface BranchData {
  id: number;
  branchId: number;
  branchName: string;
  whatsappOrderNumber: string | null;
  email: string | null;
  branchStatus: boolean;
  restaurantId: number;
  branchLogoPath: string | null;
  isOpenNow: boolean;
  isTemporarilyClosed: boolean;
  createAddressDto: {
    country: string | null;
    city: string | null;
    street: string | null;
    zipCode: string | null;
    addressLine1: string | null;
  };
  workingHours?: Array<{
    openTime: string;
    closeTime: string;
    dayOfWeek: number;
  }>;
}

// Detailed Branch Response for edit modal
export interface BranchDetailResponse {
  branchId: number;
  branchName: string;
  whatsappOrderNumber?: string;
  restaurantId: number;
  branchLogoPath?: string;
  address?: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
    addressLine1: string;
    addressLine2?: string;
  };
  contact?: {
    phone: string;
    mail: string;
    location: string;
    contactHeader?: string;
    footerTitle?: string;
    footerDescription?: string;
    openTitle?: string;
    openDays?: string;
    openHours?: string;
  };
  workingHours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isWorkingDay: boolean;
  }>;
  branchStatus: boolean;
  isOpenNow: boolean;
  isTemporarilyClosed: boolean;
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

// Restaurant Management Info Types
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

// Update DTOs
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

export interface UpdateAboutDto {
  about?: string | null;
}

export interface UpdateRestaurantManagementRequest {
  updateRestaurantDto: UpdateRestaurantDto;
  updateAboutDto: UpdateAboutDto;
}

// User Profile Types
export interface AppUser {
  appUserId: string;
  name: string;
  surname: string;
  userName: string;
  email: string;
  restaurantId: number;
  restaurant: {
    restaurantId: number;
    restaurantName: string;
    restaurantLogoPath: string;
    restaurantStatus: boolean;
  };
  branchId: string | null;
  branch: any | null;
  profileImage: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface Permission {
  permissionId: number;
  name: string;
  description: string;
  category: string;
}

export interface AppRole {
  appRoleId: string;
  name: string;
  description: string;
  restaurantId: number | null;
  branchId: string | null;
  category: string;
  isSystemRole: boolean;
  createdDate: string;
  modifiedDate: string | null;
  permissions: Permission[];
}

export interface UserProfileResponse {
  appUser: AppUser;
  appRoles: AppRole[];
}

// Table Management Types
export interface TableData {
  id: number;
  menuTableName: string;
  qrCode: string;
  qrCodeUrl: string;
  menuTableCategoryId: number;
  categoryName: string;
  capacity: number;
  displayOrder: number | null;
  isOccupied: boolean;
  isActive: boolean;
  activeSessionId: number | null;
  branchId: number;
}

export interface TableCategory {
  id: number;
  categoryName: string;
  branchId: number;
  colorCode: string;
  displayOrder: number;
  iconClass: string;
  isActive: boolean;
  tableCount: number | null;
  description?: string;
}

export interface BranchDropdownItem {
  branchId: number;
  branchName: string;
}

// User Management Types
export interface UserData {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  createdDate: string;
  roles: string[];
  restaurantId: number;
  restaurantName: string;
  branchId: number | null;
  branchName: string | null;
}

export interface UsersResponse {
  users: UserData[];
}

// Role Management Types
export interface CreateRoleDto {
  name: string;
  description?: string | null;
  restaurantId?: number | null;
  branchId?: number | null;
  category?: string | null;
  isActive: boolean;
  permissionIds?: number[] | null;
}

export interface PermissionOption {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface CreateRoleResponse {
  roleId: number;
  message: string;
}

// User Creation Types
export interface CreateUserDto {
  name: string;
  surname: string;
  email: string;
  userName: string;
  phoneNumber?: string | null;
  password: string;
  restaurantId?: number | null;
  branchId?: number | null;
  roleIds?: string[] | null;
  profileImage?: string | null;
  isActive: boolean;
}

export interface CreateUserResponse {
  userId: string;
  message: string;
}

// About Types
export interface CreateAboutDto {
  imageUrl?: string | null;
  title?: string | null;
  description?: string | null;
  restaurantId: number;
}

export interface AboutInfo {
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

// Role List Types
export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isSystemRole: boolean;
  category: string;
  userCount: number;
  permissionCount: number;
  restaurantId: number;
  restaurantName: string;
  branchId: number | null;
  branchName: string | null;
}

// New User Profile API Types (for /api/Users/profile endpoint)
export interface UserProfileApiResponse {
  id: string;
  userName: string;
  email: string;
  name: string;
  surname: string;
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  restaurantId: number;
  branchId: number | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  userCreator: number;
  onboardingStatus: number;
  roles: string[];
  permissions: string[];
  restaurantName: string;
  branchName: string | null;
}

// New Branches API Response Types
export interface BranchInfo {
  branchId: number;
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