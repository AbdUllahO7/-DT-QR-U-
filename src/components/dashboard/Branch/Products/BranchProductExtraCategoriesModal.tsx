import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Loader2,
  Search,
  Package,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Settings,
  Edit3,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { 
  AvailableExtraCategory, 
  AvailableProductExtra, 
  CreateBranchProductExtraCategoryData, 
  CreateBranchProductExtraData,
  UpdateBranchProductExtraCategoryData,
  UpdateBranchProductExtraData
} from '../../../../types/Branch/Extras/type';
import { branchProductExtraCategoriesService } from '../../../../services/Branch/Extras/BranchProductExtraCategoriesService';
import { branchProductExtrasService } from '../../../../services/Branch/Extras/BranchProductExtrasService';
import { useCurrency } from '../../../../hooks/useCurrency';

interface BranchProductExtraCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchProductId: number;
  productName: string;
  onSave: (branchProductId: number, selectedCategoryIds: number[], selectedExtraIds: number[]) => Promise<void>;
  isLoading?: boolean;
}

interface CategoryWithExtras extends AvailableExtraCategory {
  isExpanded: boolean;
  extras: AvailableProductExtra[];
  isRemovalCategory?: boolean; // Added to track if it is a removal category
}

interface ExtrasConfig {
  [categoryId: number]: {
    isRequiredOverride: boolean;
    minSelectionCount: number;
    maxSelectionCount: number;
    minTotalQuantity: number;
    maxTotalQuantity: number;
    selectedExtras: Set<number>;
    isMaxSelectionUnlimited?: boolean;
    isMaxQuantityUnlimited?: boolean;
  };
}

interface ExtraSpecificConfig {
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
  unitPrice?: number;
  isMaxQuantityUnlimited?: boolean;
}

interface ExtrasSpecificConfig {
  [extraId: number]: ExtraSpecificConfig;
}

const BranchProductExtraCategoriesModal: React.FC<BranchProductExtraCategoriesModalProps> = ({
  isOpen,
  onClose,
  branchProductId,
  productName,
  onSave,
  isLoading: externalLoading = false,
}) => {
  const { t, isRTL } = useLanguage();

  // State management
  const [availableCategories, setAvailableCategories] = useState<CategoryWithExtras[]>([]);
  const currency = useCurrency();
  
  // UI Selection State
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [extrasConfig, setExtrasConfig] = useState<ExtrasConfig>({});
  
  // Extra-specific configuration
  const [extrasSpecificConfig, setExtrasSpecificConfig] = useState<ExtrasSpecificConfig>({});
  const [editingExtraId, setEditingExtraId] = useState<number | null>(null);
  
  // Tracking Database IDs for Deletion/Update
  const [existingRelationIds, setExistingRelationIds] = useState<Map<number, number>>(new Map());
  const [existingExtraRelationIds, setExistingExtraRelationIds] = useState<Map<number, number>>(new Map());

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && branchProductId) {
      fetchData();
    }
  }, [isOpen, branchProductId]);

  const fetchData = async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      const [allAvailableCategories, allAvailableExtras, existingCategoriesData, existingExtrasData] = await Promise.all([
        branchProductExtraCategoriesService.getAvailableExtraCategories({
          branchProductId: branchProductId,
          onlyActive: false
        }),

        branchProductExtrasService.getAvailableProductExtras({
          branchProductId: branchProductId,
          onlyActive: false
        }),
        branchProductExtraCategoriesService.getBranchProductExtraCategories({ branchProductId: branchProductId }),
        branchProductExtrasService.getBranchProductExtrasByBranchProductId(branchProductId)
      ]);

      const mergedCategories: CategoryWithExtras[] = allAvailableCategories.map((category) => ({
        ...category,
        isExpanded: false, 
        extras: [],
        
        isRemovalCategory: (category as any).isRemovalCategory
      }));


      existingCategoriesData.forEach((existingCat) => {
        const exists = mergedCategories.some(c => c.productExtraCategoryId === existingCat.productExtraCategoryId);
        if (!exists) {
          mergedCategories.push({
            productExtraCategoryId: existingCat.productExtraCategoryId,
            extraCategoryName: existingCat.extraCategoryName ?? '',
            extraCategoryId: existingCat.extraCategoryId ?? 0,
            isRequired: !!(existingCat.isRequiredOverride ?? existingCat.isRequired ?? false),
            minSelectionCount: existingCat.minSelectionCount ?? 0,
            maxSelectionCount: existingCat.maxSelectionCount ?? 0,
            minTotalQuantity: existingCat.minTotalQuantity ?? 0,
            maxTotalQuantity: existingCat.maxTotalQuantity ?? 1,
            activeExtrasCount: 0,
            isExpanded: false,
            extras: [],
            isRemovalCategory: existingCat.isRemovalCategory // Map here as well
          });
        }
      });

      mergedCategories.forEach(category => {
        const relevantAvailableExtras = allAvailableExtras.filter(
          (e) => e.categoryName === category.extraCategoryName
        );

        const relevantExistingExtras = existingExtrasData.filter(
          (e) => e.categoryName === category.extraCategoryName
        );

        const combinedExtras: AvailableProductExtra[] = [...relevantAvailableExtras];

        relevantExistingExtras.forEach(existing => {
          const exists = combinedExtras.some(c => c.productExtraId === existing.productExtraId);
          if (!exists) {
            const mappedExtra: AvailableProductExtra = {
              productExtraId: existing.productExtraId ?? 0,
              extraName: existing.extraName ?? '',
              categoryName: existing.categoryName ?? '',
              unitPrice: existing.unitPrice ?? 0,
              extraId: existing.extraId ?? 0,
              selectionMode: existing.selectionMode ?? 0,
              defaultMinQuantity: existing.minQuantity,
              defaultMaxQuantity: existing.maxQuantity,
              isRemoval: existing.isRemoval ?? false,
            };
            combinedExtras.push(mappedExtra);
          }
        });

        category.extras = combinedExtras;
      });

      mergedCategories.sort((a, b) => a.extraCategoryName.localeCompare(b.extraCategoryName));
      setAvailableCategories(mergedCategories);

      try {
        const initialSelectedCats = new Set<number>();
        const initialConfig: ExtrasConfig = {};
        const initialExtrasConfig: ExtrasSpecificConfig = {};
        const relationMap = new Map<number, number>();
        const extraRelationMap = new Map<number, number>();

        existingCategoriesData.forEach((cat) => {
          initialSelectedCats.add(cat.productExtraCategoryId);
          relationMap.set(cat.productExtraCategoryId, cat.id);
          
          initialConfig[cat.productExtraCategoryId] = {
            isRequiredOverride: cat.isRequiredOverride,
            minSelectionCount: cat.minSelectionCount,
            maxSelectionCount: cat.maxSelectionCount,
            minTotalQuantity: cat.minTotalQuantity,
            maxTotalQuantity: cat.maxTotalQuantity,
            selectedExtras: new Set(),
            // Logic to determine if unlimited based on a high number or explicit flag if available
            isMaxSelectionUnlimited: cat.maxSelectionCount === null || cat.maxSelectionCount > 1000, 
            isMaxQuantityUnlimited: cat.maxTotalQuantity === null || cat.maxTotalQuantity > 1000
          };
        });

        existingExtrasData.forEach((existingExtra) => {
          extraRelationMap.set(existingExtra.productExtraId, existingExtra.id);

          // Store extra-specific configuration
          initialExtrasConfig[existingExtra.productExtraId] = {
            specialUnitPrice: existingExtra.specialUnitPrice ?? 0,
            minQuantity: existingExtra.minQuantity ?? 0,
            maxQuantity: existingExtra.maxQuantity,
            isRequiredOverride: existingExtra.isRequiredOverride ?? false,
            isMaxQuantityUnlimited: existingExtra.maxQuantity === null || existingExtra.maxQuantity > 1000
          };

          const parentCategory = mergedCategories.find(c => c.extraCategoryName === existingExtra.categoryName);

          if (parentCategory) {
            const catId = parentCategory.productExtraCategoryId;
            if (initialConfig[catId]) {
              initialConfig[catId].selectedExtras.add(existingExtra.productExtraId);
            }
          }
        });

        setSelectedCategories(initialSelectedCats);
        setExtrasConfig(initialConfig);
        setExtrasSpecificConfig(initialExtrasConfig);
        setExistingRelationIds(relationMap);
        setExistingExtraRelationIds(extraRelationMap);

      } catch (err) {
        console.warn('Could not load existing configuration, starting fresh', err);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || t('extrasManagement.categoryConfigModal.errors.loadFailed'));
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newSelected = new Set(selectedCategories);
    
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
      setExtrasConfig(prev => {
        const newConfig = { ...prev };
        delete newConfig[categoryId];
        return newConfig;
      });
    } else {
      newSelected.add(categoryId);
      const category = availableCategories.find((c) => c.productExtraCategoryId === categoryId);
      if (category) {
        setExtrasConfig(prev => ({
          ...prev,
          [categoryId]: {
            isRequiredOverride: category.isRequired,
            minSelectionCount: category.minSelectionCount,
            maxSelectionCount: category.maxSelectionCount,
            minTotalQuantity: category.minTotalQuantity,
            maxTotalQuantity: category.maxTotalQuantity,
            selectedExtras: new Set(),
            isMaxSelectionUnlimited: false,
            isMaxQuantityUnlimited: false
          },
        }));
        handleCategoryExpand(categoryId, true);
      }
    }
    setSelectedCategories(newSelected);
  };

  const handleCategoryExpand = (categoryId: number, forceState?: boolean) => {
    setAvailableCategories((prev) =>
      prev.map((cat) =>
        cat.productExtraCategoryId === categoryId
          ? { ...cat, isExpanded: forceState !== undefined ? forceState : !cat.isExpanded }
          : cat
      )
    );
  };

  const handleExtraToggle = (categoryId: number, extraId: number) => {
    if (!selectedCategories.has(categoryId)) return; 

    setExtrasConfig((prev) => {
      const categoryConfig = prev[categoryId];
      if (!categoryConfig) return prev;

      const newSelectedExtras = new Set(categoryConfig.selectedExtras);
      if (newSelectedExtras.has(extraId)) {
        newSelectedExtras.delete(extraId);
      } else {
        newSelectedExtras.add(extraId);
        
        // Initialize extra-specific config if not exists
        if (!extrasSpecificConfig[extraId]) {
          const extra = availableCategories
            .flatMap(c => c.extras)
            .find(e => e.productExtraId === extraId);
          
          setExtrasSpecificConfig(prevConfig => ({
            ...prevConfig,
            [extraId]: {
              specialUnitPrice: extra?.unitPrice ?? 0,
              minQuantity: 0,
              maxQuantity: extra?.defaultMaxQuantity || 1,
              isRequiredOverride: false,
              isMaxQuantityUnlimited: false
            }
          }));
        }
      }

      return {
        ...prev,
        [categoryId]: {
          ...categoryConfig,
          selectedExtras: newSelectedExtras,
        },
      };
    });
  };

  const handleConfigChange = (
    categoryId: number,
    field: keyof Omit<ExtrasConfig[number], 'selectedExtras'>,
    value: number | boolean
  ) => {
    setExtrasConfig((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  const handleExtraConfigChange = (
    extraId: number,
    field: keyof ExtraSpecificConfig,
    value: number | boolean
  ) => {
    setExtrasSpecificConfig((prev) => ({
      ...prev,
      [extraId]: {
        ...prev[extraId],
        [field]: value,
      },
    }));
  };

  const toggleExtraEdit = (extraId: number) => {
    setEditingExtraId(editingExtraId === extraId ? null : extraId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // PHASE 1: DELETE UNSELECTED CATEGORIES
      const categoriesToDelete: number[] = []; 
      
      for (const [productExtraCategoryId, relationId] of existingRelationIds.entries()) {
        if (!selectedCategories.has(productExtraCategoryId)) {
          categoriesToDelete.push(relationId);
        }
      }

      for (const relationId of categoriesToDelete) {
        await branchProductExtraCategoriesService.deleteBranchProductExtraCategory(relationId);
      }

      // PHASE 2: CREATE OR UPDATE CATEGORIES
      for (const categoryId of selectedCategories) {
        const config = extrasConfig[categoryId];
        if (!config) continue;

        // Determine if removal based on the original category data
        const originalCategory = availableCategories.find(c => c.productExtraCategoryId === categoryId);
        const isRemoval = originalCategory?.isRemovalCategory || false;

        const existingRelationId = existingRelationIds.get(categoryId);
        
        // Prepare data values (handle removal logic where some values should be ignored/zeroed)
        const finalMinSelection = isRemoval ? 0 : config.minSelectionCount;
        const finalMinQuantity = isRemoval ? 0 : config.minTotalQuantity;
        const finalMaxQuantity = isRemoval ? null : (config.isMaxQuantityUnlimited ? null : config.maxTotalQuantity);

        if (existingRelationId) {
          const updateData: UpdateBranchProductExtraCategoryData = {
            id: existingRelationId,
            isRequiredOverride: config.isRequiredOverride,
            minSelectionCount: finalMinSelection,
            maxSelectionCount: config.isMaxSelectionUnlimited ? null : config.maxSelectionCount,
            minTotalQuantity: finalMinQuantity,
            maxTotalQuantity: finalMaxQuantity,
            isActive: true
          };
          await branchProductExtraCategoriesService.updateBranchProductExtraCategory(updateData);
        } else {
          const createData: CreateBranchProductExtraCategoryData = {
            branchProductId,
            productExtraCategoryId: categoryId,
            isRequiredOverride: config.isRequiredOverride,
            minSelectionCount: finalMinSelection,
            maxSelectionCount: config.isMaxSelectionUnlimited ? null : config.maxSelectionCount,
            minTotalQuantity: finalMinQuantity,
            maxTotalQuantity: finalMaxQuantity,
            isActive: true,
          };
          await branchProductExtraCategoriesService.createBranchProductExtraCategory(createData);
        }
      }

      // PHASE 3: DELETE UNSELECTED EXTRAS
      const extrasToDelete: number[] = [];
      const allCurrentlySelectedExtraIds = new Set<number>();
      Object.values(extrasConfig).forEach(config => {
        config.selectedExtras.forEach((id: number) => allCurrentlySelectedExtraIds.add(id));
      });

      for (const [productExtraId, relationId] of existingExtraRelationIds.entries()) {
        if (!allCurrentlySelectedExtraIds.has(productExtraId)) {
          extrasToDelete.push(relationId);
        }
      }

      for (const relationId of extrasToDelete) {
        await branchProductExtrasService.deleteBranchProductExtra(relationId);
      }

      // PHASE 4: CREATE OR UPDATE EXTRAS
      const allSelectedExtras: number[] = [];
      
      for (const [categoryId, config] of Object.entries(extrasConfig)) {
        if (!selectedCategories.has(Number(categoryId))) continue;

        for (const extraId of config.selectedExtras) {
          allSelectedExtras.push(extraId);

          const existingExtraId = existingExtraRelationIds.get(extraId);
          const extraConfig = extrasSpecificConfig[extraId] || {
            specialUnitPrice: 0,
            minQuantity: 0,
            maxQuantity: 1,
            isRequiredOverride: false,
            isMaxQuantityUnlimited: false
          };

          // Check if the extra is a removal type
          const extra = availableCategories
            .flatMap(c => c.extras)
            .find(e => e.productExtraId === extraId);
          
          const isRemoval = extra?.isRemoval ?? false;

          if (existingExtraId) {
            const updateData: UpdateBranchProductExtraData = {
              id: existingExtraId,
              isActive: true,
              // Don't send specialUnitPrice for removal extras
              specialUnitPrice: isRemoval ? 0 : extraConfig.specialUnitPrice,
              minQuantity: isRemoval ? 0 : extraConfig.minQuantity,
              maxQuantity: extraConfig.isMaxQuantityUnlimited ? null : extraConfig.maxQuantity,
              isRequiredOverride: extraConfig.isRequiredOverride,
            };
            await branchProductExtrasService.updateBranchProductExtra(updateData);
          } else {
            const extraData: CreateBranchProductExtraData = {
              branchProductId,
              productExtraId: extraId,
              isActive: true,
              // Don't send specialUnitPrice for removal extras
              specialUnitPrice: isRemoval ? 0 : extraConfig.specialUnitPrice,
              minQuantity: isRemoval ? 0 : extraConfig.minQuantity,
              maxQuantity: extraConfig.isMaxQuantityUnlimited ? null : extraConfig.maxQuantity,
              isRequiredOverride: extraConfig.isRequiredOverride,
            };
            await branchProductExtrasService.createBranchProductExtra(extraData);
          }
        }
      }

      // Only call onSave and close modal if everything succeeded
      await onSave(branchProductId, Array.from(selectedCategories), allSelectedExtras);
      onClose();
    } catch (err: any) {
      console.error('Error saving:', err);
      // Extract the most specific error message available
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.title 
        || err.message 
        || t('extrasManagement.categoryConfigModal.errors.saveFailed');
      setError(errorMessage);
      // Scroll to top to show error message
      const modalContent = document.querySelector('.max-h-\\[500px\\]');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = availableCategories.filter((category) =>
    category.extraCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalSelectedExtras = () => {
    return Object.entries(extrasConfig).reduce(
      (sum, [catId, config]) => {
        if(selectedCategories.has(Number(catId))) {
          return sum + config.selectedExtras.size;
        }
        return sum;
      },
      0
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-0 sm:px-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal Panel - Full screen on mobile, Card on desktop */}
        <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden text-left flex flex-col sm:my-8">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="min-w-0 flex-1 mr-4">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {t('extrasManagement.categoryConfigModal.title')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {t('extrasManagement.categoryConfigModal.productLabel')} <span className="font-medium">{productName}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Stats Grid - Stacks on mobile */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Selected Categories Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.selectedCategories')}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedCategories.size}
                    </p>
                  </div>
                  <Grid3X3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 opacity-50" />
                </div>
              </div>

              {/* Selected Extras Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.selectedExtras')}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {getTotalSelectedExtras()}
                    </p>
                  </div>
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 opacity-50" />
                </div>
              </div>

              {/* Available Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.available')}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {availableCategories.length}
                    </p>
                  </div>
                  <Info className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500 opacity-50" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
              <input
                type="text"
                placeholder={t('extrasManagement.categoryConfigModal.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base`}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shrink-0">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Main List Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t('extrasManagement.categoryConfigModal.loading.categories')}
                </p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? t('extrasManagement.categoryConfigModal.empty.noResults')
                    : t('extrasManagement.categoryConfigModal.empty.noCategories')
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const isSelected = selectedCategories.has(category.productExtraCategoryId);
                  const config = extrasConfig[category.productExtraCategoryId];
                  const isRemoval = category.isRemovalCategory;

                  return (
                    <div
                      key={category.productExtraCategoryId}
                      className={`border-2 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      {/* Category Header Card */}
                      <div className="p-4">
                        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                          
                          {/* Left: Checkbox + Info */}
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={() => handleCategoryToggle(category.productExtraCategoryId)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                              }`}
                            >
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </button>
                            <div className="min-w-0">
                              <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] text-sm sm:text-base">
                                  {category.extraCategoryName}
                                </h4>
                                {isRemoval && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 whitespace-nowrap border border-red-200 dark:border-red-800">
                                    {t('extrasManagement.categoryConfigModal.badges.removalCategory')}
                                  </span>
                                )}
                              </div>
                              <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border ${
                                  category.isRequired
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                                }`}>
                                  {category.isRequired 
                                    ? t('extrasManagement.categoryConfigModal.badges.required')
                                    : t('extrasManagement.categoryConfigModal.badges.optional')
                                  }
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {category.extras.length} {t('extrasManagement.categoryConfigModal.category.availableExtras')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Expand Button */}
                          {category.extras.length > 0 && (
                            <button
                              onClick={() => handleCategoryExpand(category.productExtraCategoryId)}
                              className={`p-2 rounded-lg transition-colors self-end md:self-auto ${
                                category.isExpanded 
                                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {category.isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Configuration Form for Selected Category */}
                        {isSelected && config && category.isExpanded && (
                          <div className="mt-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 mb-3`}>
                              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <h5 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                                {t('extrasManagement.categoryConfigModal.category.configurationTitle')}
                              </h5>
                            </div>

                            {/* Responsive Grid for Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Always show Max Selection */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('extrasManagement.categoryConfigModal.fields.maxSelection')}
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    title='Max Selection Count'
                                    type="number"
                                    min="0"
                                    value={config.isMaxSelectionUnlimited ? '' : config.maxSelectionCount}
                                    onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'maxSelectionCount', parseInt(e.target.value) || 0)}
                                    disabled={config.isMaxSelectionUnlimited}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                  />
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={config.isMaxSelectionUnlimited || false}
                                      onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'isMaxSelectionUnlimited', e.target.checked)}
                                      className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                      {t('extrasManagement.categories.fields.unlimited')}
                                    </span>
                                  </label>
                                </div>
                              </div>

                              {!isRemoval && (
                                <>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('extrasManagement.categoryConfigModal.fields.minSelection')}
                                    </label>
                                    <input
                                      title='Min Selection Count'
                                      type="number"
                                      min="0"
                                      value={config.minSelectionCount}
                                      onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'minSelectionCount', parseInt(e.target.value) || 0)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('extrasManagement.categoryConfigModal.fields.minQuantity')}
                                    </label>
                                    <input
                                      title='Min Quantity'
                                      type="number"
                                      min="0"
                                      value={config.minTotalQuantity}
                                      onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'minTotalQuantity', parseInt(e.target.value) || 0)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('extrasManagement.categoryConfigModal.fields.maxQuantity')}
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        title='Max Quantity'
                                        type="number"
                                        min="0"
                                        value={config.isMaxQuantityUnlimited ? '' : config.maxTotalQuantity}
                                        onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'maxTotalQuantity', parseInt(e.target.value) || 0)}
                                        disabled={config.isMaxQuantityUnlimited}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                      />
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={config.isMaxQuantityUnlimited || false}
                                          onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'isMaxQuantityUnlimited', e.target.checked)}
                                          className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                          {t('extrasManagement.categories.fields.unlimited')}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Override Checkbox */}
                            <div className={`mt-3 flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                              <input
                                type="checkbox"
                                id={`required-${category.productExtraCategoryId}`}
                                checked={config.isRequiredOverride}
                                onChange={(e) => handleConfigChange(category.productExtraCategoryId, 'isRequiredOverride', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={`required-${category.productExtraCategoryId}`} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                {t('extrasManagement.categoryConfigModal.fields.overrideRequired')}
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Extras List Section */}
                      {category.isExpanded && category.extras.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700/30">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                            {t('extrasManagement.categoryConfigModal.category.selectExtrasTitle')}
                          </h5>
                          
                          <div className="space-y-3">
                            {category.extras.map((extra) => {
                              const isExtraSelected = config?.selectedExtras.has(extra.productExtraId);
                              const extraConfig = extrasSpecificConfig[extra.productExtraId] || {
                                specialUnitPrice: extra.unitPrice,
                                minQuantity: extra.defaultMinQuantity || 0,
                                maxQuantity: extra.defaultMaxQuantity,
                                isRequiredOverride: false,
                                isMaxQuantityUnlimited: false
                              };
                              const isEditing = editingExtraId === extra.productExtraId;
                              const isExtraRemoval = extra.isRemoval;

                              return (
                                <div
                                  key={extra.productExtraId}
                                  className={`rounded-lg border-2 transition-all duration-200 ${
                                    isExtraSelected
                                      ? 'border-green-500/50 bg-green-50 dark:bg-green-900/10'
                                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                                  } ${!isSelected ? 'opacity-50' : ''}`}
                                >
                                  <div
                                    onClick={() => !isEditing && handleExtraToggle(category.productExtraCategoryId, extra.productExtraId)}
                                    className={`p-3 flex items-center justify-between cursor-pointer`}
                                  >
                                    <div className="flex-1 min-w-0 pr-3">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                                          {extra.extraName}
                                        </p>
                                        {isExtraRemoval && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 whitespace-nowrap">
                                            {t('extrasManagement.categoryConfigModal.badges.removal')}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {!isExtraRemoval ? (
                                          <>
                                            {currency.symbol}{(extraConfig.specialUnitPrice || extra.unitPrice).toFixed(2)}
                                            {extraConfig.specialUnitPrice > 0 && extraConfig.specialUnitPrice !== extra.unitPrice && (
                                              <span className="ml-1 text-blue-600 dark:text-blue-400">
                                                (Orig: {currency.symbol}{extra.unitPrice.toFixed(2)})
                                              </span>
                                            )}
                                          </>
                                        ) : (
                                          t('extrasManagement.categoryConfigModal.labels.removesIngredient')
                                        )}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      {isExtraSelected && isSelected && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExtraEdit(extra.productExtraId);
                                          }}
                                          className={`p-2 rounded-lg transition-colors ${
                                            isEditing
                                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                                          }`}
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      )}
                                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                                        isExtraSelected 
                                          ? 'bg-green-600 border-green-600 text-white' 
                                          : 'bg-transparent border-gray-300 dark:border-gray-500'
                                      }`}>
                                        {isExtraSelected && <Check className="h-3 w-3" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Inline Extra Config Editor */}
                                  {isEditing && isExtraSelected && (
                                    <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/30 rounded-b-lg">
                                      <div className="grid grid-cols-2 gap-3">
                                        {!isExtraRemoval ? (
                                          <div>
                                            <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                              {t('extrasManagement.categoryConfigModal.fields.specialPrice')}
                                            </label>
                                            <input
                                              title='Special Price'
                                              type="number"
                                              step="0.1"
                                              value={extraConfig.specialUnitPrice}
                                              onChange={(e) => handleExtraConfigChange(extra.productExtraId, 'specialUnitPrice', parseFloat(e.target.value) || 0)}
                                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            />
                                          </div>
                                        ) : (
                                          <div className="col-span-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                                            {t('extrasManagement.categoryConfigModal.messages.removalPriceWarning')}
                                          </div>
                                        )}

                                        {!isExtraRemoval && (
                                          <div>
                                            <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                              {t('extrasManagement.categoryConfigModal.fields.minQty')}
                                            </label>
                                            <input
                                              title='Min Quantity'
                                              type="number"
                                              min="0"
                                              value={extraConfig.minQuantity}
                                              onChange={(e) => handleExtraConfigChange(extra.productExtraId, 'minQuantity', parseInt(e.target.value) || 0)}
                                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            />
                                          </div>
                                        )}

                                        <div className="col-span-2">
                                          <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            {t('extrasManagement.categoryConfigModal.fields.maxQty')}
                                          </label>
                                          <div className="flex gap-2">
                                            <input
                                              title='Max Quantity'
                                              type="number"
                                              min="0"
                                              value={extraConfig.isMaxQuantityUnlimited ? '' : extraConfig.maxQuantity}
                                              disabled={extraConfig.isMaxQuantityUnlimited}
                                              onChange={(e) => handleExtraConfigChange(extra.productExtraId, 'maxQuantity', parseInt(e.target.value) || 0)}
                                              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                                            />
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={extraConfig.isMaxQuantityUnlimited || false}
                                                onChange={(e) => handleExtraConfigChange(extra.productExtraId, 'isMaxQuantityUnlimited', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600"
                                              />
                                              <span className="text-xs text-gray-600 dark:text-gray-400">Unlimited</span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <div className={`flex flex-col-reverse sm:flex-row items-center justify-end gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50"
              >
                {t('extrasManagement.categoryConfigModal.footer.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 font-medium shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
                {isSaving 
                  ? t('extrasManagement.categoryConfigModal.footer.saving') 
                  : t('extrasManagement.categoryConfigModal.footer.save')
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BranchProductExtraCategoriesModal;