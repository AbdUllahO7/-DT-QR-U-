// ===== Base Extra Types =====

export interface Extra {
  id: number;
  extraCategoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl?: string;
  status: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateExtraData {
  extraCategoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl?: string;
  status: boolean;
}

export interface UpdateExtraData {
  id: number;
  extraCategoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl?: string;
  status: boolean;
}

export interface ReorderExtraItem {
  id: number;
  displayOrder: number;
}

export interface ReorderExtrasData {
  extraCategoryId: number;
  items: ReorderExtraItem[];
}

// ===== Extra Category Types =====

export interface ExtraCategory {
  id: number;
  categoryName: string;
  description?: string;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  status: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateExtraCategoryData {
  categoryName: string;
  description?: string;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  status: boolean;
}

export interface UpdateExtraCategoryData {
  id: number;
  categoryName: string;
  description?: string;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  status: boolean;
}

// ===== Product Extra Types =====

export interface ProductExtra {
  id: number;
  productId: number;
  extraId: number;
  selectionMode: number; // 0: Single, 1: Multiple
  defaultQuantity: number;
  defaultMinQuantity: number;
  defaultMaxQuantity: number;
  unitPrice: number;
  isRequired: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductExtraData {
  productId: number;
  extraId: number;
  selectionMode: number;
  defaultQuantity: number;
  defaultMinQuantity: number;
  defaultMaxQuantity: number;
  unitPrice: number;
  isRequired: boolean;
}

export interface UpdateProductExtraData {
  id: number;
  selectionMode: number;
  defaultQuantity: number;
  defaultMinQuantity: number;
  defaultMaxQuantity: number;
  unitPrice: number;
  isRequired: boolean;
}

export interface ReorderProductExtraItem {
  id: number;
  displayOrder: number;
}

export interface ReorderProductExtrasData {
  productId: number;
  extraCategoryId: number;
  items: ReorderProductExtraItem[];
}

// ===== Product Extra Category Types =====

export interface ProductExtraCategory {
  id: number;
  productId: number;
  extraCategoryId: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductExtraCategoryData {
  productId: number;
  extraCategoryId: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
}

export interface UpdateProductExtraCategoryData {
  id: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
}

export interface ReorderProductExtraCategoryItem {
  id: number;
  displayOrder: number;
}

export interface ReorderProductExtraCategoriesData {
  productId: number;
  items: ReorderProductExtraCategoryItem[];
}

// ===== BranchProductExtraCategories Types =====

export interface BranchProductExtraCategory {
  effectiveIsRequired: boolean;
  id: number;
  branchProductId: number;
  productExtraCategoryId: number;
  extraCategoryId?: number;
  extraCategoryName?: string;
  isRequired?: boolean;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  isActive: boolean;
  displayOrder?: number;
  activeExtrasCount?: number;
}

export interface CreateBranchProductExtraCategoryData {
  branchProductId: number;
  productExtraCategoryId: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  isActive: boolean;
}

export interface UpdateBranchProductExtraCategoryData {
  id: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  isActive: boolean;
}

export interface BatchBranchProductExtraCategoryItem {
  productExtraCategoryId: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  isActive: boolean;
  displayOrder: number;
}

export interface BatchBranchProductExtraCategoryData {
  branchProductId: number;
  items: BatchBranchProductExtraCategoryItem[];
}

export interface AvailableExtraCategory {
  productExtraCategoryId: number;
  extraCategoryId: number;
  extraCategoryName: string;
  isRequired: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  activeExtrasCount: number;
}

// ===== BranchProductExtras Types =====

export interface BranchProductExtra {
  id: number;
  branchProductId: number;
  productExtraId: number;
  extraId?: number;
  extraName?: string;
  categoryName?: string;
  selectionMode?: number;
  unitPrice?: number;
  isActive: boolean;
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
  displayOrder?: number;
  isRemoval?: boolean;
  isRemovalAllowed?: boolean;
}

export interface CreateBranchProductExtraData {
  branchProductId: number;
  productExtraId: number;
  isActive: boolean;
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
}

export interface UpdateBranchProductExtraData {
  id: number;
  isActive: boolean;
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
}

export interface BatchUpdateBranchProductExtraItem {
  productExtraId: number;
  isActive: boolean;
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
  displayOrder: number;
  isRemovalAllowed: boolean;
}

export interface BatchUpdateBranchProductExtraData {
  branchProductId: number;
  extras: BatchUpdateBranchProductExtraItem[];
}

export interface ReorderBranchProductExtraItem {
  id: number;
  displayOrder: number;
}

export interface AvailableProductExtra {
  productExtraId: number;
  extraId: number;
  extraName: string;
  categoryName: string;
  selectionMode: number;
  unitPrice: number;
  isRemoval: boolean;
}

export interface GroupedBranchProductExtra {
  categoryId: number;
  categoryName: string;
  extras: BranchProductExtra[];
}

// ===== API Response Types =====

export interface APIExtra {
  id: number;
  extraCategoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl?: string;
  status: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface APIExtraCategory {
  id: number;
  categoryName: string;
  description?: string;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  status: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface APIProductExtra {
  id: number;
  productId: number;
  extraId: number;
  selectionMode: number;
  defaultQuantity: number;
  defaultMinQuantity: number;
  defaultMaxQuantity: number;
  unitPrice: number;
  isRequired: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIProductExtraCategory {
  id: number;
  productId: number;
  extraCategoryId: number;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIBranchProductExtraCategory {
  id: number;
  branchProductId: number;
  productExtraCategoryId: number;
  extraCategoryId?: number;
  extraCategoryName?: string;
  isRequired?: boolean;
  isRequiredOverride: boolean;
  minSelectionCount: number;
  maxSelectionCount: number;
  minTotalQuantity: number;
  maxTotalQuantity: number;
  isActive: boolean;
  displayOrder?: number;
  activeExtrasCount?: number;
}

export interface APIBranchProductExtra {
  id: number;
  branchProductId: number;
  productExtraId: number;
  extraId?: number;
  extraName?: string;
  categoryName?: string;
  selectionMode?: number;
  unitPrice?: number;
  isActive: boolean;
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
  displayOrder?: number;
  isRemoval?: boolean;
  isRemovalAllowed?: boolean;
}