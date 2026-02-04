import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Star,
  Package,
  Settings,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Zap,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { 
  branchProductAddonsService, 
  BranchProductAddon, 
  BranchProductAddonDetails,
  CreateBranchProductAddonDto,
  UpdateBranchProductAddonDto 
} from '../../../../services/Branch/BranchAddonsService';
import { DetailedProduct, EnhancedAddon } from '../../../../types/BranchManagement/type';
import AddonCard from './AddonCard';

interface ProductAddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DetailedProduct | null;
  availableAddons: BranchProductAddon[];
  onSave?: (branchProductId: number, selectedAddonIds: number[], customizations: any) => void;
  isLoading?: boolean;
}

const BranchProductAddonsModal: React.FC<ProductAddonsModalProps> = ({
  isOpen,
  onClose,
  product,
  availableAddons,
  onSave,

}) => {
  const { t, isRTL } = useLanguage();
  
  // State management
  const [enhancedAddons, setEnhancedAddons] = useState<EnhancedAddon[]>([]);
  const [filteredAddons, setFilteredAddons] = useState<EnhancedAddon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingAddons, setIsLoadingAddons] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Add processing state to prevent multiple rapid actions
  const [processingAddonId, setProcessingAddonId] = useState<number | null>(null);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && product?.branchProductId) {
      loadProductAddons();
    } else if (isOpen) {
      prepareAvailableAddons([]);
    }
  }, [isOpen, product?.branchProductId, availableAddons]);

  // Filter addons based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAddons(enhancedAddons);
    } else {
      const filtered = enhancedAddons.filter(addon =>
        addon.addonProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.addonProductDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.addonCategoryName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAddons(filtered);
    }
  }, [searchTerm, enhancedAddons]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadProductAddons = async () => {
    if (!product?.branchProductId) return;

    setIsLoadingAddons(true);
    setError(null);

    try {
      const currentAssignments = await branchProductAddonsService.getBranchProductAddons(product.branchProductId);
      prepareAvailableAddons(currentAssignments);
    } catch (err: any) {
      console.error('Error loading product addons:', err);
      setError(t('addonModal.messages.errors.loadFailed'));
      prepareAvailableAddons([]);
    } finally {
      setIsLoadingAddons(false);
    }
  };

  const prepareAvailableAddons = (assignments: BranchProductAddonDetails[]) => {
    if (!product?.branchProductId) {
      setEnhancedAddons([]);
      return;
    }

    const productSpecificAddons = availableAddons.filter(available => 
      available.mainBranchProductId === product.branchProductId
    );

    const enhanced: EnhancedAddon[] = productSpecificAddons.map(available => {
      const assignment = assignments.find(a => a.addonBranchProductId === available.addonBranchProductId);
      
      return {
        ...available,
        assignmentId: assignment?.id,
        isAssigned: !!assignment,
        currentSpecialPrice: assignment?.specialPrice ?? available.addonPrice,
        currentMarketingText: assignment?.marketingText ?? available.marketingText,
        currentMaxQuantity: assignment?.maxQuantity ?? 10,
        currentMinQuantity: assignment?.minQuantity ?? 0,
        currentGroupTag: assignment?.groupTag ?? '',
        currentIsGroupRequired: assignment?.isGroupRequired ?? false,
        currentIsActive: assignment?.isActive ?? true,
        currentDisplayOrder: assignment?.displayOrder ?? available.suggestedDisplayOrder,
        editedSpecialPrice: assignment?.specialPrice ?? available.addonPrice,
        editedMarketingText: assignment?.marketingText ?? available.marketingText,
        editedMaxQuantity: assignment?.maxQuantity ?? 10,
        editedMinQuantity: assignment?.minQuantity ?? 0,
        editedGroupTag: assignment?.groupTag ?? '',
        editedIsGroupRequired: assignment?.isGroupRequired ?? false,
        editedIsRecommended: available.isRecommended,
      };
    });

    setEnhancedAddons(enhanced);
  };

  const handleAddonToggle = async (addon: EnhancedAddon) => {
    if (!product?.branchProductId || processingAddonId === addon.addonBranchProductId) return;

    setProcessingAddonId(addon.addonBranchProductId);
    setIsSaving(true);
    setError(null);
    
    try {
      if (addon.isAssigned && addon.assignmentId) {
        setEnhancedAddons(prev => prev.map(a => 
          a.addonBranchProductId === addon.addonBranchProductId 
            ? { ...a, isAssigned: false, assignmentId: undefined }
            : a
        ));
        
        await branchProductAddonsService.deleteBranchProductAddon(addon.assignmentId);
        setSuccessMessage(t('addonModal.messages.success.addonRemoved'));
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } else if (!addon.isAssigned) {
        const createData: CreateBranchProductAddonDto = {
          mainBranchProductId: product.branchProductId,
          addonBranchProductId: addon.addonBranchProductId,
          isActive: true,
          specialPrice: addon.editedSpecialPrice || addon.addonPrice,
          marketingText: addon.editedMarketingText || addon.marketingText,
          maxQuantity: addon.editedMaxQuantity || 10,
          minQuantity: addon.editedMinQuantity || 0,
          groupTag: addon.editedGroupTag || '',
          isGroupRequired: addon.editedIsGroupRequired || false,
        };

        await branchProductAddonsService.createBranchProductAddon(createData);
        setSuccessMessage(t('addonModal.messages.success.addonAdded'));
      }

      await loadProductAddons();
      
      if (onSave && product?.branchProductId) {
        const updatedEnhancedAddons = enhancedAddons.map(a => 
          a.addonBranchProductId === addon.addonBranchProductId 
            ? { ...a, isAssigned: !addon.isAssigned }
            : a
        );
        
        const selectedAddonIds = updatedEnhancedAddons.filter(a => a.isAssigned).map(a => a.addonBranchProductId);
        const customizations = updatedEnhancedAddons
          .filter(a => a.isAssigned)
          .reduce((acc, a) => {
            acc[a.addonBranchProductId] = {
              specialPrice: a.editedSpecialPrice,
              marketingText: a.editedMarketingText,
              maxQuantity: a.editedMaxQuantity,
              minQuantity: a.editedMinQuantity,
              groupTag: a.editedGroupTag,
              isGroupRequired: a.editedIsGroupRequired,
            };
            return acc;
          }, {} as any);
        
        onSave(product.branchProductId, selectedAddonIds, customizations);
      }
      
    } catch (err: any) {
      console.error('Error toggling addon:', err);
      setError(t('addonModal.messages.errors.updateFailed') + ': ' + (err.message || 'Unknown error'));
      await loadProductAddons();
    } finally {
      setIsSaving(false);
      setProcessingAddonId(null);
    }
  };

  const handlePropertyChange = (addonBranchProductId: number, property: string, value: any) => {
    setEnhancedAddons(prev => prev.map(addon => {
      if (addon.addonBranchProductId === addonBranchProductId) {
        return {
          ...addon,
          [`edited${property.charAt(0).toUpperCase() + property.slice(1)}`]: value
        };
      }
      return addon;
    }));
  };

  const handleUpdateAddon = async (addon: EnhancedAddon) => {
    if (!addon.assignmentId || processingAddonId === addon.addonBranchProductId) return;

    setProcessingAddonId(addon.addonBranchProductId);
    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateBranchProductAddonDto = {
        isActive: addon.currentIsActive ?? true,
        specialPrice: addon.editedSpecialPrice || addon.addonPrice,
        marketingText: addon.editedMarketingText || addon.marketingText,
        maxQuantity: addon.editedMaxQuantity || 10,
        minQuantity: addon.editedMinQuantity || 0,
        groupTag: addon.editedGroupTag || '',
        isGroupRequired: addon.editedIsGroupRequired || false,
      };

      await branchProductAddonsService.updateBranchProductAddon(addon.assignmentId, updateData);
      await loadProductAddons();
      setSuccessMessage(t('addonModal.messages.success.addonUpdated'));
      
      if (onSave && product?.branchProductId) {
        const selectedAddonIds = enhancedAddons.filter(a => a.isAssigned).map(a => a.addonBranchProductId);
        const customizations = enhancedAddons
          .filter(a => a.isAssigned)
          .reduce((acc, a) => {
            acc[a.addonBranchProductId] = {
              specialPrice: a.editedSpecialPrice,
              marketingText: a.editedMarketingText,
              maxQuantity: a.editedMaxQuantity,
              minQuantity: a.editedMinQuantity,
              groupTag: a.editedGroupTag,
              isGroupRequired: a.editedIsGroupRequired,
            };
            return acc;
          }, {} as any);
        onSave(product.branchProductId, selectedAddonIds, customizations);
      }
      
    } catch (err: any) {
      console.error('Error updating addon:', err);
      setError(t('addonModal.messages.errors.propertiesFailed'));
    } finally {
      setIsSaving(false);
      setProcessingAddonId(null);
    }
  };

  const resetAndClose = () => {
    setEnhancedAddons([]);
    setSearchTerm('');
    setError(null);
    setSuccessMessage(null);
    setProcessingAddonId(null);
    onClose();
  };

  if (!isOpen || !product) return null;
  
  const assignedAddons = filteredAddons.filter(addon => addon.isAssigned);
  const unassignedAddons = filteredAddons.filter(addon => !addon.isAssigned);
  const assignedCount = assignedAddons.length;
  const totalCount = filteredAddons.length;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-0 sm:px-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-gradient-to-br from-gray-900/80 via-purple-900/50 to-blue-900/80 backdrop-blur-md" onClick={resetAndClose} />

        <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-6xl bg-white dark:bg-gray-900 shadow-2xl sm:rounded-3xl border-0 sm:border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden text-left sm:my-8">
          
          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-4 sm:py-6 text-white shrink-0">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            
            <div className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0`}>
              <div className="flex-1">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-3 sm:mb-4`}>
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/30 shrink-0">
                    <Settings className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1 tracking-tight truncate">{t('addonModal.title')}</h3>
                    <div className="flex items-center space-x-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200 shrink-0" />
                      <p className="text-purple-100 text-sm sm:text-base font-medium truncate min-w-[200px]">{product.name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Pills */}
                <div className="flex  flex-wrap items-center gap-2 sm:gap-3">
                  <div className="group bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-white/25 transition-all duration-300 shadow-lg flex-1 sm:flex-none min-w-[100px]">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-white leading-none">{totalCount}</div>
                        <div className="text-[10px] sm:text-xs text-purple-100 font-medium truncate">{t('addonModal.stats.available')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-emerald-500/20 backdrop-blur-xl border border-emerald-300/30 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-emerald-500/30 transition-all duration-300 shadow-lg flex-1 sm:flex-none min-w-[100px]">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400/30 rounded-lg flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-white leading-none">{assignedCount}</div>
                        <div className="text-[10px] sm:text-xs text-emerald-100 font-medium truncate">{t('addonModal.stats.assigned')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center justify-end ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} absolute top-0 right-0 md:relative md:top-auto md:right-auto`}>
                <button
                  onClick={loadProductAddons}
                  disabled={isLoadingAddons}
                  className="p-2 sm:p-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                  title={t('addonModal.refresh')}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoadingAddons ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={resetAndClose}
                  className="p-2 sm:p-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-4 sm:py-6 flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            {error && (
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-red-500 rounded-xl shadow-sm shrink-0`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-3 shrink-0">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-red-800 dark:text-red-300 text-xs sm:text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-emerald-500 rounded-xl shadow-sm shrink-0`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mr-3 shrink-0">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-4 sm:mb-6 shrink-0">
              <div className="relative group">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-indigo-500 transition-colors ${isRTL ? 'right-4 sm:right-5' : 'left-4 sm:left-5'}`} />
                <input
                  type="text"
                  placeholder={t('addonModal.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-3 sm:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 text-sm sm:text-base backdrop-blur-sm ${isRTL ? 'pr-10 sm:pr-14 pl-4 sm:pl-6 text-right' : 'pl-10 sm:pl-14 pr-4 sm:pr-6'}`}
                />
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 min-h-0">
              {isLoadingAddons ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-base sm:text-lg">{t('addonModal.loading')}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Please wait a moment</p>
                  </div>
                </div>
              ) : filteredAddons.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {t('addonModal.emptyState.title')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-lg px-4">
                    {t('addonModal.emptyState.description')}
                  </p>
                  <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-indigo-600 dark:text-indigo-400`} />
                    <span className="text-indigo-700 dark:text-indigo-300 font-medium text-xs sm:text-sm">{t('addonModal.emptyState.productId')} {product.branchProductId}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 sm:space-y-8 pb-6">
                  {/* Assigned Addons Section */}
                  {assignedAddons.length > 0 && (
                    <div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4 sm:mb-5 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2`}>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">
                          {t('addonModal.sections.assignedAddons')} <span className="text-emerald-600 dark:text-emerald-400">({assignedAddons.length})</span>
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {assignedAddons.map((addon) => (
                          <AddonCard
                            key={addon.addonBranchProductId}
                            addon={addon}
                            isRTL={isRTL}
                            isSaving={processingAddonId === addon.addonBranchProductId}
                            onToggle={() => handleAddonToggle(addon)}
                            onPropertyChange={handlePropertyChange}
                            onUpdate={() => handleUpdateAddon(addon)}
                            t={t}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unassigned Addons Section */}
                  {unassignedAddons.length > 0 && (
                    <div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4 sm:mb-5 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2`}>
                        <div className="w-2 h-2 bg-gray-400 rounded-full shadow-lg shadow-gray-400/50"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">
                          {t('addonModal.sections.availableAddons')} <span className="text-gray-500 dark:text-gray-400">({unassignedAddons.length})</span>
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {unassignedAddons.map((addon) => (
                          <AddonCard
                            key={addon.addonBranchProductId}
                            addon={addon}
                            isRTL={isRTL}
                            isSaving={processingAddonId === addon.addonBranchProductId}
                            onToggle={() => handleAddonToggle(addon)}
                            onPropertyChange={handlePropertyChange}
                            onUpdate={() => handleUpdateAddon(addon)}
                            t={t}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-t border-gray-200 dark:border-gray-700 shrink-0 mt-auto">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {assignedCount} {t('addonModal.footer.summary')} {totalCount} {totalCount === 1 ? t('addonModal.footer.addon') : t('addonModal.footer.addons')} {t('addonModal.footer.assigned')}
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetAndClose}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-600 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {t('addonModal.actions.done')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6));
        }
      `}</style>
    </div>
  );
};

export default BranchProductAddonsModal;