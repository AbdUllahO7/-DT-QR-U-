import React, { useEffect, useState } from 'react';
import { 
  Eye, QrCode, ShoppingCart, Star, Calendar, TrendingUp, Users, 
  DollarSign, BarChart, CalendarDays, Info, CreditCard, Wallet 
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Import Real Service and Types
import { moneyCaseService } from '../../../../services/Branch/MoneyCaseService';
import { QuickSummary } from '../../../../types/BranchManagement/MoneyCase';

// --- Helper Functions ---
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// --- UI Components ---

const KPICard: React.FC<{
  title: string;
  value: string;
  subValue?: string;
  subText?: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  statusColor?: string;
}> = ({ title, value, subValue, subText, icon: Icon, iconBgColor, iconColor, statusColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 rtl:space-x-reverse transition-all duration-200 hover:shadow-xl">
      <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${statusColor || 'text-gray-900 dark:text-white'}`}>{value}</p>
        {(subValue || subText) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{subValue}</span> {subText}
          </p>
        )}
      </div>
    </div>
  );
};

const QuickStatsList: React.FC<{ stats: any[], title: string }> = ({ stats, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`p-3 rounded-full ${stat.color.bg} ${stat.color.darkBg} ${stat.color.text} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xs text-gray-400">{stat.subtitle}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TodayPaymentDistributionChart: React.FC<{ cash: number; card: number, title: string, labels: { cash: string, card: string, noData: string } }> = ({ cash, card, title, labels }) => {
  const data = [
    { name: labels.cash, value: cash },
    { name: labels.card, value: card },
  ];
  const COLORS = ['#10B981', '#3B82F6']; // Green for Cash, Blue for Card

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex-grow">
        {cash === 0 && card === 0 ? (
           <div className="h-full flex items-center justify-center text-gray-400">{labels.noData}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{labels.cash}: {formatCurrency(cash)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{labels.card}: {formatCurrency(card)}</span>
        </div>
      </div>
    </div>
  );
};

const WeeklyOverviewChart: React.FC<{ 
  weekData: { totalRevenue: number; shiftCount: number; orderCount: number },
  monthData: { totalRevenue: number; shiftCount: number; orderCount: number },
  title: string,
  labels: { week: string, month: string }
}> = ({ weekData, monthData, title, labels }) => {
  const data = [
    { name: labels.week, revenue: weekData.totalRevenue },
    { name: labels.month, revenue: monthData.totalRevenue },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={60} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- Main Component ---

const Overview: React.FC = () => {
  const [quickSummary, setQuickSummary] = useState<QuickSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const summaryResponse = await moneyCaseService.getQuickSummary();
        setQuickSummary(summaryResponse);

      } catch (err: any) {
        console.error('Overview fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [language]); 

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard.overview.loading')}</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t('dashboard.overview.errorTitle')}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('dashboard.overview.refresh')}
          </button>
        </div>
      </div>
    );
  }

  // --- Data Preparation ---
  
  // 1. Top KPI Cards
  const topKpiCards = quickSummary ? [
    {
      title: t('dashboard.overview.kpis.todaySales'),
      value: formatCurrency(quickSummary.todaySales),
      subValue: quickSummary.ordersToday.toString(),
      subText: t('dashboard.overview.kpis.totalOrders'),
      icon: DollarSign,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: t('dashboard.overview.kpis.currentBalance'), 
      value: formatCurrency(quickSummary.currentBalance),
      subValue: quickSummary.isOpen ? t('dashboard.overview.quickStats.open') : t('dashboard.overview.quickStats.closed'),
      subText: t('dashboard.overview.quickStats.status'),
      icon: Wallet,
      iconBgColor: quickSummary.isOpen ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconColor: quickSummary.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      statusColor: quickSummary.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
    {
      title: t('dashboard.overview.kpis.weekRevenue'),
      value: formatCurrency(quickSummary.weekToDate.totalRevenue),
      subValue: quickSummary.weekToDate.orderCount.toString(),
      subText: t('dashboard.overview.kpis.totalOrders'),
      icon: Calendar,
      iconBgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: t('dashboard.overview.kpis.monthRevenue'),
      value: formatCurrency(quickSummary.monthToDate.totalRevenue),
      subValue: quickSummary.monthToDate.orderCount.toString(),
      subText: t('dashboard.overview.kpis.totalOrders'),
      icon: CalendarDays,
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    }
  ] : [];

  // 2. Detailed Stats List
  const detailedStats = quickSummary ? [
    {
      icon: ShoppingCart,
      title: t('dashboard.overview.kpis.avgOrderValue'),
      subtitle: t('dashboard.overview.quickStats.dailyOrders'),
      value: quickSummary.ordersToday > 0 
        ? formatCurrency(quickSummary.todaySales / quickSummary.ordersToday) 
        : "$0.00",
      color: { bg: 'bg-indigo-100', text: 'text-indigo-600 dark:text-indigo-400', darkBg: 'dark:bg-indigo-900/30' }
    },
    {
      icon: Users,
      title: t('dashboard.overview.kpis.totalShifts'),
      subtitle: t('dashboard.overview.kpis.changeTexts.thisWeek'),
      value: quickSummary.weekToDate.shiftCount.toString(),
      color: { bg: 'bg-pink-100', text: 'text-pink-600 dark:text-pink-400', darkBg: 'dark:bg-pink-900/30' }
    },
    {
      icon: CreditCard,
      title: t('dashboard.overview.quickStats.cardSales'),
      subtitle: t('dashboard.overview.kpis.changeTexts.today'), 
      value: formatCurrency(quickSummary.todayCard),
      color: { bg: 'bg-blue-100', text: 'text-blue-600 dark:text-blue-400', darkBg: 'dark:bg-blue-900/30' }
    },
    {
      icon: DollarSign,
      title: t('dashboard.overview.quickStats.cashSales'),
      subtitle: t('dashboard.overview.kpis.changeTexts.today'),
      value: formatCurrency(quickSummary.todayCash),
      color: { bg: 'bg-green-100', text: 'text-green-600 dark:text-green-400', darkBg: 'dark:bg-green-900/30' }
    }
  ] : [];

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topKpiCards.map((card, index) => (
          <KPICard key={index} {...card} />
        ))}
      </div>

      {/* 2. Charts and Stats Row */}
      {quickSummary && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Comparison Chart */}
          <div className="xl:col-span-1">
             <WeeklyOverviewChart 
                weekData={quickSummary.weekToDate} 
                monthData={quickSummary.monthToDate} 
                title={t('dashboard.overview.charts.revenueComparison')} 
                labels={{
                  week: t('dashboard.overview.kpis.changeTexts.thisWeek'),
                  month: t('dashboard.overview.quickStats.thisMonth')
                }}
             />
          </div>

          {/* Cash vs Card Pie Chart */}
          <div className="xl:col-span-1">
            <TodayPaymentDistributionChart 
              cash={quickSummary.todayCash} 
              card={quickSummary.todayCard} 
              title={t('dashboard.overview.charts.paymentMethods')}
              labels={{
                cash: t('dashboard.overview.quickStats.cashSales'),
                card: t('dashboard.overview.quickStats.cardSales'),
                noData: t('dashboard.overview.charts.noData')
              }}
            />
          </div>

          {/* Quick Stats List */}
          <div className="xl:col-span-1">
            <QuickStatsList 
              stats={detailedStats} 
              title={t('dashboard.overview.title')} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;