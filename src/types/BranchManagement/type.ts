import { APIAllergen } from "../../services/allergen";
import { BranchProductAddon } from "../../services/Branch/BracnhService";
import { APIIngredient, Category, Product } from "../dashboard";

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
  workingHours?: Array<{
    openTime: string;
    closeTime: string;
    dayOfWeek: number;
    isWorkingDay:boolean
  }>;
}


export interface EditDataType {
  branchName: string;
  whatsappOrderNumber: string;
  email: string;
  branchLogoPath?: string; // Added to support logo editing
  createAddressDto: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
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
  createBranchWorkingHourCoreDto: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isWorkingDay: boolean;
  }>;
}


export interface BranchInfoProps {
  selectedBranch: BranchData | null;
  isEditing: boolean;
  editData: EditDataType;
  t: (key: string) => string;
  handleInputChange: (path: string, value: string) => void;
}


export interface APIProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
}

export interface DetailedProduct{
  id : number;
  branchProductId?: number;
  originalProductId: number;
  product?: APIProduct;
  branchCategory?: Category;
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
  orderDetails?: any;
  isSelected?: boolean;
  addonsCount?: number; // New field for addon count
  hasAddons?: boolean;   // New field to indicate if product has addons
  price: number; // Branch-specific price
  imageUrl?: string; // Branch-specific image URL
  name: string; // Branch-specific name
  description?: string; // Branch-specific description
  status: boolean; // Branch-specific status
  displayOrder: number; // Branch-specific display order
  editedPrice?: number; // For tracking price edits
  editedName?: string; // For tracking name edits
  editedDescription?: string; // For tracking description edits
}

export interface BranchCategory {
  branchCategoryId: number;
  branchId: number;
  categoryId: number;
  category: {
    categoryId: number;
    categoryName: string;
    status: boolean;
    displayOrder: number;
    restaurantId: number;
  };
  isActive: boolean;
  displayName: string;
  displayOrder: number;
  products?: DetailedProduct[]; 
  selectedProductsCount?: number;
  unselectedProductsCount?: number;
}

export interface EditedProductPrice {
  productId: number;
  originalPrice: number;
  newPrice: number;
}

export interface EditedCategoryName {
  categoryId: number;
  originalName: string;
  newName: string;
}

// New interfaces for addon management
export interface ProductAddonData {
  branchProductId: number;
  availableAddons: BranchProductAddon[];
  selectedAddons: any[];
  isLoading: boolean;
}





export interface Allergen {
  id: number;
  code: string;
  name: string;
  icon: string;
  displayOrder: number;
  description: string;
}

export interface EnhancedAddon extends BranchProductAddon {
  assignmentId?: number;
  isAssigned: boolean;
  currentSpecialPrice?: number;
  currentMarketingText?: string;
  currentMaxQuantity?: number;
  currentMinQuantity?: number;
  currentGroupTag?: string;
  currentIsGroupRequired?: boolean;
  currentIsActive?: boolean;
  currentDisplayOrder?: number;
  editedSpecialPrice?: number;
  editedMarketingText?: string;
  editedMaxQuantity?: number;
  editedMinQuantity?: number;
  editedGroupTag?: string;
  editedIsGroupRequired?: boolean;
  editedIsRecommended?: boolean;
}