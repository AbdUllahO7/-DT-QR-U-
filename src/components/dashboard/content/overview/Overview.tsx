
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Eye, QrCode, ShoppingCart, Star, Calendar, TrendingUp, Users, DollarSign, BarChart, CalendarDays, Info } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

// --- (Mock) محاكاة للملفات المفقودة لإصلاح أخطاء البناء ---

// Mock Logger (to fix build error)
export const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};




// Mock Types (to fix build error)
export interface QuickSummary {
  isOpen: boolean;
  todaySales: number;
  todayCash: number;
  todayCard: number;
  currentBalance: number;
  transactionCount: number;
  lastUpdated: string;
  ordersToday: number;
  closedShiftsRevenue: number;
  weekToDate: { totalRevenue: number; shiftCount: number; orderCount: number };
  monthToDate: { totalRevenue: number; shiftCount: number; orderCount: number };
}

// Mock Services (to fix build error)
export const moneyCaseService = {
  getQuickSummary: (branchId?: number): Promise<QuickSummary> => {
    logger.info('Mock: getQuickSummary called', { branchId });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isOpen: true,
          todaySales: 1350.75,
          todayCash: 800.50,
          todayCard: 550.25,
          currentBalance: 1200.00,
          transactionCount: 45,
          lastUpdated: new Date().toISOString(),
          ordersToday: 45,
          closedShiftsRevenue: 0,
          weekToDate: { totalRevenue: 7890.00, shiftCount: 14, orderCount: 312 },
          monthToDate: { totalRevenue: 31200.50, shiftCount: 58, orderCount: 1240 },
        });
      }, 800);
    });
  }
};

interface ChartsData {
  weeklyViews: any[];
  popularProducts: any[];
  monthlyRevenue: any[];
}

export const dashboardService = {
  getOverviewCharts: (): Promise<ChartsData> => {
    logger.info('Mock: getOverviewCharts called');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          weeklyViews: [
            { name: 'Mon', uv: 400, pv: 240 },
            { name: 'Tue', uv: 300, pv: 139 },
            { name: 'Wed', uv: 200, pv: 980 },
            { name: 'Thu', uv: 278, pv: 390 },
            { name: 'Fri', uv: 189, pv: 480 },
            { name: 'Sat', uv: 239, pv: 380 },
            { name: 'Sun', uv: 349, pv: 430 },
          ],
          popularProducts: [
            { name: 'Burger', value: 400 },
            { name: 'Pizza', value: 300 },
            { name: 'Salad', value: 200 },
            { name: 'Drink', value: 150 },
            { name: 'Fries', value: 100 },
          ],
          monthlyRevenue: [
            { name: 'Jan', revenue: 4000 },
            { name: 'Feb', revenue: 3000 },
            { name: 'Mar', revenue: 5000 },
            { name: 'Apr', revenue: 4500 },
            { name: 'May', revenue: 6000 },
            { name: 'Jun', revenue: 5500 },
          ],
        });
      }, 800);
    });
  }
};

// Mock Chart Components (to fix build error)
export const WeeklyActivityChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.overview.kpis.totalViews')} (Weekly)</h3>
      <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-gray-500">
        [Weekly Activity Chart Placeholder]
      </div>
    </div>
  );
};

export const PopularProductsChart: React.FC<{ data: any[], colors: string[] }> = ({ data, colors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Products</h3>
      <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-gray-500">
        [Popular Products Chart Placeholder]
      </div>
    </div>
  );
};

export const MonthlyRevenueChart: React.FC<{ data: any[], totalRevenue: number }> = ({ data, totalRevenue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
      <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-gray-500">
        [Monthly Revenue Chart Placeholder]
      </div>
    </div>
  );
};

// Mock UI Components (to fix build error)
export const KPICard: React.FC<{
  title: string;
  value: string;
  change: { value: string; text: string };
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  delay: number;
}> = ({ title, value, change, icon: Icon, iconBgColor, iconColor, delay }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 rtl:space-x-reverse">
      <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className={`font-semibold ${change.value.startsWith('+') ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>{change.value}</span> {change.text}
        </p>
      </div>
    </div>
  );
};

export const QuickStats: React.FC<{ stats: any[] }> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 h-96">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={`p-3 rounded-full ${stat.color.bg} ${stat.color.darkBg} ${stat.color.text}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title} <span className="text-xs">({stat.subtitle})</span></p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
// --- نهاية (Mock) ---


// Grafiklerde kullanılacak renk paleti
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


// --- دالة مساعدة لتنسيق العملة ---
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return '$0'; // يمكنك استبدالها بعملة من الترجمة
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const Overview: React.FC = () => {
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [quickSummary, setQuickSummary] = useState<QuickSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // --- جلب بيانات لوحة المعلومات والملخص المالي بالتوازي ---
        const [chartsDataResponse, summaryResponse] = await Promise.all([
          dashboardService.getOverviewCharts(),
          moneyCaseService.getQuickSummary() // جلب الملخص على مستوى المطعم
        ]);

        setChartsData(chartsDataResponse);
        setQuickSummary(summaryResponse);

      } catch (err: any) {
        logger.error('Overview verileri alınırken hata:', err, { prefix: 'Overview' });
        setError(err.message || 'Dashboard verileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [language]); // اعتماد على اللغة لإعادة التحميل عند تغيير اللغة

  // --- بطاقات المؤشرات المالية (بيانات من API) ---
  const moneyCaseKpis = quickSummary ? [
    {
      title: t('moneyCase.todaySales'),
      value: formatCurrency(quickSummary.todaySales),
      change: { value: `${quickSummary.ordersToday || 0} ${t('moneyCase.orders')}`, text: t('moneyCase.ordersToday') },
      icon: DollarSign,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      delay: 0.1
    },
    {
      title: t('moneyCase.weekToDate'),
      value: formatCurrency(quickSummary.weekToDate.totalRevenue),
      change: { value: `${quickSummary.weekToDate.orderCount || 0} ${t('moneyCase.orders')}`, text: t('moneyCase.shifts', { count: quickSummary.weekToDate.shiftCount || 0 }) },
      icon: BarChart,
      iconBgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      delay: 0.2
    },
    {
      title: t('moneyCase.monthToDate'),
      value: formatCurrency(quickSummary.monthToDate.totalRevenue),
      change: { value: `${quickSummary.monthToDate.orderCount || 0} ${t('moneyCase.orders')}`, text: t('moneyCase.shifts', { count: quickSummary.monthToDate.shiftCount || 0 }) },
      icon: CalendarDays,
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      delay: 0.3
    },
    {
      title: t('moneyCase.status'),
      value: quickSummary.isOpen ? t('moneyCase.open') : t('moneyCase.closed'),
      change: { value: formatCurrency(quickSummary.currentBalance), text: t('moneyCase.currentBalance') },
      icon: Info,
      iconBgColor: quickSummary.isOpen ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconColor: quickSummary.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      delay: 0.4
    }
  ] : [];

  // بطاقات المؤشرات الأصلية (تحليلات)
  const kpiCards = [
    {
      title: t('dashboard.overview.kpis.totalViews'),
      value: '2,847', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      change: { value: '+12.5%', text: t('dashboard.overview.kpis.changeTexts.lastWeek') },
      icon: Eye,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      delay: 0.1
    },
    {
      title: t('dashboard.overview.kpis.qrScans'),
      value: '1,963', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      change: { value: '+8.3%', text: t('dashboard.overview.kpis.changeTexts.lastMonth') },
      icon: QrCode,
      iconBgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      delay: 0.2
    },
    {
      title: t('dashboard.overview.kpis.totalOrders'),
      value: '148', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      change: { value: '+15.2%', text: t('dashboard.overview.kpis.changeTexts.thisWeek') },
      icon: ShoppingCart,
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      delay: 0.3
    },
    {
      title: t('dashboard.overview.kpis.customerRating'),
      value: '4.8', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      change: { value: '+0.2', text: t('dashboard.overview.kpis.changeTexts.lastMonth') },
      icon: Star,
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      delay: 0.4
    }
  ];

  const quickStats = [
    {
      icon: Calendar,
      title: t('dashboard.overview.quickStats.thisMonth'),
      subtitle: t('dashboard.overview.quickStats.totalOrders'),
      value: '423', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      color: {
        bg: 'bg-blue-100',
        text: 'text-blue-600 dark:text-blue-400',
        darkBg: 'dark:bg-blue-900/30'
      }
    },
    {
      icon: TrendingUp,
      title: t('dashboard.overview.quickStats.average'),
      subtitle: t('dashboard.overview.quickStats.dailyOrders'),
      value: '18.5', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      color: {
        bg: 'bg-green-100',
        text: 'text-green-600 dark:text-green-400',
        darkBg: 'dark:bg-green-900/30'
      }
    },
    {
      icon: Users,
      title: t('dashboard.overview.quickStats.new'),
      subtitle: t('dashboard.overview.quickStats.customers'),
      value: '127', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      color: {
        bg: 'bg-purple-100',
        text: 'text-purple-600 dark:text-purple-400',
        darkBg: 'dark:bg-purple-900/30'
      }
    },
    {
      icon: Star,
      title: t('dashboard.overview.quickStats.rating'),
      subtitle: t('dashboard.overview.quickStats.totalCount'),
      value: '89', // هذه البيانات لا تزال ثابتة كما في ملفك الأصلي
      color: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600 dark:text-yellow-400',
        darkBg: 'dark:bg-yellow-900/30'
      }
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* --- بطاقات مؤشرات الخدمة المالية (جديدة) --- */}
      {quickSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moneyCaseKpis.map((card, index) => (
            <KPICard key={index} {...card} />
          ))}
        </div>
      )}

      {/* KPI Cards (Original Analytics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <KPICard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      {chartsData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyActivityChart data={chartsData.weeklyViews} />
            <PopularProductsChart data={chartsData.popularProducts} colors={COLORS} />
          </div>

          {/* Revenue Chart & Quick Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <MonthlyRevenueChart data={chartsData.monthlyRevenue} totalRevenue={0} />
            </div>
            <QuickStats stats={quickStats} />
          </div>
        </>
      )}
    </div>
  );
};

// --- المكون الافتراضي ---
// هذا هو المكون الذي طلبت التعديل عليه، وهو الآن جاهز ويعتمد على 
// "المحاكيات" (mocks) التي تم إنشاؤها أعلاه ليعمل في بيئة المعاينة.
export default Overview;

