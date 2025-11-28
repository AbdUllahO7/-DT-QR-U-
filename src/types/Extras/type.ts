// Extra Categories Types
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

// Extras Types
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