import React, { useEffect, useState } from 'react';
import { Eye, QrCode, ShoppingCart, Star, Calendar, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { WeeklyActivityChart } from './WeeklyActivityChart';
import { KPICard } from './KPICard';
import { PopularProductsChart } from './PopularProductsChart';
import { MonthlyRevenueChart } from './MonthlyRevenueChart';
import { QuickStats } from './QuickStats';
import { dashboardService } from '../../../../services/dashboardService';
import { logger } from '../../../../utils/logger';

// Grafiklerde kullanılacak renk paleti
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// API yanıtı tipi
interface ChartsData {
  weeklyViews: any[];
  popularProducts: any[];
  monthlyRevenue: any[];
}

const Overview: React.FC = () => {
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await dashboardService.getOverviewCharts();
        setChartsData(data);
      } catch (err: any) {
        logger.error('Overview verileri alınırken hata:', err, { prefix: 'Overview' });
        setError(err.message || 'Dashboard verileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const kpiCards = [
    {
      title: t('dashboard.overview.kpis.totalViews'),
      value: '2,847',
      change: { value: '+12.5%', text: t('dashboard.overview.kpis.changeTexts.lastWeek') },
      icon: Eye,
      iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      delay: 0.1
    },
    {
      title: t('dashboard.overview.kpis.qrScans'),
      value: '1,963',
      change: { value: '+8.3%', text: t('dashboard.overview.kpis.changeTexts.lastMonth') },
      icon: QrCode,
      iconBgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      delay: 0.2
    },
    {
      title: t('dashboard.overview.kpis.totalOrders'),
      value: '148',
      change: { value: '+15.2%', text: t('dashboard.overview.kpis.changeTexts.thisWeek') },
      icon: ShoppingCart,
      iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      delay: 0.3
    },
    {
      title: t('dashboard.overview.kpis.customerRating'),
      value: '4.8',
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
      value: '423',
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
      value: '18.5',
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
      value: '127',
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
      value: '89',
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
      {/* KPI Cards */}
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

export default Overview; 