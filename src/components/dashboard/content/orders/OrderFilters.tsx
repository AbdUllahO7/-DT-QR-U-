import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface OrderFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedPaymentType: string;
  onPaymentTypeChange: (type: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  selectedDateRange,
  onDateRangeChange,
  selectedPaymentType,
  onPaymentTypeChange
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const filterVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -2,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const selectVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const hasActiveFilters = selectedStatus || selectedDateRange !== 'today' || selectedPaymentType;

  const clearAllFilters = () => {
    onStatusChange('');
    onDateRangeChange('today');
    onPaymentTypeChange('');
  };

  return (
    <motion.div
      variants={filterVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Filter className="h-5 w-5 text-blue-500" />
          </motion.div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('common.filters')}
          </span>
          {hasActiveFilters && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          )}
        </motion.div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearAllFilters}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="h-3 w-3" />
              <span>{t('common.clear')}</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Status Filter */}
              <motion.div
                variants={selectVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="space-y-2"
              >
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t('common.allStatuses')}
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={selectedStatus}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
                >
                  <option value="">{t('common.allStatuses')}</option>
                  <option value="pending">{t('common.pending')}</option>
                          <option value="preparing">{t('dashboard.orders.status.preparing')}</option>
        <option value="ready">{t('dashboard.orders.status.ready')}</option>
                  <option value="delivered">{t('common.delivered')}</option>
                  <option value="cancelled">{t('common.cancelled')}</option>
                </motion.select>
              </motion.div>

              {/* Date Range Filter */}
              <motion.div
                variants={selectVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t('common.dateRange')}
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={selectedDateRange}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
                >
                  <option value="today">{t('common.today')}</option>
                  <option value="yesterday">{t('common.yesterday')}</option>
                  <option value="last7days">{t('common.last7Days')}</option>
                  <option value="last30days">{t('common.last30Days')}</option>
                  <option value="thisMonth">{t('common.thisMonth')}</option>
                  <option value="lastMonth">{t('common.lastMonth')}</option>
                </motion.select>
              </motion.div>

              {/* Payment Type Filter */}
              <motion.div
                variants={selectVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Ödeme Türü
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={selectedPaymentType}
                  onChange={(e) => onPaymentTypeChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
                >
                  <option value="">Tüm Ödemeler</option>
                  <option value="cash">Nakit</option>
                  <option value="credit">Kredi Kartı</option>
                  <option value="online">Online Ödeme</option>
                </motion.select>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters summary */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            {selectedStatus && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                Durum: {selectedStatus}
                <button
                  onClick={() => onStatusChange('')}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            )}
            {selectedDateRange !== 'today' && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                Tarih: {selectedDateRange}
                <button
                  onClick={() => onDateRangeChange('today')}
                  className="ml-1 hover:text-green-900 dark:hover:text-green-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            )}
            {selectedPaymentType && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              >
                Ödeme: {selectedPaymentType}
                <button
                  onClick={() => onPaymentTypeChange('')}
                  className="ml-1 hover:text-purple-900 dark:hover:text-purple-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderFilters; 