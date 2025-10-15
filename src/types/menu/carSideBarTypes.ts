import { OrderType } from "../../services/Branch/BranchOrderTypeService";
import { OrderTrackingInfo } from "../BranchManagement/type";
import { MenuProduct } from "./type";

export interface OrderForm {
  customerName: string;
  notes: string;
  orderTypeId: number;
  tableId?: number;
  deliveryAddress?: string;
  customerPhone?: string;
  paymentMethod: string;
}

export interface OrderTotal {
  baseAmount: number;
  serviceCharge: number;
  totalAmount: number;
}

export interface OrderFormProps {
  orderForm: OrderForm;
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>;
  orderTypes: OrderType[];
  loadingOrderTypes: boolean;
  orderTotal: OrderTotal;
  estimatedTime: number;
  totalPrice: number;
  validationErrors: string[];
  loading: boolean;
  onBack: () => void;
  onCreate: () => void;
}


export interface TrackedOrder {
  orderTag: string
  trackingInfo: OrderTrackingInfo
  createdAt: Date
}

export interface OrdersTabProps {
  trackedOrders: TrackedOrder[]
  trackingLoading: boolean
  onLoadOrderTracking: (orderTag: string) => Promise<void>
  onRemoveOrderFromTracking: (orderTag: string) => void
}

export interface OrderCardProps {
  order: TrackedOrder
  trackingLoading: boolean
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactElement
  onLoadOrderTracking: (orderTag: string) => Promise<void>
  onRemoveOrderFromTracking: (orderTag: string) => void
}

export interface PriceChangeModalProps {
  isVisible: boolean
  priceChanges: any
  confirmingPriceChanges: boolean
  onCancel: () => void
  onConfirm: () => void
}


export interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  basketItemId?: number
}

export interface CartItem {
  basketItemId?: number
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
  addons?: CartItemAddon[]
  totalItemPrice: number
}

export interface GroupedCartItem {
  product: {
    branchProductId: number
    productName: string
    price: number
    productImageUrl?: string
  }
  variants: Array<{
    basketItemId?: number
    cartIndex: number
    quantity: number
    addons?: CartItemAddon[]
    totalItemPrice: number
    isPlain: boolean
  }>
  totalQuantity: number
  totalPrice: number
}

export interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  findProduct: (branchProductId: number) => MenuProduct | undefined
  sessionId?: string
  tableId?: number
  onOrderCreated?: (orderId: string) => void
}


export interface CartContentProps {
  cart: CartItem[]
  groupedItems: GroupedCartItem[]
  totalPrice: number
  loading: boolean
  onProceedToOrder: () => void
  onQuantityIncrease: (basketItemId?: number) => Promise<void>
  onQuantityDecrease: (basketItemId?: number) => Promise<void>
  onAddonQuantityIncrease: (addonBasketItemId: number) => Promise<void>
  onRemoveFromBasket: (basketItemId: number) => Promise<void>
  canIncreaseAddonQuantity: (addon: CartItemAddon) => boolean
  canDecreaseAddonQuantity: (addon: CartItemAddon) => boolean
  getAddonQuantityError: (addon: CartItemAddon) => string | null
}
