// Dashboard bileşenleri için type tanımları

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isExpanded: boolean;
  products: Product[];
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

// Chart data types
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
  id: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  items: number;
  orderTime: string; // ISO date string
  table: string;
} 