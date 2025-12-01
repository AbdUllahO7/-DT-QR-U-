// ===== BranchProductExtraCategories Types =====

export interface BranchProductExtraCategory {
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

// API Response Types for BranchProductExtraCategories
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

// API Response Types for BranchProductExtras
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