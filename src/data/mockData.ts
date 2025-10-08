import type { HourlyActivityData, MonthlyRevenueData } from '../types/dashboard';

// Chart renkleri
export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


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