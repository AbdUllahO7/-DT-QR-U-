import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '../../../../contexts/ThemeContext';

interface PopularProductData {
  name: string;
  orders: number;
  percentage: number;
  fill: string;
}

interface PopularProductsChartProps {
  data: PopularProductData[];
  colors: string[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PopularProductsChart: React.FC<PopularProductsChartProps> = ({ data, colors }) => {
  const { isDark } = useTheme();

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[300px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Henüz ürün satış verisi yok</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Ürün satışları burada görünecek</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Popüler Ürünler</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="orders"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDark ? '#FFFFFF' : '#000000'
            }}
            formatter={(value: any, name: any, props: any) => [
              `${value} sipariş (${props.payload.percentage}%)`,
              name
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}; 