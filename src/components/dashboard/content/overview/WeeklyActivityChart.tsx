import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface WeeklyActivityData {
  day: string;
  views: number;
  scans: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[];
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[300px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t('weeklyActivity.empty.primary')}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {t('weeklyActivity.empty.secondary')}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('weeklyActivity.title')}
        </h3>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 bg-blue-500 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('weeklyActivity.labels.views')}
            </span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 bg-green-500 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('weeklyActivity.labels.qrScans')}
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#E5E7EB'}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDark ? '#FFFFFF' : '#000000'
            }}
            formatter={(value: number, name: string) => [
              value,
              name === 'views' ? t('weeklyActivity.labels.views') : t('weeklyActivity.labels.qrScans')
            ]}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorViews)"
            name={t('weeklyActivity.legend.views')}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="scans"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#colorScans)"
            name={t('weeklyActivity.legend.qrScans')}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          />
          <Legend
            verticalAlign="top"
            align={isRTL ? "left" : "right"}
            height={36}
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {value}
              </span>
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};