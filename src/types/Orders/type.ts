

export interface Order {
  orderId: string;
  customerName: string;
  notes?: string;
  orderTypeId: number;
  status: OrderStatus;
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
  addonPrice?: number | null;
  addonNote?: string | null;
}

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
  itemCount: number;
  rowVersion: string;
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
  orderId: number;
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

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  Completed = 4,
  Cancelled = 5,
  Rejected = 6,
  Delivered = 7
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
}

export interface ConfirmOrderDto {
  rowVersion: string;
}

export interface RejectOrderDto {
  rejectionReason: string;
  rowVersion: string;
}

export interface UpdateOrderStatusDto {
  newStatus: OrderStatus;
  notes?: string;
  rowVersion: string;
}

export interface SmartCreateOrderDto {
  includeAllTableBaskets: boolean;
  customerName: string;
  notes?: string;
  orderTypeId: number;
}