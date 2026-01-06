import { ProductExtraMenu } from '../Extras/type';
export interface MenuAllergen {
  id: number
  code: string
  name: string
  icon: string
  presence: number
  note: string
    displayOrder: number;
  description: string;
}

export interface MenuIngredient {
  id: number
  productId: number
  ingredientId: number
  ingredientName: string
  quantity: number
  unit: string
  isAllergenic: boolean
  isAvailable: boolean
  allergenIds: number[]
  allergens: MenuAllergen[]
}

export interface ExtraCategory {
  categoryId: number
  categoryName: string
  extras: ProductExtraMenu[]
  isRequired: boolean
  minSelectionCount: number
  maxSelectionCount: number
  minTotalQuantity: number
  maxTotalQuantity: number
}

export interface MenuProduct {
  branchProductId: number
  productId: number
  productName: string
  productDescription: string
  productImageUrl: string
  price: number
  isOutOfStock: boolean
  isRecommended: boolean
  ingredients: MenuIngredient[]
  allergens: MenuAllergen[]
  availableAddons: any[]
    availableExtras?: ExtraCategory[]

}

export  interface MenuCategory {
  categoryId: number
  categoryName: string
  displayOrder: number
  products: MenuProduct[]
}

export interface BranchMenuResponse {
  branchId: number
  branchName: string
  restaurantName: string
  branchAddress: string
  isOpen: boolean
  categories: MenuCategory[]
  statusMessage?:string
  preferences?:any
}

export interface CartItem {
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
}

export interface MenuComponentProps {
  branchId: number
}
export interface CategoriesSidebarProps {
  categories: MenuCategory[]
  selectedCategory: number | null
  onCategorySelect: (categoryId: number) => void
}

export interface SelectedAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
}


export interface HeaderProps {
  menuData: BranchMenuResponse
  totalItems: number
  onCartToggle: () => void
}



export interface ProductModalProps {
  isOpen: boolean
  product: MenuProduct | null
  onClose: () => void
  onAddToCart: (product: MenuProduct, addons: SelectedAddon[],  extras: ProductExtraMenu[] ) => void
}