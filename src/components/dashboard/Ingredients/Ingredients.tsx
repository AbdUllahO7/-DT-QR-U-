import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, X, Search, Edit2, Trash2, Package, 
  Filter, ArrowUp, ChevronDown, Eye, EyeOff, SortAsc, SortDesc,
  Grid3X3, List, AlertTriangle, Shield, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { AllergenService } from '../../../services/allergen';
import { ingredientsService } from '../../../services/IngredientsService';
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
      
      const fetchedAllergens = await allergenService.getAllergens();
      setAllergens(fetchedAllergens);
      
      const transformedIngredients = await ingredientsService.getIngredients();
      setIngredients(transformedIngredients);
     
      logger.info('Data loaded successfully', { 
        allergenCount: fetchedAllergens.length,
        ingredientCount: transformedIngredients.length
      });
    } catch (err) {
      logger.error('Data loading error:', err);
      setAllergens([]);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Debounced search update
  const debouncedSetSearch = useMemo(() => debounce(setSearchQuery, 300), []);

  // Utility Functions

  // Get allergen names for display
  const getAllergenNames = (allergenIds: number[]) => {
    return allergens
      .filter(a => allergenIds?.includes(a.id))
      .map(a => `${a.icon || '🚨'} ${a.name}`)
      .join(', ');
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      allergen: 'all',
      selectedAllergens: []
    });
    setSearchQuery('');
    setSortBy('name_asc');
  };

  // Check if filters are active
  const hasActiveFilters = filters.status !== 'all' || filters.allergen !== 'all' || 
    filters.selectedAllergens.length > 0 || searchQuery !== '';

  // Memoized processed ingredients
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
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIngredient) return;
    
    setIsDeleting(true);
    try {
      await ingredientsService.deleteIngredient(selectedIngredient.id);
      setIngredients(prev => prev.filter(ing => ing.id !== selectedIngredient.id));
      logger.info('Ingredient deleted', { id: selectedIngredient.id });
    } catch (err) {
      logger.error('Ingredient deletion error:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort options configuration
  const sortOptions = [
    { value: 'name_asc', label: t('sort.name.asc') || 'Name (A-Z)', icon: SortAsc },
    { value: 'name_desc', label: t('sort.name.desc') || 'Name (Z-A)', icon: SortDesc },
    { value: 'status_asc', label: t('sort.status.asc') || 'Status (Unavailable first)', icon: SortAsc },
    { value: 'status_desc', label: t('sort.status.desc') || 'Status (Available first)', icon: SortDesc },
    { value: 'allergen_asc', label: t('sort.allergen.asc') || 'Allergen (Non-allergenic first)', icon: SortAsc },
    { value: 'allergen_desc', label: t('sort.allergen.desc') || 'Allergen (Allergenic first)', icon: SortDesc },
  ];

  // Loading State
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
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
              className={`w-full py-3 px-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-shadow duration-200 focus:shadow-md`}
              aria-label={t('IngredientsContent.accessibility.searchInput')}
            />
          </div>
          
          <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Active Filter Chips */}
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
                    Allergen: {filters.allergen}
                    <button onClick={() => setFilters(prev => ({ ...prev, allergen: 'all' }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.selectedAllergens.map(id => {
                  const allergen = allergens.find(a => a.id === id);
                  return allergen ? (
                    <span key={id} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {allergen.name}
                      <button onClick={() => setFilters(prev => ({ ...prev, selectedAllergens: prev.selectedAllergens.filter(a => a !== id) }))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                title={t('productsContent.viewMode.grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                title={t('productsContent.viewMode.list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border rounded-xl transition-all duration-200 shadow-sm ${
                  hasActiveFilters 
                    ? 'text-primary-700 dark:text-primary-300 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 border-primary-200 dark:border-primary-800' 
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
                title={t('IngredientsContent.filter')}
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
                          {allergens.map((allergen) => (
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
                              <span className="text-gray-800 dark:text-gray-200">{allergen.icon} {allergen.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="w-full py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                      >
                        Apply Filters
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
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-200 shadow-sm"
                title={t('IngredientsContent.sort')}
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
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('IngredientsContent.accessibility.addButton')}
            >
              <Plus className="w-5 h-5" />
              {t('IngredientsContent.newIngredient')}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Display */}
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
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50"
              >
                <Package className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {searchQuery || hasActiveFilters ? t('IngredientsContent.noIngredientsFound') : t('IngredientsContent.noIngredientsYet')}
                </p>
              </motion.div>
            ) : (
              processedIngredients.map((ingredient, index) => (
                <motion.div 
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{ingredient.name}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={t('IngredientsContent.edit')}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={t('IngredientsContent.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span 
                      className={`inline-flex px-4 py-1 text-sm font-semibold rounded-full shadow-sm ${
                        ingredient.isAvailable
                          ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 text-green-800 dark:text-green-300'
                          : 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                    </span>

                    {ingredient?.isAllergenic ? (
                      <div className="space-y-2">
                        <span 
                          className="inline-flex px-4 py-1 text-sm font-semibold rounded-full shadow-sm bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                        >
                          {t('IngredientsContent.containsAllergens')}
                        </span>
                        {ingredient?.allergenIds?.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {allergens.filter(a => ingredient.allergenIds.includes(a.id)).map(a => (
                              <span key={a.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {a.icon} {a.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span 
                        className="inline-flex px-4 py-1 text-sm font-semibold rounded-full shadow-sm bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 text-green-800 dark:text-green-300"
                      >
                        {t('IngredientsContent.noAllergens')}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table 
                className="w-full divide-y divide-gray-200 dark:divide-gray-700"
                role="table"
                aria-label={t('IngredientsContent.accessibility.ingredientsTable')}
              >
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 sticky top-0">
                  <tr>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('IngredientsContent.ingredientName')}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('IngredientsContent.status')}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('IngredientsContent.allergenInfo')}
                    </th>
                    <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('IngredientsContent.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {processedIngredients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                            {searchQuery || hasActiveFilters ? t('IngredientsContent.noIngredientsFound') : t('IngredientsContent.noIngredientsYet')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    processedIngredients.map((ingredient, index) => (
                      <motion.tr 
                        key={ingredient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-900 dark:text-white text-lg">
                          {ingredient.name}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span 
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${
                              ingredient.isAvailable
                                ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 text-green-800 dark:text-green-300'
                                : 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 text-red-800 dark:text-red-300'
                            }`}
                            aria-label={t('IngredientsContent.accessibility.statusBadge')}
                          >
                            {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {ingredient?.isAllergenic ? (
                              <div className="space-y-1">
                                <span 
                                  className="inline-flex px-3 py-1 text-sm font-semibold rounded-full shadow-sm bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                                  aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                                >
                                  {t('IngredientsContent.containsAllergens')}
                                </span>
                                {ingredient?.allergenIds?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    {allergens.filter(a => ingredient.allergenIds.includes(a.id)).map(a => (
                                      <span key={a.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        {a.icon} {a.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span 
                                className="inline-flex px-3 py-1 text-sm font-semibold rounded-full shadow-sm bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/50 text-green-800 dark:text-green-300"
                                aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                              >
                                {t('IngredientsContent.noAllergens')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`px-6 py-5 whitespace-nowrap ${isRTL ? 'text-left' : 'text-right'}`}>
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <button
                              onClick={() => handleEdit(ingredient)}
                              className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors"
                              title={t('IngredientsContent.edit')}
                              aria-label={t('IngredientsContent.accessibility.editButton')}
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(ingredient)}
                              className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                              title={t('IngredientsContent.delete')}
                              aria-label={t('IngredientsContent.accessibility.deleteButton')}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
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
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedIngredient(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('IngredientsContent.deleteIngredient')}
        message={selectedIngredient ? t('IngredientsContent.deleteConfirmMessage').replace('{name}', selectedIngredient.name) : ''}
        isSubmitting={isDeleting}
        itemName={selectedIngredient?.name}
      />
    </motion.div>
  );
};

export default IngredientsContent;