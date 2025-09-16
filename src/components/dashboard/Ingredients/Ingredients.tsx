import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Search, Edit2, Trash2, Package, 
  Filter, ArrowUp, ChevronDown, Eye, EyeOff, SortAsc, SortDesc,
  Grid3X3, List, AlertTriangle, Shield, Check
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { AllergenService } from '../../../services/allergen';
import { ingredientsService } from '../../../services/IngredientsService';
import IngredientFormModal from './IngredientFormModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { Allergen, FilterAllergen, FilterOptions, FilterStatus, Ingredient, SortOption } from '../../../types/BranchManagement/type';



const IngredientsContent: React.FC = () => {
  const { isDark } = useTheme();
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

  // Utility Functions

  // Sort ingredients
  const applySorting = (ingredientsToSort: Ingredient[]): Ingredient[] => {
    return [...ingredientsToSort].sort((a, b) => {
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
  };

  // Apply filters
  const applyFilters = (ingredientsToFilter: Ingredient[]): Ingredient[] => {
    return ingredientsToFilter.filter(ingredient => {
      // Status filter
      if (filters.status === 'available' && !ingredient.isAvailable) return false;
      if (filters.status === 'unavailable' && ingredient.isAvailable) return false;
      
      // Allergen filter
      if (filters.allergen === 'allergenic' && !ingredient.isAllergenic) return false;
      if (filters.allergen === 'non-allergenic' && ingredient.isAllergenic) return false;
      
      // Specific allergen filter
      if (filters.selectedAllergens.length > 0) {
        const hasSelectedAllergen = filters.selectedAllergens.some(allergenId => 
          ingredient.allergenIds?.includes(allergenId)
        );
        if (!hasSelectedAllergen) return false;
      }
      
      return true;
    });
  };

  // Apply search
  const applySearch = (ingredientsToSearch: Ingredient[]): Ingredient[] => {
    if (!searchQuery.trim()) return ingredientsToSearch;
    
    return ingredientsToSearch.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get processed ingredients (search + filter + sort)
  const processedIngredients = applySorting(applyFilters(applySearch(ingredients)));

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
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header with Search and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('IngredientsContent.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
              aria-label={t('IngredientsContent.accessibility.searchInput')}
            />
          </div>
          
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">{t('clear.filters') || 'Clear'}</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                title={t('productsContent.viewMode.grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
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
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
                  hasActiveFilters 
                    ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' 
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                title={t('IngredientsContent.filter')}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('IngredientsContent.filter')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 space-y-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('filter.status') || 'Status'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
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
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                filters.status === status.value
                                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('filter.allergen') || 'Allergen Type'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
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
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                filters.allergen === allergenType.value
                                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('filter.specific.allergens') || 'Specific Allergens'}
                      </label>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {allergens.map((allergen) => (
                          <label key={allergen.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.selectedAllergens.includes(allergen.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    selectedAllergens: [...prev.selectedAllergens, allergen.id]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    selectedAllergens: prev.selectedAllergens.filter(id => id !== allergen.id)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">{allergen.icon}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {allergen.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                title={t('IngredientsContent.sort')}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t('IngredientsContent.sort')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as SortOption);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            sortBy === option.value
                              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                          {sortBy === option.value && <Check className="h-4 w-4 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Add New Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('IngredientsContent.accessibility.addButton')}
            >
              <Plus className="w-5 h-5" />
              {t('IngredientsContent.newIngredient')}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedIngredients.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchQuery || hasActiveFilters ? t('IngredientsContent.noIngredientsFound') : t('IngredientsContent.noIngredientsYet')}
              </p>
            </div>
          ) : (
            processedIngredients.map((ingredient) => (
              <div key={ingredient.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{ingredient.name}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(ingredient)}
                      className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title={t('IngredientsContent.edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title={t('IngredientsContent.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        ingredient.isAvailable
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                    </span>
                  </div>

                  <div>
                    {ingredient?.isAllergenic ? (
                      <div className="space-y-2">
                        <span 
                          className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        >
                          {t('IngredientsContent.containsAllergens')}
                        </span>
                        {ingredient?.allergenIds?.length > 0 && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {getAllergenNames(ingredient.allergenIds)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span 
                        className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      >
                        {t('IngredientsContent.noAllergens')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // List View (Table)
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table 
              className="w-full"
              role="table"
              aria-label={t('IngredientsContent.accessibility.ingredientsTable')}
            >
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('IngredientsContent.ingredientName')}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('IngredientsContent.status')}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('IngredientsContent.allergenInfo')}
                  </th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('IngredientsContent.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {processedIngredients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchQuery || hasActiveFilters ? t('IngredientsContent.noIngredientsFound') : t('IngredientsContent.noIngredientsYet')}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedIngredients.map((ingredient) => (
                    <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{ingredient.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            ingredient.isAvailable
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}
                          aria-label={t('IngredientsContent.accessibility.statusBadge')}
                        >
                          {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {ingredient?.isAllergenic ? (
                            <div>
                              <span 
                                className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 mb-1"
                                aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                              >
                                {t('IngredientsContent.containsAllergens')}
                              </span>
                              {ingredient?.allergenIds?.length > 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {getAllergenNames(ingredient.allergenIds)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span 
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                            >
                              {t('IngredientsContent.noAllergens')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <button
                            onClick={() => handleEdit(ingredient)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            title={t('IngredientsContent.edit')}
                            aria-label={t('IngredientsContent.accessibility.editButton')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ingredient)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title={t('IngredientsContent.delete')}
                            aria-label={t('IngredientsContent.accessibility.deleteButton')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      
      {/* Create Modal */}
      <IngredientFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
        allergens={allergens}
        isEdit={false}
      />

      {/* Edit Modal */}
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

      {/* Delete Modal */}
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
    </div>
  );
};

export default IngredientsContent;