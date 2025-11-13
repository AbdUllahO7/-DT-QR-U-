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

// --- ADDED: Countries list from Register component ---
export const countries = [
  { name: 'TR', code: '+90' },
  { name: 'US', code: '+1' },
  { name: 'GB', code: '+44' },
  { name: 'DE', code: '+49' },
  { name: 'FR', code: '+33' },
  { name: 'ES', code: '+34' },
  { name: 'IT', code: '+39' },
  { name: 'NL', code: '+31' },
  { name: 'GR', code: '+30' },
  { name: 'JP', code: '+81' },
  { name: 'KR', code: '+82' },
  { name: 'CN', code: '+86' },
  { name: 'IN', code: '+91' },
  { name: 'BR', code: '+55' },
  { name: 'RU', code: '+7' },
  { name: 'AU', code: '+61' },
  { name: 'CA', code: '+1' },
  { name: 'MX', code: '+52' },
  { name: 'AR', code: '+54' },
  { name: 'ZA', code: '+27' },
  { name: 'EG', code: '+20' },
  { name: 'SA', code: '+966' },
  { name: 'AE', code: '+971' },
  { name: 'AT', code: '+43' },
  { name: 'BE', code: '+32' },
  { name: 'SE', code: '+46' },
  { name: 'NO', code: '+47' },
  { name: 'DK', code: '+45' },
  { name: 'PL', code: '+48' },
  { name: 'PT', code: '+351' },
  { name: 'IE', code: '+353' },
  { name: 'UA', code: '+380' },
  { name: 'CZ', code: '+420' },
  { name: 'HU', code: '+36' },
  { name: 'RO', code: '+40' },
];
