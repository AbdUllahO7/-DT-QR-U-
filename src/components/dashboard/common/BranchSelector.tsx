import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, Check, Store, Building2 } from 'lucide-react';
import { useClickOutside } from '../../../hooks';
import { RestaurantBranchDropdownItem } from '../../../types/api';
import { restaurantService } from '../../../services/restaurantService';
import { useLanguage } from '../../../contexts/LanguageContext';

interface BranchSelectorProps {
  restaurantName: string;
  branchName: string | null;
  onSelectBranch: (item: RestaurantBranchDropdownItem) => void;
  onBackToMain: () => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  restaurantName,
  branchName,
  onSelectBranch,
  onBackToMain
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<RestaurantBranchDropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {t} = useLanguage();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Fetch branches when dropdown opens
  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await restaurantService.getRestaurantBranchesDropdown();
      setItems(response);
    } catch (err) {
      console.error('Branch list could not be fetched:', err);
      setError(t('branchSelector.status.error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchBranches();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-3 relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
      >
        <span>{t('branchSelector.actions.changeBranchRestaurant')}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 dark:border-gray-600 border-t-primary-600"></div>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{t('branchSelector.status.loading')}</span>
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-center">
              <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-3 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('branchSelector.empty')}</span>
            </div>
          ) : (
            <>
              {/* Main Restaurant Option */}
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750">
                {t('branchSelector.labels.mainRestaurant')}
              </div>
              <button
                onClick={() => {
                  onBackToMain();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Store className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 truncate">{restaurantName}</span>
                {!branchName && (
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                )}
              </button>

              {/* Branches Header */}
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 mt-1">
                {t('branchSelector.labels.branches')}
              </div>

              {/* Branches List */}
              {items.map(item => (
                <button
                  key={`branch-${item.id}`}
                  onClick={() => {
                    onSelectBranch(item);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Building2 className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1 truncate">{item.name}</span>
                  {branchName === item.name && (
                    <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchSelector;