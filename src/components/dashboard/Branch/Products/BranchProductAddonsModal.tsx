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

    // Set processing state to prevent double clicks
    setProcessingAddonId(addon.addonBranchProductId);
    setIsSaving(true);
    setError(null);
    

    
    try {
      if (addon.isAssigned && addon.assignmentId) {
        
        // First update local state optimistically
        setEnhancedAddons(prev => prev.map(a => 
          a.addonBranchProductId === addon.addonBranchProductId 
            ? { ...a, isAssigned: false, assignmentId: undefined }
            : a
        ));
        
        // Then make the API call
        await branchProductAddonsService.deleteBranchProductAddon(addon.assignmentId);
        
        setSuccessMessage(t('addonModal.messages.success.addonRemoved'));
        
        // Wait a bit before reloading to ensure the deletion is processed
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

        const newAssignment = await branchProductAddonsService.createBranchProductAddon(createData);
        
        setSuccessMessage(t('addonModal.messages.success.addonAdded'));
      }

      // Always reload after any change to ensure consistency
      await loadProductAddons();
      
      // Call onSave callback if provided
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
      
      // Revert optimistic update on error
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
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gradient-to-br from-gray-900/80 via-purple-900/50 to-blue-900/80 backdrop-blur-md" onClick={resetAndClose} />
        
        <div className="inline-block w-full max-w-6xl px-0 py-0 my-4 overflow-hidden text-right transition-all transform bg-white dark:bg-gray-900 shadow-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
          
          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 text-white overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            
            <div className={`relative z-10 flex items-center justify-between `}>
              <div className="flex-1">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                    <Settings className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{t('addonModal.title')}</h3>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <p className="text-purple-100 text-base font-medium">{product.name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Pills */}
                <div className={`flex flex-wrap items-center gap-3`}>
                  <div className="group bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2.5 hover:bg-white/25 transition-all duration-300 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{totalCount}</div>
                        <div className="text-xs text-purple-100 font-medium">{t('addonModal.stats.available')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-emerald-500/20 backdrop-blur-xl border border-emerald-300/30 rounded-2xl px-4 py-2.5 hover:bg-emerald-500/30 transition-all duration-300 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-400/30 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{assignedCount}</div>
                        <div className="text-xs text-emerald-100 font-medium">{t('addonModal.stats.assigned')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-amber-500/20 backdrop-blur-xl border border-amber-300/30 rounded-2xl px-4 py-2.5 hover:bg-amber-500/30 transition-all duration-300 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-amber-400/30 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{assignedAddons.filter(a => a.isRecommended).length}</div>
                        <div className="text-xs text-amber-100 font-medium">{t('addonModal.stats.recommended')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <button
                  onClick={loadProductAddons}
                  disabled={isLoadingAddons}
                  className="p-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                  title={t('addonModal.refresh')}
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingAddons ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={resetAndClose}
                  className="p-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Messages */}
            {error && (
              <div className={`mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-red-500 rounded-xl shadow-sm`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className={`mb-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-emerald-500 rounded-xl shadow-sm`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-emerald-800 dark:text-emerald-300 text-sm font-medium">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative group">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors ${isRTL ? 'right-5' : 'left-5'}`} />
                <input
                  type="text"
                  placeholder={t('addonModal.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 text-base backdrop-blur-sm ${isRTL ? 'pr-14 pl-6 text-right' : 'pl-14 pr-6'}`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {isLoadingAddons ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">{t('addonModal.loading')}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Please wait a moment</p>
                  </div>
                </div>
              ) : filteredAddons.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('addonModal.emptyState.title')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-lg">
                    {t('addonModal.emptyState.description')}
                  </p>
                  <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Zap className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-indigo-600 dark:text-indigo-400`} />
                    <span className="text-indigo-700 dark:text-indigo-300 font-medium">{t('addonModal.emptyState.productId')} {product.branchProductId}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Assigned Addons Section */}
                  {assignedAddons.length > 0 && (
                    <div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-5`}>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl">
                          {t('addonModal.sections.assignedAddons')} <span className="text-emerald-600 dark:text-emerald-400">({assignedAddons.length})</span>
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-5`}>
                        <div className="w-2 h-2 bg-gray-400 rounded-full shadow-lg shadow-gray-400/50"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl">
                          {t('addonModal.sections.availableAddons')} <span className="text-gray-500 dark:text-gray-400">({unassignedAddons.length})</span>
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
          <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {assignedCount} {t('addonModal.footer.summary')} {totalCount} {totalCount === 1 ? t('addonModal.footer.addon') : t('addonModal.footer.addons')} {t('addonModal.footer.assigned')}
                  </div>
                
                </div>
              </div>
              
              <button
                onClick={resetAndClose}
                className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-600 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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