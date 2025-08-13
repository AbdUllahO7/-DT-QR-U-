// Dashboard bileşenleri için type tanımları

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl : string;
  status : boolean;
  displayOrder : number;
  branchProductId?:number
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  isExpanded: boolean;
  products: Product[];
  status : boolean;
  displayOrder : number;
  restaurantId: number
}

export interface QRCodeData {
  id: string;
  name: string;
  location: string;
  scans: number;
  lastScan: string;
  status: 'active' | 'inactive';
  url: string;
  description: string;
  type: 'global' | 'branch';
  branchId?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
}

// Chart data types
export interface WeeklyViewData {
  day: string;
  views: number;
  scans: number;
}

export interface PopularProductData {
  name: string;
  orders: number;
  percentage: number;
  fill: string;
}

export interface HourlyActivityData {
  hour: string;
  activity: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

// Order Types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  items: number;
  orderTime: string; // ISO date string
  table: string;
}

export interface CategoryReorderRequest {
  categoryOrders: Array<{
    categoryId: number;
    newDisplayOrder: number;
  }>;
}

export interface ProductReorderRequest {
  productOrders: Array<{
    productId: number;
    newDisplayOrder: number;
  }>;
}

// ALLERGEN TYPES

export interface AllergenDetail {
  allergenId: number;
  containsAllergen: boolean;
  note: string;
}

// FIXED: API Allergen type (matches actual API response)
export interface APIAllergen {
  id: number;
  allergenId: number;
  code: string | null;
  allergenCode: string;
  name: string;
  icon: string | null;
  description: string | null;
  productCount: number;
  containsAllergen: boolean | null;
  note: string | null;
}

// FIXED: API Ingredient type (matches actual API response)
export interface APIIngredient {
  ingredientId: number;
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  restaurantId: number;
  products: any[];
  productIngredients: any[];
  allergens: APIAllergen[]; // ← FIXED: This matches the actual API response
}

// Component/Internal Ingredient type (what your component uses)
export interface Ingredient {
  id: number;
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

export interface CreateIngredientData {
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

export interface UpdateIngredientData extends CreateIngredientData {
  id: number;
}