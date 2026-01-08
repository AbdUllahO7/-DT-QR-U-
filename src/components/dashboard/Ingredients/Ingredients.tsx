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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('IngredientsContent.searchPlaceholder')}
              onChange={(e) => debouncedSetSearch(e.target.value)}
              className={`w-full py-3 px-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
          </div>
          
          <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    Status: {filters.status}
                    <button onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.allergen !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    Type: {filters.allergen}
                    <button onClick={() => setFilters(prev => ({ ...prev, allergen: 'all' }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  {t('IngredientsContent.clearFilters') || 'Clear All'}
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-sm">
              <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                <Grid3X3 className="h-4 w-4 dark:text-white" />
              </button>
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                <List className="h-4 w-4 dark:text-white" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border dark:bg-slate-800 dark:text-white rounded-xl transition-all ${hasActiveFilters ? 'text-primary-700 bg-primary-50 border-primary-200' : 'text-gray-700 bg-white border-gray-200'}`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('IngredientsContent.filter')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {t('filter.status') || 'Status'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'all', label: t('filter.all') || 'All', icon: Package },
                            { value: 'available', label: t('filter.active') || 'Available', icon: Eye },
                            { value: 'unavailable', label: t('filter.inactive') || 'Unavailable', icon: EyeOff }
                          ].map((status) => {
                            const Icon = status.icon;
                            return (
                              <button
                                key={status.value}
                                onClick={() => setFilters(prev => ({ ...prev, status: status.value as FilterStatus }))}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                                  filters.status === status.value
                                    ? 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-900/70 text-primary-700 dark:text-primary-300 shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{status.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Allergen Type Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {t('filter.allergen') || 'Allergen Type'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'all', label: t('filter.all') || 'All', icon: Package },
                            { value: 'allergenic', label: t('filter.allergenic') || 'Allergenic', icon: AlertTriangle },
                            { value: 'non-allergenic', label: t('filter.nonallergenic') || 'Non-allergenic', icon: Shield }
                          ].map((allergenType) => {
                            const Icon = allergenType.icon;
                            return (
                              <button
                                key={allergenType.value}
                                onClick={() => setFilters(prev => ({ ...prev, allergen: allergenType.value as FilterAllergen }))}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                                  filters.allergen === allergenType.value
                                    ? 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-900/70 text-primary-700 dark:text-primary-300 shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{allergenType.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Specific Allergens Filter */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {t('filter.specific.allergens') || 'Specific Allergens'}
                        </label>
                        <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                          {allergens.map((allergen) => {
                            const translatedName = getTranslatedAllergenName(allergen);
                            return (
                              <label key={allergen.id} className="flex items-center gap-3 cursor-pointer text-sm">
                                <input
                                  type="checkbox"
                                  checked={filters.selectedAllergens.includes(allergen.id)}
                                  onChange={(e) => {
                                    const newSelected = e.target.checked
                                      ? [...filters.selectedAllergens, allergen.id]
                                      : filters.selectedAllergens.filter(id => id !== allergen.id);
                                    setFilters(prev => ({ ...prev, selectedAllergens: newSelected }));
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
                                />
                                <span className="text-gray-800 dark:text-gray-200">{allergen.icon} {translatedName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="w-full py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                      >
                        {t('IngredientsContent.applyFilters') || 'Apply Filters'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium dark:text-white text-gray-700 dark:bg-slate-800 bg-white border border-gray-900 rounded-xl"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t('IngredientsContent.sort')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 space-y-1">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as SortOption);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                              sortBy === option.value
                                ? 'bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-900/70 text-primary-700 dark:text-primary-300 shadow-sm'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                            {sortBy === option.value && <Check className="h-4 w-4 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Add New Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="w-5 h-5" />
              {t('IngredientsContent.newIngredient')}
            </button>
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
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                   <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('IngredientsContent.ingredientName')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('IngredientsContent.status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('IngredientsContent.allergenInfo')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('IngredientsContent.actions')}</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {processedIngredients.map((ingredient) => (
                        <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ingredient.name}</td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ingredient.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                 {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              {ingredient.isAllergenic ? (
                                <div className="flex flex-wrap gap-1">
                                   {allergens.filter(a => ingredient.allergenIds?.includes(a.id)).map(a => {
                                      const translatedName = getTranslatedAllergenName(a);
                                      return (
                                        <span key={a.id} className="text-xs text-gray-500">{a.icon} {translatedName}</span>
                                      );
                                   })}
                                </div>
                              ) : <span>-</span>}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEdit(ingredient)} className="text-primary-600 hover:text-primary-900 mr-4"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => handleDelete(ingredient)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button>
                           </td>
                        </tr>
                      ))}
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