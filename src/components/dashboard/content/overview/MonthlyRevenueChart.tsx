import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../../../contexts/ThemeContext';

interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueData[];
  totalRevenue: number;
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ data, totalRevenue }) => {
  const { isDark } = useTheme();

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[300px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Henüz gelir verisi bulunmuyor</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Gelir verileri burada görünecek</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aylık Gelir Trendi</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Toplam:</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            ₺{totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
          <XAxis
            dataKey="month"
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
          />
          <YAxis
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDark ? '#FFFFFF' : '#000000'
            }}
            formatter={(value) => [`₺${value.toLocaleString()}`, 'Gelir']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}; 