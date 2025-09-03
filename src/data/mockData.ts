import type { Category, WeeklyViewData, PopularProductData, HourlyActivityData, MonthlyRevenueData } from '../types/dashboard';

// Chart renkleri
export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Mock kategoriler
export const mockCategories: Category[] = [
  {
    id: '1', name: 'Ana Yemekler', description: 'Ana yemek kategorisi', isExpanded: false, products: [],
    productId: undefined,
    categoryId: 0,
    categoryName: '',
    status: false,
    displayOrder: 0,
    restaurantId: 0
  },
  {
    id: '2', name: 'Başlangıçlar', description: 'Başlangıç kategorisi', isExpanded: false, products: [],
    productId: undefined,
    categoryId: 0,
    categoryName: '',
    status: false,
    displayOrder: 0,
    restaurantId: 0
  },
  {
    id: '3', name: 'İçecekler', description: 'İçecek kategorisi', isExpanded: false, products: [],
    productId: undefined,
    categoryId: 0,
    categoryName: '',
    status: false,
    displayOrder: 0,
    restaurantId: 0
  },
  {
    id: '4', name: 'Tatlılar', description: 'Tatlı kategorisi', isExpanded: false, products: [],
    productId: undefined,
    categoryId: 0,
    categoryName: '',
    status: false,
    displayOrder: 0,
    restaurantId: 0
  }
];

// Mock haftalık görüntülenme verileri
export const weeklyViewsData: WeeklyViewData[] = [
  { day: 'Pzt', views: 120, scans: 45 },
  { day: 'Sal', views: 145, scans: 52 },
  { day: 'Çar', views: 135, scans: 48 },
  { day: 'Per', views: 160, scans: 58 },
  { day: 'Cum', views: 180, scans: 65 },
  { day: 'Cmt', views: 220, scans: 80 },
  { day: 'Paz', views: 200, scans: 72 }
];

// Mock popüler ürünler verileri
export const popularProductsData: PopularProductData[] = [
  { name: 'Köfte', orders: 150, percentage: 30, fill: COLORS[0] },
  { name: 'Pizza', orders: 120, percentage: 24, fill: COLORS[1] },
  { name: 'Burger', orders: 100, percentage: 20, fill: COLORS[2] },
  { name: 'Salata', orders: 80, percentage: 16, fill: COLORS[3] },
  { name: 'Makarna', orders: 50, percentage: 10, fill: COLORS[4] }
];

// Mock saatlik aktivite verileri
export const hourlyActivityData: HourlyActivityData[] = [
  { hour: '10:00', activity: 5 },
  { hour: '11:00', activity: 8 },
  { hour: '12:00', activity: 15 },
  { hour: '13:00', activity: 20 },
  { hour: '14:00', activity: 18 },
  { hour: '15:00', activity: 12 },
  { hour: '16:00', activity: 10 },
  { hour: '17:00', activity: 14 },
  { hour: '18:00', activity: 25 },
  { hour: '19:00', activity: 30 },
  { hour: '20:00', activity: 28 },
  { hour: '21:00', activity: 20 },
  { hour: '22:00', activity: 15 }
];

// Mock aylık gelir verileri
export const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: 'Oca', revenue: 25000 },
  { month: 'Şub', revenue: 28000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Nis', revenue: 35000 },
  { month: 'May', revenue: 40000 },
  { month: 'Haz', revenue: 45000 },
  { month: 'Tem', revenue: 48000 },
  { month: 'Ağu', revenue: 50000 },
  { month: 'Eyl', revenue: 47000 },
  { month: 'Eki', revenue: 45000 },
  { month: 'Kas', revenue: 43000 },
  { month: 'Ara', revenue: 48000 }
]; 