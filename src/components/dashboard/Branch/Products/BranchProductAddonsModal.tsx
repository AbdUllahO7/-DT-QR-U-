import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  Star,
  Package,
  DollarSign,
  Settings,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Search,
  Zap,
  ChevronDown,
  ChevronUp
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
  isLoading: parentLoading = false
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
    if (!product?.branchProductId) return;

    setIsSaving(true);
    setError(null);

    try {
      if (addon.isAssigned) {
        if (addon.assignmentId) {
          await branchProductAddonsService.deleteBranchProductAddon(addon.assignmentId);
        }
      } else {
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
      }

      await loadProductAddons();
      setSuccessMessage(addon.isAssigned ? t('addonModal.messages.success.addonRemoved') : t('addonModal.messages.success.addonAdded'));
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
      console.error('Error toggling addon:', err);
      setError(t('addonModal.messages.errors.updateFailed'));
    } finally {
      setIsSaving(false);
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
    if (!addon.assignmentId) return;

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
    }
  };

  const resetAndClose = () => {
    setEnhancedAddons([]);
    setSearchTerm('');
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  if (!isOpen || !product) return null;

  const assignedAddons = filteredAddons.filter(addon => addon.isAssigned);
  const unassignedAddons = filteredAddons.filter(addon => !addon.isAssigned);
  const assignedCount = assignedAddons.length;
  const totalCount = filteredAddons.length;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/50" onClick={resetAndClose} />
        
        <div className="inline-block w-full max-w-6xl px-0 py-0 my-4 overflow-hidden text-right transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className={`flex items-center justify-between `}>
              <div className="flex-1">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-3`}>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('addonModal.title')}</h3>
                    <p className="text-blue-100 text-sm font-medium">{product.name}</p>
                  </div>
                </div>
                
                {/* Stats Pills */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                    <Package className={`w-4 h-4 inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    {totalCount} {t('addonModal.stats.available')}
                  </div>
                  <div className="bg-green-500/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                    <Check className={`w-4 h-4 inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    {assignedCount} {t('addonModal.stats.assigned')}
                  </div>
                  <div className="bg-yellow-500/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                    <Star className={`w-4 h-4 inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                    {assignedAddons.filter(a => a.isRecommended).length} {t('addonModal.stats.recommended')}
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <button
                  onClick={loadProductAddons}
                  disabled={isLoadingAddons}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  title={t('addonModal.refresh')}
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingAddons ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={resetAndClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Messages */}
            {error && (
              <div className={`mb-6 p-4 bg-red-50 dark:bg-red-900/20 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-red-500 rounded-r-lg`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className={`h-5 w-5 text-red-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className={`mb-6 p-4 bg-green-50 dark:bg-green-900/20 ${isRTL ? 'border-r-4 border-l-0' : 'border-l-4'} border-green-500 rounded-r-lg`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Check className={`h-5 w-5 text-green-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="text-green-700 dark:text-green-300 text-sm font-medium">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  placeholder={t('addonModal.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {isLoadingAddons ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{t('addonModal.loading')}</p>
                  </div>
                </div>
              ) : filteredAddons.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('addonModal.emptyState.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    {t('addonModal.emptyState.description')}
                  </p>
                  <div className={`inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-300 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('addonModal.emptyState.productId')} {product.branchProductId}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Assigned Addons Section */}
                  {assignedAddons.length > 0 && (
                    <div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {t('addonModal.sections.assignedAddons')} ({assignedAddons.length})
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {assignedAddons.map((addon) => (
                          <AddonCard
                            key={addon.addonBranchProductId}
                            addon={addon}
                            isRTL={isRTL}
                            isSaving={isSaving}
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
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {t('addonModal.sections.availableAddons')} ({unassignedAddons.length})
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {unassignedAddons.map((addon) => (
                          <AddonCard
                            key={addon.addonBranchProductId}
                            addon={addon}
                            isRTL={isRTL}
                            isSaving={isSaving}
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
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{assignedCount}</span> {t('addonModal.footer.summary')} <span className="font-medium">{totalCount}</span> {totalCount === 1 ? t('addonModal.footer.addon') : t('addonModal.footer.addons')} {t('addonModal.footer.assigned')}
              </div>
              
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {t('addonModal.actions.done')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

// Enhanced Addon Card Component
const AddonCard: React.FC<{
  addon: EnhancedAddon;
  isRTL: boolean;
  isSaving: boolean;
  onToggle: () => void;
  onPropertyChange: (addonBranchProductId: number, property: string, value: any) => void;
  onUpdate: () => void;
  t: (key: string) => string;
}> = ({ addon, isRTL, isSaving, onToggle, onPropertyChange, onUpdate, t }) => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasPropertyChanges = 
    addon.editedSpecialPrice !== addon.currentSpecialPrice ||
    addon.editedMarketingText !== addon.currentMarketingText ||
    addon.editedMaxQuantity !== addon.currentMaxQuantity ||
    addon.editedMinQuantity !== addon.currentMinQuantity ||
    addon.editedGroupTag !== addon.currentGroupTag ||
    addon.editedIsGroupRequired !== addon.currentIsGroupRequired;

  return (
    <div className={`group relative rounded-xl border transition-all duration-200 overflow-hidden ${
      addon.isAssigned
        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 shadow-sm'
        : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
    }`}>
      
      {/* Main Content */}
      <div className="p-5">
        <div className={`flex items-start justify-between `}>
          
          {/* Left Side - Info */}
          <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} flex-1 min-w-0`}>
            {/* Image */}
            {addon.addonImageUrl ? (
              <img
                src={addon.addonImageUrl}
                alt={addon.addonProductName}
                className="w-16 h-16 object-cover rounded-xl shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {addon.addonProductName}
                </h4>
                {addon.isRecommended && (
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">{t('addonModal.status.recommended')}</span>
                  </div>
                )}
              </div>
              
              {addon.addonProductDescription && (
                <p className={`text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                  {addon.addonProductDescription}
                </p>
              )}
              
              {/* Price and Category */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="flex items-center">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                    ${addon.isAssigned && addon.editedSpecialPrice !== addon.addonPrice 
                      ? addon.editedSpecialPrice 
                      : addon.addonPrice
                    }
                  </span>
                  {addon.isAssigned && addon.editedSpecialPrice !== addon.addonPrice && (
                    <span className={`text-gray-400 line-through text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                      ${addon.addonPrice}
                    </span>
                  )}
                </div>
                {addon.addonCategoryName && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg text-xs font-medium">
                    {addon.addonCategoryName}
                  </span>
                )}
              </div>

              {/* Marketing Text */}
              {addon.isAssigned && addon.editedMarketingText && (
                <div className={`mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium ${isRTL ? 'text-right' : ''}`}>
                  "{addon.editedMarketingText}"
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Actions */}
          <div className={`flex flex-col ${isRTL ? 'items-start mr-4' : 'items-end ml-4'} space-y-2`}>
            {/* Status Badge */}
            {addon.isAssigned && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                {t('addonModal.status.assigned')}
              </span>
            )}
            
            {/* Action Buttons */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {addon.isAssigned && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  title="Configure"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
              
              <button
                onClick={onToggle}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${
                  addon.isAssigned
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : addon.isAssigned ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="text-sm">{addon.isAssigned ? t('addonModal.actions.remove') : t('addonModal.actions.add')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Configuration Panel */}
      {addon.isAssigned && isExpanded && (
        <div className={`px-5 pb-5 border-t border-green-200 dark:border-green-800 bg-green-25 dark:bg-green-900/10`}>
          <div className="pt-4">
            <h5 className={`text-sm font-semibold text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
              {t('addonModal.configuration.title')}
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.specialPrice')}
                </label>
                <div className="relative">
                  <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    title='number'
                    type="number"
                    step="1"
                    value={addon.editedSpecialPrice || addon.addonPrice}
                    onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'specialPrice', parseFloat(e.target.value) || 0)}
                    className={`w-full py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.minQuantity')}
                </label>
                <input
                  title='number'
                  type="number"
                  min="0"
                  step="1"
                  value={addon.editedMinQuantity || 0}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'minQuantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.maxQuantity')}
                </label>
                <input
                title='number'
                  type="number"
                  min="1"
                  value={addon.editedMaxQuantity || 10}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'maxQuantity', parseInt(e.target.value) || 10)}
                  className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <div>
                {/* Empty grid cell to balance the layout */}
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.marketingText')}
                </label>
                <input
                  type="text"
                  placeholder={t('addonModal.configuration.placeholders.marketingText')}
                  value={addon.editedMarketingText || ''}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'marketingText', e.target.value)}
                  className={`w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <div className={`sm:col-span-2 flex items-center justify-between`}>
              

                {hasPropertyChanges && (
                  <button
                    onClick={onUpdate}
                    disabled={isSaving}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center disabled:opacity-50 text-sm font-medium transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {isSaving ? (
                      <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                      <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    )}
                    {t('addonModal.actions.saveChanges')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchProductAddonsModal;