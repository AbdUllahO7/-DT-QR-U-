import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, X, Search, Edit2, Trash2, Package, 
  Filter, ArrowUp, ChevronDown, Eye, EyeOff, SortAsc, SortDesc,
  Grid3X3, List, Check, AlertTriangle, Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { AllergenService } from '../../../services/allergen';
import { ingredientsService } from '../../../services/IngredientsService';
import { languageService } from '../../../services/LanguageService';
import IngredientFormModal from './IngredientFormModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { Allergen, FilterAllergen, FilterOptions, FilterStatus, Ingredient, SortOption } from '../../../types/BranchManagement/type';

// Custom debounce function
const debounce = <F extends (...args: any[]) => void>(func: F, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

const IngredientsContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  // Data States
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Language States
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Filter and Sort States
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    allergen: 'all',
    selectedAllergens: []
  });
  
  // Refs for dropdown management
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load data function
  const loadData = async () => {
    setLoading(true);
    try {
      const allergenService = new AllergenService();
      
      const [fetchedAllergens, transformedIngredients, languagesData] = await Promise.all([
        allergenService.getAllergens(),
        ingredientsService.getIngredients(),
        languageService.getRestaurantLanguages()
      ]);

      setAllergens(fetchedAllergens);
      setIngredients(transformedIngredients);

      // Process Languages
      const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
        if (!acc.find((l: any) => l.code === lang.code)) {
          acc.push(lang);
        }
        return acc;
      }, []);
      setSupportedLanguages(uniqueLanguages);
      setDefaultLanguage(languagesData.defaultLanguage || 'en');
     
      logger.info('Data loaded successfully', { 
        allergenCount: fetchedAllergens.length,
        ingredientCount: transformedIngredients.length
      });
    } catch (err) {
      logger.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const debouncedSetSearch = useMemo(() => debounce(setSearchQuery, 300), []);

  // Helper to get translated allergen name (Same logic as in Modal)
  const getTranslatedAllergenName = (allergen: Allergen) => {
    try {
      const nameKey = `allergens.${allergen.code}.name`;
      const translatedName = t(nameKey);
      // If translation returns the key (missing translation), use original name
      return translatedName === nameKey ? allergen.name : translatedName;
    } catch (error) {
      return allergen.name;
    }
  };

  // Utility Functions
  const clearFilters = () => {
    setFilters({
      status: 'all',
      allergen: 'all',
      selectedAllergens: []
    });
    setSearchQuery('');
    setSortBy('name_asc');
  };

  const hasActiveFilters = filters.status !== 'all' || filters.allergen !== 'all' || 
    filters.selectedAllergens.length > 0 || searchQuery !== '';

  const processedIngredients = useMemo(() => {
    let filtered = ingredients;

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    filtered = filtered.filter(ingredient => {
      if (filters.status === 'available' && !ingredient.isAvailable) return false;
      if (filters.status === 'unavailable' && ingredient.isAvailable) return false;
      if (filters.allergen === 'allergenic' && !ingredient.isAllergenic) return false;
      if (filters.allergen === 'non-allergenic' && ingredient.isAllergenic) return false;
      if (filters.selectedAllergens.length > 0) {
        const hasSelectedAllergen = filters.selectedAllergens.some(allergenId => 
          ingredient.allergenIds?.includes(allergenId)
        );
        if (!hasSelectedAllergen) return false;
      }
      return true;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'status_asc':
          return Number(a.isAvailable) - Number(b.isAvailable);
        case 'status_desc':
          return Number(b.isAvailable) - Number(a.isAvailable);
        case 'allergen_asc':
          return Number(a.isAllergenic) - Number(b.isAllergenic);
        case 'allergen_desc':
          return Number(b.isAllergenic) - Number(a.isAllergenic);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [ingredients, searchQuery, filters, sortBy, allergens]);

  // Event Handlers
  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowEditModal(true);
  };

  const handleDelete = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIngredient) return;

    setIsDeleting(true);
    setDeleteError('');
    try {
      await ingredientsService.deleteIngredient(selectedIngredient.id);
      setIngredients(prev => prev.filter(ing => ing.id !== selectedIngredient.id));
      setShowDeleteModal(false);
      setSelectedIngredient(null);
    } catch (err: any) {
      let errorMessage = t('IngredientsContent.deleteError') || 'An error occurred while deleting the ingredient.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortOptions = [
    { value: 'name_asc', label: t('sort.name.asc') || 'Name (A-Z)', icon: SortAsc },
    { value: 'name_desc', label: t('sort.name.desc') || 'Name (Z-A)', icon: SortDesc },
    { value: 'status_asc', label: t('sort.status.asc') || 'Status (Unavailable first)', icon: SortAsc },
    { value: 'status_desc', label: t('sort.status.desc') || 'Status (Available first)', icon: SortDesc },
    { value: 'allergen_asc', label: t('sort.allergen.asc') || 'Allergen (Non-allergenic first)', icon: SortAsc },
    { value: 'allergen_desc', label: t('sort.allergen.desc') || 'Allergen (Allergenic first)', icon: SortDesc },
  ];

  if (loading && ingredients.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 animate-pulse">
           <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      {/* Header with Search and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
        {/* Main Container - Stack on mobile, row on desktop */}
        <div className={`flex flex-col gap-4 ${isRTL ? 'items-end' : 'items-start'}`}>

          {/* Row 1: Search and Add Button */}
          <div className={`w-full flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={t('IngredientsContent.searchPlaceholder')}
                onChange={(e) => debouncedSetSearch(e.target.value)}
                className={`w-full py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
              />
            </div>

            {/* Add New Button - Full width on mobile */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="w-5 h-5" />
              <span className="sm:inline">{t('IngredientsContent.newIngredient')}</span>
            </button>
          </div>

          {/* Row 2: Filter Controls */}
          <div className={`w-full flex flex-wrap items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            {/* View Mode Toggle */}
            <div className={`flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-sm order-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title={t('IngredientsContent.gridView') || 'Grid View'}
              >
                <Grid3X3 className="h-4 w-4 dark:text-white" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                title={t('IngredientsContent.listView') || 'List View'}
              >
                <List className="h-4 w-4 dark:text-white" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative order-2" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium border dark:bg-slate-800 dark:text-white rounded-xl transition-all ${hasActiveFilters ? 'text-primary-700 bg-primary-50 border-primary-200 dark:bg-primary-900/30 dark:border-primary-700' : 'text-gray-700 bg-white border-gray-200 dark:border-gray-600'} ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">{t('IngredientsContent.filter')}</span>
                {hasActiveFilters && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary-600 text-white rounded-full">
                    {(filters.status !== 'all' ? 1 : 0) + (filters.allergen !== 'all' ? 1 : 0) + filters.selectedAllergens.length}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`fixed sm:absolute inset-x-4 sm:inset-x-auto top-auto sm:top-full mt-2 sm:w-80 md:w-96 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl z-50 overflow-hidden ${isRTL ? 'sm:right-0 sm:left-auto' : 'sm:left-0 sm:right-auto'}`}
                  >
                    <div className={`p-4 sm:p-5 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {/* Status Filter */}
                      <div>
                        <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('filter.status') || 'Status'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'all', label: t('filter.all') || 'All', icon: Package },
                            { value: 'available', label: t('filter.active') || 'Active', icon: Eye },
                            { value: 'unavailable', label: t('filter.inactive') || 'Inactive', icon: EyeOff }
                          ].map((status) => {
                            const Icon = status.icon;
                            return (
                              <button
                                key={status.value}
                                onClick={() => setFilters(prev => ({ ...prev, status: status.value as FilterStatus }))}
                                className={`flex flex-col items-center justify-center gap-1 p-2 text-xs rounded-lg transition-all duration-200 ${
                                  filters.status === status.value
                                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="truncate w-full text-center">{status.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Allergen Type Filter */}
                      <div>
                        <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('filter.allergen') || 'Allergen Type'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'all', label: t('filter.all') || 'All', icon: Package },
                            { value: 'allergenic', label: t('filter.allergenic') || 'Allergenic', icon: AlertTriangle },
                            { value: 'non-allergenic', label: t('filter.nonallergenic') || 'Safe', icon: Shield }
                          ].map((allergenType) => {
                            const Icon = allergenType.icon;
                            return (
                              <button
                                key={allergenType.value}
                                onClick={() => setFilters(prev => ({ ...prev, allergen: allergenType.value as FilterAllergen }))}
                                className={`flex flex-col items-center justify-center gap-1 p-2 text-xs rounded-lg transition-all duration-200 ${
                                  filters.allergen === allergenType.value
                                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="truncate w-full text-center">{allergenType.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Specific Allergens Filter */}
                      <div>
                        <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('filter.specific.allergens') || 'Specific Allergens'}
                        </label>
                        <div className={`max-h-36 overflow-y-auto space-y-2 ${isRTL ? 'pl-2' : 'pr-2'}`}>
                          {allergens.map((allergen) => {
                            const translatedName = getTranslatedAllergenName(allergen);
                            return (
                              <label key={allergen.id} className={`flex items-center gap-2 cursor-pointer text-sm p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={filters.selectedAllergens.includes(allergen.id)}
                                  onChange={(e) => {
                                    const newSelected = e.target.checked
                                      ? [...filters.selectedAllergens, allergen.id]
                                      : filters.selectedAllergens.filter(id => id !== allergen.id);
                                    setFilters(prev => ({ ...prev, selectedAllergens: newSelected }));
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors flex-shrink-0"
                                />
                                <span className="text-gray-800 dark:text-gray-200">{allergen.icon} {translatedName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={clearFilters}
                          className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {t('IngredientsContent.clearFilters') || 'Clear All Filters'}
                        </button>
                        <button
                          onClick={() => setShowFilterDropdown(false)}
                          className="flex-1 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                        >
                          {t('IngredientsContent.applyFilters') || 'Apply'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative order-3" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium dark:text-white text-gray-700 dark:bg-slate-800 bg-white border border-gray-200 dark:border-gray-600 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">{t('IngredientsContent.sort')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`fixed sm:absolute inset-x-4 sm:inset-x-auto top-auto sm:top-full mt-2 sm:w-64 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl z-50 overflow-hidden ${isRTL ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'}`}
                  >
                    <div className={`p-3 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as SortOption);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''} ${
                              sortBy === option.value
                                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1 text-left">{option.label}</span>
                            {sortBy === option.value && <Check className="h-4 w-4 flex-shrink-0 text-primary-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Filter Chips - Show on larger screens */}
            {hasActiveFilters && (
              <div className={`hidden sm:flex flex-wrap gap-2 order-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {filters.status !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('filter.status') || 'Status'}: {filters.status === 'available' ? t('filter.active') : t('filter.inactive')}
                    <button onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.allergen !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('filter.type') || 'Type'}: {filters.allergen === 'allergenic' ? t('filter.allergenic') : t('filter.nonallergenic')}
                    <button onClick={() => setFilters(prev => ({ ...prev, allergen: 'all' }))} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.selectedAllergens.length > 0 && (
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {filters.selectedAllergens.length} {t('filter.allergensSelected') || 'allergens'}
                    <button onClick={() => setFilters(prev => ({ ...prev, selectedAllergens: [] }))} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients Display - Grid or List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {processedIngredients.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                {t('IngredientsContent.noIngredientsFound')}
              </div>
            ) : (
              processedIngredients.map((ingredient, index) => (
                <motion.div 
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{ingredient.name}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => handleEdit(ingredient)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-full">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(ingredient)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                     {/* Status Badge */}
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${ingredient.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                    </span>
                    {/* Allergen Badges */}
                    {ingredient.isAllergenic ? (
                       <div className="flex flex-wrap gap-2 mt-2">
                          {allergens.filter(a => ingredient.allergenIds?.includes(a.id)).map(a => {
                             const translatedName = getTranslatedAllergenName(a);
                             return (
                               <span key={a.id} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                                 {a.icon} {translatedName}
                               </span>
                             );
                          })}
                       </div>
                    ) : (
                      <div className="text-sm text-gray-500">{t('IngredientsContent.noAllergens')}</div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             {/* List View Table Implementation */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden overflow-x-auto">
                <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                   <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('IngredientsContent.ingredientName')}</th>
                        <th className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('IngredientsContent.status')}</th>
                        <th className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell ${isRTL ? 'text-right' : 'text-left'}`}>{t('IngredientsContent.allergenInfo')}</th>
                        <th className={`px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{t('IngredientsContent.actions')}</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {processedIngredients.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            {t('IngredientsContent.noIngredientsFound')}
                          </td>
                        </tr>
                      ) : (
                        processedIngredients.map((ingredient) => (
                          <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                             <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ingredient.name}</td>
                             <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ingredient.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                   {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                                </span>
                             </td>
                             <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                {ingredient.isAllergenic ? (
                                  <div className={`flex flex-wrap gap-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                     {allergens.filter(a => ingredient.allergenIds?.includes(a.id)).map(a => {
                                        const translatedName = getTranslatedAllergenName(a);
                                        return (
                                          <span key={a.id} className="text-xs text-gray-500 dark:text-gray-400">{a.icon} {translatedName}</span>
                                        );
                                     })}
                                  </div>
                                ) : <span className="text-gray-400">-</span>}
                             </td>
                             <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                                <div className={`flex items-center gap-2 ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
                                  <button onClick={() => handleEdit(ingredient)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1"><Edit2 className="w-4 h-4"/></button>
                                  <button onClick={() => handleDelete(ingredient)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"><Trash2 className="w-4 h-4"/></button>
                                </div>
                             </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <IngredientFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
        allergens={allergens}
        isEdit={false}
        supportedLanguages={supportedLanguages}
        defaultLanguage={defaultLanguage}
      />

      <IngredientFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedIngredient(null);
        }}
        onSuccess={loadData}
        ingredient={selectedIngredient}
        allergens={allergens}
        isEdit={true}
        supportedLanguages={supportedLanguages}
        defaultLanguage={defaultLanguage}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedIngredient(null);
          setDeleteError('');
        }}
        onConfirm={handleDeleteConfirm}
        title={t('IngredientsContent.deleteIngredient')}
        message={selectedIngredient ? t('IngredientsContent.deleteConfirmMessage').replace('{name}', selectedIngredient.name) : ''}
        isSubmitting={isDeleting}
        itemName={selectedIngredient?.name}
        errorMessage={deleteError}
      />
    </motion.div>
  );
};

export default IngredientsContent;