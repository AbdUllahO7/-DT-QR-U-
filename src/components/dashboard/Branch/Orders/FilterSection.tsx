import React from 'react';
import { Search, Filter, Calendar, User, Package, Truck, CreditCard, ChevronDown, ChevronUp, X } from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { FilterOptions, OrderStatusEnums } from '../../../../types/Orders/type';

interface FilterSectionProps {
  filters: FilterOptions;
  showAdvancedFilters: boolean;
  hasActiveFilters: string | boolean;
  viewMode: 'pending' | 'branch'  | 'deletedOrders';
  lang: string;
  filteredCount: number;
  totalCount: number;
  onUpdateFilter: (key: keyof FilterOptions, value: any) => void;
  onUpdateNestedFilter: (key: keyof FilterOptions, nestedKey: string, value: any) => void;
  onClearFilters: () => void;
  onToggleAdvanced: () => void;
  t: (key: string) => string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  showAdvancedFilters,
  hasActiveFilters,
  viewMode,
  lang,
  filteredCount,
  totalCount,
  onUpdateFilter,
  onUpdateNestedFilter,
  onClearFilters,
  onToggleAdvanced,
  t
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Basic Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('ordersManager.searchPlaceholder') || 'Search orders...'}
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter (only for branch orders) */}
        {viewMode === 'branch' && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              title='filter'
              value={filters.status}
              onChange={(e) => onUpdateFilter('status', e.target.value === 'all' ? 'all' : parseInt(e.target.value) as OrderStatusEnums)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('ordersManager.allStatuses')}</option>
              {Object.values(OrderStatusEnums).filter(v => typeof v === 'number').map((status) => (
                <option key={status} value={status}>
                  {orderService.getOrderStatusText(status as OrderStatusEnums, lang)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Start */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            placeholder="Start Date"
            value={filters.dateRange.start}
            onChange={(e) => onUpdateNestedFilter('dateRange', 'start', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Range End */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            placeholder="End Date"
            value={filters.dateRange.end}
            onChange={(e) => onUpdateNestedFilter('dateRange', 'end', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex justify-between items-center">
        <button
          onClick={onToggleAdvanced}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showAdvancedFilters ?   t('ordersManager.hideAdvancedFilter') :  t('ordersManager.showAdvancedFilter')}
          {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              {t('ordersManager.clearFilter')}
            </button>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCount} {t('ordersManager.of')} {totalCount} {t('ordersManager.orders')}
          </span>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Customer Name Filter */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('ordersManager.customerName')}
                value={filters.customerName}
                onChange={(e) => onUpdateFilter('customerName', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Table Name Filter */}
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('ordersManager.tableName')}
                value={filters.tableName}
                onChange={(e) => onUpdateFilter('tableName', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Order Type Filter */}
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder= {t('ordersManager.orderType')}
                value={filters.orderType}
                onChange={(e) => onUpdateFilter('orderType', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range Min */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder={t('ordersManager.minPrice')}
                value={filters.priceRange.min || ''}
                onChange={(e) => onUpdateNestedFilter('priceRange', 'min', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range Max */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder={t('ordersManager.maxPrice')}
                value={filters.priceRange.max || ''}
                onChange={(e) => onUpdateNestedFilter('priceRange', 'max', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;