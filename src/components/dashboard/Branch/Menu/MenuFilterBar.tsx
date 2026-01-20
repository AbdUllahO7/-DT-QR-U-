/**
 * Advanced Menu Filtering Component
 * Filter by allergens, price range, dietary preferences, availability
 */

"use client"

import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  DollarSign,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { MenuProduct, MenuAllergen } from '../../../../types/menu/type';

export interface MenuFilters {
  priceRange: { min: number | null; max: number | null };
  allergenExclude: number[];
  showOnlyAvailable: boolean;
  showOnlyRecommended: boolean;
}

interface MenuFilterBarProps {
  products: MenuProduct[];
  onFiltersChange: (filters: MenuFilters) => void;
  className?: string;
}

const DEFAULT_FILTERS: MenuFilters = {
  priceRange: { min: null, max: null },
  allergenExclude: [],
  showOnlyAvailable: false,
  showOnlyRecommended: false,
};

const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  products,
  onFiltersChange,
  className = '',
}) => {
  const { t, isRTL } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<MenuFilters>(DEFAULT_FILTERS);

  // Get all unique allergens from products
  const allAllergens = useMemo(() => {
    const allergenMap = new Map<number, MenuAllergen>();
    products.forEach((product) => {
      product.allergens?.forEach((allergen) => {
        if (!allergenMap.has(allergen.id)) {
          allergenMap.set(allergen.id, allergen);
        }
      });
    });
    return Array.from(allergenMap.values()).sort((a, b) =>
      (a.displayOrder || 0) - (b.displayOrder || 0)
    );
  }, [products]);

  // Get price range from products
  const priceStats = useMemo(() => {
    const prices = products.map((p) => p.price).filter((p) => p > 0);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 100),
    };
  }, [products]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
    if (filters.allergenExclude.length > 0) count++;
    if (filters.showOnlyAvailable) count++;
    if (filters.showOnlyRecommended) count++;
    return count;
  }, [filters]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Helper to get translated allergen name
  const getTranslatedAllergenName = (allergen: MenuAllergen) => {
    try {
      const nameKey = `allergens.${allergen.code}.name`;
      const translated = t(nameKey);
      return translated === nameKey ? allergen.name : translated;
    } catch {
      return allergen.name;
    }
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: numValue,
      },
    }));
  };

  const toggleAllergen = (allergenId: number) => {
    setFilters((prev) => ({
      ...prev,
      allergenExclude: prev.allergenExclude.includes(allergenId)
        ? prev.allergenExclude.filter((id) => id !== allergenId)
        : [...prev.allergenExclude, allergenId],
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleBooleanFilter = (key: 'showOnlyAvailable' | 'showOnlyRecommended') => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Filter className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {t('menu.filter.title') || 'Filter Menu'}
          </span>
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-5">
          {/* Quick Filters */}
          <div>
            <h4 className={`text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 ${isRTL ? 'text-right' : ''}`}>
              {t('menu.filter.quickFilters') || 'Quick Filters'}
            </h4>
           
          </div>

          {/* Price Range */}
          <div>
            <h4 className={`text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 ${isRTL ? 'text-right' : ''}`}>
              <DollarSign className="w-4 h-4 inline mr-1" />
              {t('menu.filter.priceRange') || 'Price Range'}
            </h4>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={t('menu.filter.min') || 'Min'}
                  value={filters.priceRange.min ?? ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min={0}
                  className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${isRTL ? 'text-right' : ''}`}
                />
              </div>
              <span className="text-slate-400">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={t('menu.filter.max') || 'Max'}
                  value={filters.priceRange.max ?? ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min={0}
                  className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${isRTL ? 'text-right' : ''}`}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('menu.filter.priceHint') || `Range: ${priceStats.min} - ${priceStats.max}`}
            </p>
          </div>

          {/* Allergen Exclusion */}
          {allAllergens.length > 0 && (
            <div>
              <h4 className={`text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 ${isRTL ? 'text-right' : ''}`}>
                <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
                {t('menu.filter.excludeAllergens') || 'Exclude Allergens'}
              </h4>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {allAllergens.map((allergen) => {
                  const isExcluded = filters.allergenExclude.includes(allergen.id);
                  return (
                    <button
                      key={allergen.id}
                      onClick={() => toggleAllergen(allergen.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                        isExcluded
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'
                      } ${isRTL ? 'flex-row-reverse' : ''}`}
                      title={isExcluded ? t('menu.filter.allergenExcluded') : t('menu.filter.clickToExclude')}
                    >
                      <span>{allergen.icon}</span>
                      <span className="font-medium">{getTranslatedAllergenName(allergen)}</span>
                      {isExcluded && <X className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {t('menu.filter.allergenHint') || 'Click to hide products containing these allergens'}
              </p>
            </div>
          )}

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <RotateCcw className="w-4 h-4" />
              {t('menu.filter.reset') || 'Reset Filters'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Export filter application function for use in parent components
export const applyMenuFilters = (
  products: MenuProduct[],
  filters: MenuFilters
): MenuProduct[] => {
  return products.filter((product) => {
    // Price filter
    if (filters.priceRange.min !== null && product.price < filters.priceRange.min) {
      return false;
    }
    if (filters.priceRange.max !== null && product.price > filters.priceRange.max) {
      return false;
    }

    // Allergen exclusion
    if (filters.allergenExclude.length > 0) {
      const productAllergenIds = product.allergens?.map((a) => a.id) || [];
      const hasExcludedAllergen = filters.allergenExclude.some((id) =>
        productAllergenIds.includes(id)
      );
      if (hasExcludedAllergen) {
        return false;
      }
    }

    // Availability filter
    if (filters.showOnlyAvailable && product.isOutOfStock) {
      return false;
    }

    // Recommended filter
    if (filters.showOnlyRecommended && !product.isRecommended) {
      return false;
    }

    return true;
  });
};

export default MenuFilterBar;
