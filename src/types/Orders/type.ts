import { OrderType } from "../../services/Branch/BranchOrderTypeService";
import { BranchDropdownItem, BranchOrder, Order, OrderItem, PendingOrder, TableBasketSummary } from "../BranchManagement/type";

export enum OrderStatusEnums {
  Pending = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  Completed = 5,
  Cancelled = 6,
  Rejected = 7,
  Delivered = 4
}

export interface UpdatableOrder {
  orderId: number;
  orderTag: string;
  totalPrice: number;
  itemCount: number;
  createdAt: string; // or Date
  isUpdatable: boolean;
  isCancellable: boolean;
  // updateDeadline: string; // or Date <-- REMOVED
  hasBeenModified: boolean;
  lastModifiedAt: string; // or Date
  modificationCount: number;
  items: OrderItem[]; // <-- ADDED
  rowVersion: string;
  updateDeadline:string,
}

export interface UpdatePendingOrderItemDto {
  orderDetailId: number; // Use 0 for new items
  branchProductId: number;
  count: number;
  note: string | null;
  isAddon: boolean;
  parentOrderDetailId: number | null; // Null for base items, ID for addons
}


export interface UpdatePendingOrderDto {
  orderId: number;
  items: UpdatePendingOrderItemDto[];
  updateReason: string;
  priceChangesConfirmed: boolean;
  rowVersion: string;
}

// Enhanced filtering interface
export interface FilterOptions {
  search: string;
  status: OrderStatusEnums | 'all';
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
}

// Pagination interface
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
export interface CancelOrderDto {
  orderId: number;
  cancellationReason: string;
  rowVersion: string;
}
// Enhanced component state
export interface OrdersManagerState {
  pendingOrders: PendingOrder[];
  branchOrders: BranchOrder[];
  selectedOrder: Order| null;
  loading: boolean;
  showCancelModal:boolean;
  cancelReason:string,
  error: string | null;
  viewMode: 'pending' | 'branch' | 'deletedOrders';
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
   branches: BranchDropdownItem[];
  selectedBranch: BranchDropdownItem | null;
  isBranchDropdownOpen: boolean;
  // Enhanced filtering and pagination
  filters: FilterOptions;
  pagination: PaginationState;
  showAdvancedFilters: boolean;
  filteredOrders: (PendingOrder | BranchOrder)[];
}

export interface OrdersManagerActions {
  fetchBranches: () => Promise<void>;
  handleBranchSelect: (branch: BranchDropdownItem) => void;
  fetchPendingOrders: (branchId?: number) => Promise<void>;
  fetchBranchOrders: (branchId?: number) => Promise<void>;
  fetchTableBasketSummary: () => Promise<TableBasketSummary[]>;
  getOrderTypesForCurrentBranch: () => Promise<OrderType[]>;
  getOrderTypeText: (orderTypeId: number) => Promise<string>;
  calculateOrderTotal: (orderTypeId: number, baseAmount: number) => Promise<{
    baseAmount: number;
    serviceCharge: number;
    totalAmount: number;
  }>;
  handleCancelOrder: () => Promise<void>;
  openCancelModal: (orderId: string, rowVersion: string) => void;
  getEstimatedTime: (orderTypeId: number) => Promise<number>;
  getOrderTypeByCode: (code: string) => Promise<OrderType | undefined>;
  getActiveOrderTypes: () => Promise<OrderType[]>;
  getAllOrderTypes: () => Promise<OrderType[]>;
  handleConfirmOrder: () => Promise<void>;
  handleRejectOrder: () => Promise<void>;
  handleUpdateStatus: () => Promise<void>;
  // NEW: Added methods with branch support
  getOrderDetails: (orderId: string) => Promise<Order | null>;
  getTableOrders: (tableId: number) => Promise<Order[]>;
  createSessionOrder: (data: any) => Promise<Order | null>;
  smartCreateOrder?: (data: any) => Promise<Order | null>;
  refreshOrderTypes: () => Promise<void>;
  // Existing methods
  switchViewMode: (mode: 'pending' | 'branch') => void;
  openConfirmModal: (orderId: string, rowVersion: string) => void;
  openRejectModal: (orderId: string, rowVersion: string) => void;
  openStatusModal: (orderId: string, rowVersion: string, newStatus: OrderStatusEnums) => void;
  openDetailsModal: (order: PendingOrder | BranchOrder) => void;
  closeModals: () => void;
  toggleRowExpansion: (orderId: string) => void;
  handleSort: (field: string) => void;
  setState: React.Dispatch<React.SetStateAction<OrdersManagerState>>;
}