// Product Extra Categories Types
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
  isDeleted?: boolean;
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
  isDeleted?: boolean;
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

export interface ProductExtraCategoryOrderItem {
  id: number;
  displayOrder: number;
}

export interface ReorderProductExtraCategoriesData {
  items: ProductExtraCategoryOrderItem[];
}

// Product Extras Types
export interface ProductExtra {
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
  isDeleted?: boolean;
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
  isDeleted?: boolean;
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

export interface ProductExtraOrderItem {
  productExtraId: number;
  newDisplayOrder: number;
}

export interface ReorderProductExtrasData {
  productId: number;
  extraOrders: ProductExtraOrderItem[];
}

// Extra Categories Types (from your provided types)
export interface ExtraCategory {
  id: number;
  categoryName: string;
  status: boolean;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  displayOrder?: number;
  isDeleted?: boolean;
}

export interface APIExtraCategory {
  id: number;
  categoryName: string;
  status: boolean;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
  displayOrder?: number;
  isDeleted?: boolean;
}

export interface CreateExtraCategoryData {
  categoryName: string;
  status: boolean;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
}

export interface UpdateExtraCategoryData {
  id: number;
  categoryName: string;
  status: boolean;
  isRequired: boolean;
  defaultMinSelectionCount: number;
  defaultMaxSelectionCount: number;
  defaultMinTotalQuantity: number;
  defaultMaxTotalQuantity: number;
}

export interface CategoryOrderItem {
  extraCategoryId: number;
  newDisplayOrder: number;
}

export interface ReorderCategoriesData {
  categoryOrders: CategoryOrderItem[];
}

// Extras Types (from your provided types)
export interface Extra {
  id: number;
  extraCategoryId: number;
  name: string;
  description: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl: string;
  status: boolean;
  displayOrder?: number;
  isDeleted?: boolean;
}

export interface APIExtra {
  id: number;
  extraCategoryId: number;
  name: string;
  description: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl: string;
  status: boolean;
  displayOrder?: number;
  isDeleted?: boolean;
}

export interface CreateExtraData {
  extraCategoryId: number;
  name: string;
  description: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl: string;
  status: boolean;
}

export interface UpdateExtraData {
  id: number;
  extraCategoryId: number;
  name: string;
  description: string;
  basePrice: number;
  isRemoval: boolean;
  imageUrl: string;
  status: boolean;
}

export interface ExtraOrderItem {
  extraId: number;
  newDisplayOrder: number;
}

export interface ReorderExtrasData {
  extraCategoryId: number;
  extraOrders: ExtraOrderItem[];
}