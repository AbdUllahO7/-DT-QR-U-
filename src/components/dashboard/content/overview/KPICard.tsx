import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ArrowUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: {
    value: string | number;
    text: string;
  };
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  delay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor,
  delay = 0.1
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{change.value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{change.text}</span>
          </div>
        </div>
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}; 