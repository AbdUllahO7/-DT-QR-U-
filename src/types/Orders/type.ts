import { BranchOrder, Order, PendingOrder } from "../BranchManagement/type";

export enum OrderStatusEnums {
  Pending = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  Completed = 4,
  Cancelled = 5,
  Rejected = 6,
  Delivered = 7
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

// Enhanced component state
export interface OrdersManagerState {
  pendingOrders: PendingOrder[];
  branchOrders: BranchOrder[];
  selectedOrder: Order| null;
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
  
  // Enhanced filtering and pagination
  filters: FilterOptions;
  pagination: PaginationState;
  showAdvancedFilters: boolean;
  filteredOrders: (PendingOrder | BranchOrder)[];
}

export interface OrdersManagerActions {
  fetchPendingOrders: () => Promise<void>;
  fetchBranchOrders: () => Promise<void>;
  handleConfirmOrder: () => Promise<void>;
  handleRejectOrder: () => Promise<void>;
  handleUpdateStatus: () => Promise<void>;
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