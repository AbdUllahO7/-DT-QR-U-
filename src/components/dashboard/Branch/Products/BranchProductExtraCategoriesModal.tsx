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
  DollarSign,
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
}

interface ExtrasConfig {
  [categoryId: number]: {
    isRequiredOverride: boolean;
    minSelectionCount: number;
    maxSelectionCount: number;
    minTotalQuantity: number;
    maxTotalQuantity: number;
    selectedExtras: Set<number>;
  };
}

interface ExtraSpecificConfig {
  specialUnitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequiredOverride: boolean;
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
        extras: [] 
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
            extras: []
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
            selectedExtras: new Set() 
          };
        });

        existingExtrasData.forEach((existingExtra) => {
          extraRelationMap.set(existingExtra.productExtraId, existingExtra.id);

          // Store extra-specific configuration
          initialExtrasConfig[existingExtra.productExtraId] = {
            specialUnitPrice: existingExtra.specialUnitPrice ?? 0,
            minQuantity: existingExtra.minQuantity ?? 0,
            maxQuantity: existingExtra.maxQuantity ?? 1,
            isRequiredOverride: existingExtra.isRequiredOverride ?? false,
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
              maxQuantity: 1,
              isRequiredOverride: false,
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
        try {
          await branchProductExtraCategoriesService.deleteBranchProductExtraCategory(relationId);
        } catch (err) {
          console.error(`Failed to delete category relation ${relationId}`, err);
        }
      }

      // PHASE 2: CREATE OR UPDATE CATEGORIES
      for (const categoryId of selectedCategories) {
        const config = extrasConfig[categoryId];
        if (!config) continue;

        const existingRelationId = existingRelationIds.get(categoryId);

        if (existingRelationId) {
          const updateData: UpdateBranchProductExtraCategoryData = {
            id: existingRelationId,
            isRequiredOverride: config.isRequiredOverride,
            minSelectionCount: config.minSelectionCount,
            maxSelectionCount: config.maxSelectionCount,
            minTotalQuantity: config.minTotalQuantity,
            maxTotalQuantity: config.maxTotalQuantity,
            isActive: true
          };
          await branchProductExtraCategoriesService.updateBranchProductExtraCategory(updateData);
        } else {
          const createData: CreateBranchProductExtraCategoryData = {
            branchProductId,
            productExtraCategoryId: categoryId,
            isRequiredOverride: config.isRequiredOverride,
            minSelectionCount: config.minSelectionCount,
            maxSelectionCount: config.maxSelectionCount,
            minTotalQuantity: config.minTotalQuantity,
            maxTotalQuantity: config.maxTotalQuantity,
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
        try {
          await branchProductExtrasService.deleteBranchProductExtra(relationId);
        } catch (err) {
          console.error(`Failed to delete extra relation ${relationId}`, err);
        }
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
              minQuantity: extraConfig.minQuantity,
              maxQuantity: extraConfig.maxQuantity,
              isRequiredOverride: extraConfig.isRequiredOverride,
            };
            try {
              await branchProductExtrasService.updateBranchProductExtra(updateData);
            } catch(err) {
              console.error(`Error updating extra ${extraId}`, err);
            }
          } else {
            const extraData: CreateBranchProductExtraData = {
              branchProductId,
              productExtraId: extraId,
              isActive: true,
              // Don't send specialUnitPrice for removal extras
              specialUnitPrice: isRemoval ? 0 : extraConfig.specialUnitPrice,
              minQuantity: extraConfig.minQuantity,
              maxQuantity: extraConfig.maxQuantity,
              isRequiredOverride: extraConfig.isRequiredOverride,
            };
  
            try {
              await branchProductExtrasService.createBranchProductExtra(extraData);
            } catch (err) {
              console.error(`Error creating extra ${extraId}:`, err);
            }
          }
        }
      }

      await onSave(branchProductId, Array.from(selectedCategories), allSelectedExtras);
      onClose();
    } catch (err: any) {
      console.error('Error saving:', err);
      setError(err.response?.data?.message || t('extrasManagement.categoryConfigModal.errors.saveFailed'));
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
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('extrasManagement.categoryConfigModal.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('extrasManagement.categoryConfigModal.productLabel')} <span className="font-medium">{productName}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.selectedCategories')}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedCategories.size}
                    </p>
                  </div>
                  <Grid3X3 className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-50" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.selectedExtras')}
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getTotalSelectedExtras()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-600 dark:text-green-400 opacity-50" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('extrasManagement.categoryConfigModal.stats.available')}
                    </p>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {availableCategories.length}
                    </p>
                  </div>
                  <Info className="h-8 w-8 text-gray-400 dark:text-gray-500 opacity-50" />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
              <input
                type="text"
                placeholder={t('extrasManagement.categoryConfigModal.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4 max-h-[500px] overflow-y-auto">
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

                  return (
                    <div
                      key={category.productExtraCategoryId}
                      className={`border-2 rounded-xl transition-all ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      {/* Category Header */}
                      <div className="p-4">
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                            <button
                              onClick={() => handleCategoryToggle(category.productExtraCategoryId)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </button>
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {category.extraCategoryName}
                              </h4>
                              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 mt-1`}>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  category.isRequired
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
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

                          {category.extras.length > 0 && (
                            <button
                              onClick={() => handleCategoryExpand(category.productExtraCategoryId)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              {category.isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Configuration for selected category */}
                        {isSelected && config && category.isExpanded && (
                          <div className="mt-4 p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 mb-3`}>
                              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {t('extrasManagement.categoryConfigModal.category.configurationTitle')}
                              </h5>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('extrasManagement.categoryConfigModal.fields.minSelection')}
                                </label>
                                <input
                                  title='minSelectionCount'
                                  type="number"
                                  min="0"
                                  value={config.minSelectionCount}
                                  onChange={(e) =>
                                    handleConfigChange(
                                      category.productExtraCategoryId,
                                      'minSelectionCount',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('extrasManagement.categoryConfigModal.fields.maxSelection')}
                                </label>
                                <input
                                  title="maxSelectionCount"
                                  type="number"
                                  min="0"
                                  value={config.maxSelectionCount}
                                  onChange={(e) =>
                                    handleConfigChange(
                                      category.productExtraCategoryId,
                                      'maxSelectionCount',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('extrasManagement.categoryConfigModal.fields.minQuantity')}
                                </label>
                                <input
                                  title='Minimum Total Quantity'
                                  type="number"
                                  min="0"
                                  value={config.minTotalQuantity}
                                  onChange={(e) =>
                                    handleConfigChange(
                                      category.productExtraCategoryId,
                                      'minTotalQuantity',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('extrasManagement.categoryConfigModal.fields.maxQuantity')}
                                </label>
                                <input
                                  title='Max Total Quantity'
                                  type="number"
                                  min="0"
                                  value={config.maxTotalQuantity}
                                  onChange={(e) =>
                                    handleConfigChange(
                                      category.productExtraCategoryId,
                                      'maxTotalQuantity',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>
                            
                            <div className={`mt-3 flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                              <input
                                type="checkbox"
                                id={`required-${category.productExtraCategoryId}`}
                                checked={config.isRequiredOverride}
                                onChange={(e) =>
                                  handleConfigChange(
                                    category.productExtraCategoryId,
                                    'isRequiredOverride',
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`required-${category.productExtraCategoryId}`}
                                className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                {t('extrasManagement.categoryConfigModal.fields.overrideRequired')}
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Extras list */}
                      {category.isExpanded && category.extras.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700/30">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                            {t('extrasManagement.categoryConfigModal.category.selectExtrasTitle')}
                          </h5>
                          {!isSelected && (
                            <p className="text-xs text-amber-600 mb-2">
                              {t('extrasManagement.categoryConfigModal.category.selectCategoryWarning')}
                            </p>
                          )}
                          <div className="space-y-3">
                            {category.extras.map((extra) => {
                              const isExtraSelected = config?.selectedExtras.has(extra.productExtraId);
                              const extraConfig = extrasSpecificConfig[extra.productExtraId] || {
                                specialUnitPrice: extra.unitPrice,
                                minQuantity: 1,
                                maxQuantity: 1,
                                isRequiredOverride: false,
                              };
                              const isEditing = editingExtraId === extra.productExtraId;
                              const isRemoval = extra.isRemoval;

                              return (
                                <div
                                  key={extra.productExtraId}
                                  className={`rounded-lg border-2 transition-all ${
                                    isExtraSelected
                                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                                  } ${!isSelected ? 'opacity-50' : ''}`}
                                >
                                  <div
                                    onClick={() => !isEditing && handleExtraToggle(category.productExtraCategoryId, extra.productExtraId)}
                                    className={`p-3 flex items-center justify-between ${!isSelected || isEditing ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                          {extra.extraName}
                                        </p>
                                        {isRemoval && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                            Removal
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {!isRemoval && (
                                          <>
                                            ${(extraConfig.specialUnitPrice || extra.unitPrice).toFixed(2)}
                                            {extraConfig.specialUnitPrice > 0 && extraConfig.specialUnitPrice !== extra.unitPrice && (
                                              <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                                                (Original: ${extra.unitPrice.toFixed(2)})
                                              </span>
                                            )}
                                          </>
                                        )}
                                        {isRemoval && (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Removes ingredient
                                          </span>
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
                                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                                          }`}
                                          title="Edit extra configuration"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      )}
                                      <div
                                        className={`w-5 h-5 rounded flex items-center justify-center ${
                                          isExtraSelected
                                            ? 'bg-green-600 dark:bg-green-500'
                                            : 'bg-gray-200 dark:bg-gray-600'
                                        }`}
                                      >
                                        {isExtraSelected && <Check className="h-3 w-3 text-white" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Extra Configuration Panel */}
                                  {isEditing && isExtraSelected && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-700/50">
                                      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 mb-3`}>
                                        <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        <h6 className="font-medium text-sm text-gray-900 dark:text-white">
                                          Extra Configuration
                                        </h6>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        {!isRemoval && (
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Special Price
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              step="1"
                                              value={extraConfig.specialUnitPrice}
                                              onChange={(e) =>
                                                handleExtraConfigChange(
                                                  extra.productExtraId,
                                                  'specialUnitPrice',
                                                  parseFloat(e.target.value) || 1
                                                )
                                              }
                                              onClick={(e) => e.stopPropagation()}
                                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                              placeholder={`Default: ${extra.unitPrice}`}
                                            />
                                          </div>
                                        )}
                                        
                                        {isRemoval && (
                                          <div className="col-span-2">
                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center">
                                                <AlertCircle className="inline h-3 w-3 mr-1" />
                                                Price cannot be set for removal extras
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Min Quantity
                                          </label>
                                          <input
                                          title='max'
                                            type="number"
                                            min="0"
                                            value={extraConfig.minQuantity}
                                            onChange={(e) =>
                                              handleExtraConfigChange(
                                                extra.productExtraId,
                                                'minQuantity',
                                                parseInt(e.target.value) || 1
                                              )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Max Quantity
                                          </label>
                                          <input
                                          title='Max Quantity'
                                            type="number"
                                            min="0"
                                            value={extraConfig.maxQuantity}
                                            onChange={(e) =>
                                              handleExtraConfigChange(
                                                extra.productExtraId,
                                                'maxQuantity',
                                                parseInt(e.target.value) ||1
                                              )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                          />
                                        </div>

                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id={`extra-required-${extra.productExtraId}`}
                                            checked={extraConfig.isRequiredOverride}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              handleExtraConfigChange(
                                                extra.productExtraId,
                                                'isRequiredOverride',
                                                e.target.checked
                                              );
                                            }}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                          />
                                          <label
                                            htmlFor={`extra-required-${extra.productExtraId}`}
                                            className="ml-2 text-xs text-gray-700 dark:text-gray-300"
                                          >
                                            Required
                                          </label>
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
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{selectedCategories.size}</span> {t('extrasManagement.categoryConfigModal.footer.categoriesSelected')}
              </div>
              <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                <button 
                  onClick={onClose} 
                  disabled={isSaving} 
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {t('extrasManagement.categoryConfigModal.footer.cancel')}
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
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
    </div>
  );
};

export default BranchProductExtraCategoriesModal;