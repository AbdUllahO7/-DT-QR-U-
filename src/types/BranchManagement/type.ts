import { Armchair, Layers, Table, Tag, Utensils } from "lucide-react";
import { BranchProductAddon } from "../../services/Branch/BranchService";
import { ReactNode } from "react";
import { OrderStatusEnums } from "../Orders/type";
import { CreateRoleDto, CreateUserDto, PermissionOption, Role } from "../users/users.type";

export interface BranchData {
  id: number;
  branchId: string;
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
  addonsCount?: number; 
  hasAddons?: boolean;   
  price: number; 
  imageUrl?: string; 
  name: string; 
  description?: string; 
  status: boolean; 
  displayOrder: number; 
  editedPrice?: number; 
  editedName?: string; 
  editedDescription?: string; 
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




// Step enum for the multi-step process
export enum AdditionStep {
  SELECT_CATEGORIES = 'select_categories',
  SELECT_PRODUCTS = 'select_products',
  REVIEW_SELECTION = 'review_selection'
}

export interface CategoriesContentProps {
  activeTab: 'add' | 'manage';
  branchId: number;
  categories: Category[];
  branchCategories: BranchCategory[];
  selectedCategories: Set<number>;
  selectedProducts: Set<number>;
  categoriesWithProducts: Category[];
  currentStep: AdditionStep;
  expandedCategories: Set<number>;
  expandedBranchCategories: Set<number>;
  isReorderMode: boolean;
  hasUnsavedChanges: boolean;
  isReordering: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isLoadingProducts: boolean;
  isLoadingBranchProducts: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategories: (categories: Set<number>) => void;
  setSelectedProducts: (products: Set<number>) => void;
  setCurrentStep: (step: AdditionStep) => void;
  setExpandedCategories: (categories: Set<number>) => void;
  setExpandedBranchCategories: (categories: Set<number>) => void;
  setIsReorderMode: (mode: boolean) => void;
  setEditingProductId: (id: number | null) => void;
  setEditingCategoryId: (id: number | null) => void;
  handleShowProductDetails: (product: DetailedProduct) => void;
  onCategorySelect: (categoryId: number) => void;
  onProductSelect: (productId: number) => void;
  onSelectAllProducts: () => void;
  onClearAllProducts: () => void;
  onProceedToProductSelection: () => void;
  onProceedToReview: () => void;
  onBackToCategorySelection: () => void;
  onBackToProductSelection: () => void;
  onSave: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSaveOrder: () => void;
  handleShowProductExtras: (product: DetailedProduct) => void;
  onAddProduct: (productId: number, branchCategoryId: number) => void;
  onRemoveProduct: (branchProductId: number, productName?: string) => void;
  onDeleteCategory: (branchCategoryId: number, categoryName: string) => void;
  onRefresh: () => void;
  setActiveTab: (tab: 'add' | 'manage') => void;
  editedProductPrices: Map<number, EditedProductPrice>;
  editedCategoryNames: Map<number, EditedCategoryName>;
  editingProductId: number | null;
  editingCategoryId: number | null;
  onProductPriceEdit: (productId: number, originalPrice: number) => void;
  onProductPriceChange: (productId: number, newPrice: string) => void;
  onProductPriceSave: (productId: number) => void;
  onProductPriceCancel: (productId: number) => void;
  onCategoryNameEdit: (categoryId: number, originalName: string) => void;
  onCategoryNameChange: (categoryId: number, newName: string) => void;
  onCategoryNameSave: (categoryId: number) => void;
  onCategoryNameCancel: (categoryId: number) => void;
  getProductPrice: (productId: number, originalPrice: number) => number;
  getCategoryName: (categoryId: number, originalName: string) => string;
  handleShowProductAddons?: (product: DetailedProduct) => void;
  isCategoryActive: (categoryId: number) => boolean;
}


export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DetailedProduct | null;
}

// Move to a config file for better maintainability
export const DEFAULT_IMAGE_URL = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
// Modern theme with enhanced colors and styling
export const theme = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/50',
  success: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500/50',
  neutral: 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 focus:ring-slate-500/50',
  danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:ring-red-500/50',
  text: {
    primary: 'text-slate-800 dark:text-slate-100',
    secondary: 'text-slate-600 dark:text-slate-300',
    muted: 'text-slate-500 dark:text-slate-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
  },
  background: {
    card: 'bg-white/90 dark:bg-slate-800/90',
    cardHover: 'hover:bg-white/95 dark:hover:bg-slate-800/95',
  }
};

export interface BranchHeaderProps {
  selectedBranch: BranchData | null;
  isEditing: boolean;
  isLoading: boolean;
  t: (key: string) => string;
  isRTL: boolean;
  setIsEditing: (editing: boolean) => void;
  handleToggleTemporaryClose: () => Promise<void>;
  handleSave: () => Promise<void>;
  initializeEditData: (branch: BranchData) => void;
  setEditData: React.Dispatch<React.SetStateAction<EditDataType>>;
}
export interface CategoryData {
  id: number;
  categoryName: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
  branchId: number;
  tableCount?: number;
}

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
  rowVersion : string
}


export interface TableCardProps {
  table: TableData;
  // Optional props for different contexts
  isEditing?: boolean;
  isToggling?: boolean;
  isClearing?: boolean;
  categoryColor?: string;

  // Required actions
  onEdit: (table?: TableData) => void;
  onDelete: (tableId: number) => void | Promise<void>;
  onToggleStatus: (tableId: number, newStatus?: boolean) => void | Promise<void>;
  onShowQRCode?: (table: TableData) => void;
  onDownload?: (table: TableData) => void;

  // Optional actions (for Branch Tables context)
  onCancelEdit?: () => void;
  onUpdate?: (tableId: number, updatedData: Partial<TableData>) => Promise<void>;
  onToggleOccupation?: (tableId: number, isOccupied: boolean) => Promise<void>;
  onClearTable?: (tableId: number) => Promise<void>;
  onTableChange?: (tableId: number, updatedData: Partial<TableData>) => void;
}

export interface OrderData {
  id: string;
  customerName: string;
  orderNumber: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  orderTime: string;
  table: string;
}

export interface OrderCardProps {
  order: OrderData;
  onViewDetails: (order: OrderData) => void;
  onStatusChange: (orderId: string, status: OrderData['status']) => void;
}

export interface UserSettingsState {
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  soundEnabled: boolean;
  autoSaveEnabled: boolean;
  dataSyncEnabled: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface BranchDropdownItem {
  branchId: number;
  branchName: string;
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
  rowVersion?: string;
}

// API DTO Types
export interface CreateMenuTableDto {
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

export interface BatchCreateMenuTableItemDto {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

export interface CreateBatchMenuTableDto {
  items: BatchCreateMenuTableItemDto[];
}

export interface CategoryQuantityItem {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
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
export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: Partial<QRCodeData>;
  onChange: (field: keyof QRCodeData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void; // Keep for compatibility but not used
  isSubmitting: boolean;
  isEditMode?: boolean;
  onSuccess?: () => void;
  selectedBranchForEdit?: BranchDropdownItem | null;
  categories?: TableCategory[];
}

export type ModalStep = 'selection' | 'single' | 'bulk';


// CreateMenuTableCategoryDto formatına uygun interface
export interface TableCategoryPayload {
  categoryName: string | null;
  description: string | null;
  colorCode: string | null;
  iconClass: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const iconOptions = [
  { value: 'table', label: 'TableCategoryModal.table', icon: Table },
  { value: 'chair', label: 'TableCategoryModal.chair', icon: Armchair },
  { value: 'utensils', label: 'TableCategoryModal.service', icon: Utensils },
  { value: 'tag', label: 'TableCategoryModal.label', icon: Tag },
  { value: 'layers', label: 'TableCategoryModal.layer', icon: Layers },
];

export const colorPresets = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

// Form için ayrı interface
export interface TableCategoryFormData {
  categoryName: string;
  description: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
}

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

export interface GroupedTables {
  [categoryId: string]: {
    category: TableCategory;
    tables: TableData[];
  };
}

export const CATEGORY_COLORS: Record<string, string> = {
  Category: 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300',
  BranchCategory: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300',
  Product: 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300',
  BranchProduct: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300',
  BranchQRCode: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-300',
  Order: 'bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300',
  Restaurant: 'bg-orange-100 text-orange-900 dark:bg-orange-900/20 dark:text-orange-300',
  Branch: 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300',
  Admin: 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300',
};


export interface CardData {
  id: number;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface InvoiceData {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
  description: string;
}
export interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: CreateUserDto) => void;
    roles: Role[];
    isLoading: boolean;
  }
  // Create Role Modal Component
  export interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (roleData: CreateRoleDto) => void;
    permissions: PermissionOption[];
    isLoading: boolean;
  }


export interface AllergenDetail {
  allergenId: number;
  containsAllergen: boolean;
  note: string;
}
export interface Ingredient {
  id: number;
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
    ingredientName?: string;

  allergenDetails: AllergenDetail[];
  unit:string;
    price?: number;

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
export interface APIAllergen {
  displayOrder: number;
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
  presence:number,
}
export interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ingredient?: Ingredient | null;
  allergens: Allergen[];
  isEdit?: boolean;
}


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
  branchCategory?:Category
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
  originalProductId:number,

}

export interface Category {
  [x: string]: any;
  productId: any;
  name: any;
  categoryId: number;
  categoryName: string;
  description: string;
  isExpanded: boolean;
  products: Product[];
  status : boolean;
  displayOrder : number;
  restaurantId: number,
}
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
  orderId: string;
  customerName: string;
  notes?: string;
  orderTypeId: number;
  status: OrderStatusEnums;
  totalAmount: number;
  totalQuantity: number;
  createdDate: string;
  modifiedDate?: string;
  tableId?: number;
  sessionId?: string;
  orderTag?: string;
  rowVersion: string;
  items?: OrderItem[];
  createdAt: Date;
  confirmedAt?: Date;
  totalPrice: number;
  subTotal?:number;
  serviceFeeApplied?:number
  orderTypeName:string
  orderTypeIcon:string
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

export interface APIIngredient {
  id :number,
  name :string,
  ingredientId: number;
  ingredientName: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  restaurantId: number;
  products: any[];
  quantity?:number,
  unit?:number,
  productIngredients: any[];
  allergens: APIAllergen[]; // ← FIXED: This matches the actual API response
}


export type SortOption = 'name_asc' | 'name_desc' | 'status_asc' | 'status_desc' | 'allergen_asc' | 'allergen_desc';
export type FilterStatus = 'all' | 'available' | 'unavailable';
export type FilterAllergen = 'all' | 'allergenic' | 'non-allergenic';

export interface FilterOptions {
  status: FilterStatus;
  allergen: FilterAllergen;
  selectedAllergens: number[];
}

export interface SetupSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurantName: string;
  branchName: string | null;
  isBranchOnly: boolean;
  onLogout: () => void;
  onSelectBranch: (item: RestaurantBranchDropdownItem) => void;
  onBackToMain: () => void;
}
export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurantName: string;
  branchName: string | null;
  isBranchOnly: boolean;
  onLogout: () => void;
  onSelectBranch: (item: RestaurantBranchDropdownItem) => void;
  onBackToMain: () => void;
}

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateCategoryFormData {
  categoryName: string;
  status: boolean;
}

export interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isAvailable: boolean;
  imageFile: File | null;
  imageUrl: string;
}

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (productId?: number) => void;
  categories: Category[];
  selectedCategoryId?: number;
  onOpenIngredientSelection?: (productId: number, productName: string) => void;
}

export interface ProductAddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}

// Interface for selected product data
export interface SelectedProductData {
  productId: number;
  marketingText: string;
  isRecommended: boolean;
}



// New interface for ingredient selection with quantity and unit
export interface SelectedIngredient {
  ingredientId: number;
  quantity: number;
  unit: string;
}

export interface ProductIngredientSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}



export interface ProductIngredient {
  ingredientId: number;
  quantity: number;
  unit: string;
}

export interface ProductIngredientUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}

/* export interface Ingredient {
  id: number;
  ingredientName: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

export interface AllergenDetail {
  allergenId: number;
  containsAllergen: boolean;
  note: string;
} */

// Define Addon type
export interface ProductAddon {
  id: number;
  productId: number;
  addonProductId: number;
  displayOrder: number;
  isRecommended: boolean;
  marketingText: string;
  addonProduct?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    isAvailable: boolean;
  };
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}




export interface OrderItem {
  id: number;
  orderItemId?: number;
  branchProductId: number;
  productName: string;
  categoryName?: string | null;
  price: number;
  quantity?: number;
  count?: number;
  totalPrice: number;
  imageUrl?: string | null;
  description?: string | null;
  notes?: string;
  note?: string;
  isAddon: boolean;
  parentOrderItemId?: number | null;
  addonItems: OrderItem[];
  parentOrderDetailId:number;
  orderDetailId:number
  addonPrice?: number | null;
  addonNote?: string | null;
  isProductDeleted:boolean;
  lastModifiedAt:string;
  lastModifiedBy:string;
  modificationLog:string
}




export interface TableBasketSummary {
  tableId: number;
  tableName: string;
  totalAmount: number;
  totalQuantity: number;
  itemsCount: number;
  hasActiveBasket: boolean;
}

export interface OrderTrackingInfo {
  orderId: string;
  orderTag: string;
  totalPrice: number;
  orderStatus: string;
  statusCode: number;
  orderDate: string;
  createdAt: string;
  confirmedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  rejectionReason?: string | null;
  cancellationReason?: string | null;
  customerName: string;
  confirmedByUserId?: number | null;
  notes?: string;
  sessionId?: string | null;
  branchId: number;
  orderTypeName: string;
  tableId?: number | null;
  tableName?: string;
  items: OrderItem[];
  isConfirmed: boolean;
  isReady: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
  rowVersion: string;
}

export interface QRTrackingInfo {
  qrCode: string;
  trackingUrl: string;
  orderTag: string;
}



export enum OrderTypeEnum {
  DineIn = 1,
  Takeaway = 2,
  Delivery = 3
}

export interface CreateSessionOrderDto {
  customerName: string;
  notes?: string;
  orderTypeId: number;
  tableNumber?: string;
  deliveryAddress?: string;
  customerPhone?: string;
  paymentMethod: string;

}

export interface ConfirmOrderDto {
  rowVersion: string;
}

export interface RejectOrderDto {
  rejectionReason: string;
  rowVersion: string;
}

export interface UpdateOrderStatusDto {
  newStatus: OrderStatusEnums;
  notes?: string;
  rowVersion: string;
}

export interface SmartCreateOrderDto {
  includeAllTableBaskets: boolean;
  customerName: string;
  notes?: string;
  orderTypeId: number;
}
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Enhanced filtering interface

export interface PendingOrder {
  id: number;
  orderTag: string;
  totalPrice: number;
  itemCount: number;
  createdAt: string;
  tableId?: number;
  tableName?: string;
  customerName: string;
  sessionId?: string;
  items: OrderItem[];
  rowVersion: string;
  orderTypeName:string
  orderTypeIcon:string;
  orderTypeCode:string
}


// Pagination interface
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
export interface BranchOrder {
  id: number;
  orderTag: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
  tableId?: number;
  tableName?: string;
  customerName: string;
  items: OrderItem[];
  itemCount: number;
  rowVersion: string;
  orderTypeName : string
  orderTypeIcon:string;
  orderTypeCode:string

}
// Enhanced component state
export interface OrdersManagerState {
  // Branch related states
  branches: BranchDropdownItem[];
  selectedBranch: BranchDropdownItem | null;
  isBranchDropdownOpen: boolean;
  
  // Existing fields...
  pendingOrders: PendingOrder[];
  branchOrders: BranchOrder[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  viewMode: 'pending' | 'branch';
  showConfirmModal: boolean;
  showRejectModal: boolean;
  showStatusModal: boolean;
  showDetailsModal: boolean;
  activeOrderId: string | null;
  activeRowVersion: string | null;
  rejectReason: string;
  newStatus: OrderStatusEnums | null;
  expandedRows: Set<string>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  
  filters: {
    search: string;
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
    priceRange: {
      min: number | null;
      max: number | null;
    };
    orderType: string;
    customerName: string;
    tableName: string;
  };
  
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  
  showAdvancedFilters: boolean;
  filteredOrders: (PendingOrder | BranchOrder)[];
}




// Pagination interface

