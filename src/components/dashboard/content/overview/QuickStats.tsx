import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Star } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface QuickStatItem {
  icon: typeof Calendar | typeof TrendingUp | typeof Users | typeof Star;
  title: string;
  subtitle: string;
  value: string | number;
  color: {
    bg: string;
    text: string;
    darkBg: string;
  };
}

interface QuickStatsProps {
  stats: QuickStatItem[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const {t} = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('monthlyRevenue.QuickStats')}</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 ${stat.color.bg} ${stat.color.darkBg} rounded-lg mr-3`}>
                  <Icon className={`h-4 w-4 ${stat.color.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${stat.color.text}`}>{stat.value}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}; 