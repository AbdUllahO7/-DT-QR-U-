// Restaurant Types
export interface RestaurantInfo {
  restaurantId: number;
  restaurantName: string;
  cuisineType: string;
  branchCount: number;
  activeBranchCount: number;
  hasAlcoholService: boolean;
  restaurantStatus: boolean;
  restaurantLogoPath: string;
}

export interface DeletedRestaurant {
  id: string;
  name: string;
  description?: string;
  deletedAt: string;
  userId: string;
}

export interface RestaurantBranchDropdownItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  branchTag: string;
}

export interface CreateRestaurantDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  creatorUserId: string;
}

export interface RestaurantManagementInfo {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoPath: string;
  cuisineTypeId: number | null;
  hasAlcoholService: boolean;
  companyTitle: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  tradeRegistryNumber: string;
  legalType: string;
  workPermitFilePath: string;
  foodCertificateFilePath: string;
  restaurantStatus: string;
  about: string;
}

export interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  userId: string;
}

export type ActiveTab = 'restaurants' | 'branches' | 'management' | 'deleted';