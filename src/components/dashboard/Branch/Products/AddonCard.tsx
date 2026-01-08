import React, { useState } from 'react';
import {
  Plus,
  Star,
  Package,
  Settings,
  Save,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EnhancedAddon } from '../../../../types/BranchManagement/type';
import { useCurrency } from '../../../../hooks/useCurrency';

interface AddonCardProps {
  addon: EnhancedAddon;
  isRTL: boolean;
  isSaving: boolean;
  onToggle: () => void;
  onPropertyChange: (addonBranchProductId: number, property: string, value: any) => void;
  onUpdate: () => void;
  t: (key: string) => string;
}

const AddonCard: React.FC<AddonCardProps> = ({ 
  addon, 
  isRTL, 
  isSaving, 
  onToggle, 
  onPropertyChange, 
  onUpdate, 
  t 
}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);
    const currency = useCurrency();
  
  const hasPropertyChanges = 
    addon.editedSpecialPrice !== addon.currentSpecialPrice ||
    addon.editedMarketingText !== addon.currentMarketingText ||
    addon.editedMaxQuantity !== addon.currentMaxQuantity ||
    addon.editedMinQuantity !== addon.currentMinQuantity ||
    addon.editedGroupTag !== addon.currentGroupTag ||
    addon.editedIsGroupRequired !== addon.currentIsGroupRequired;

  return (
    <div className={`group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden backdrop-blur-sm ${
      addon.isAssigned
        ? 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 via-green-50/50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-emerald-900/20 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl shadow-md'
    }`}>
      
      {/* Gradient overlay for assigned cards */}
      {addon.isAssigned && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
      )}
      
      {/* Main Content */}
      <div className="relative p-6">
        <div className={`flex items-start justify-between `}>
          
          {/* Left Side - Info */}
          <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} flex-1 min-w-0`}>
            {/* Image */}
            {addon.addonImageUrl ? (
              <div className="relative flex-shrink-0">
                <img
                  src={addon.addonImageUrl}
                  alt={addon.addonProductName}
                  className="w-20 h-20 object-cover rounded-2xl shadow-lg ring-2 ring-white dark:ring-gray-700"
                />
                {addon.isRecommended && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-2`}>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                  {addon.addonProductName}
                </h4>
                {addon.isRecommended && !addon.addonImageUrl && (
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg`}>
                    <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-bold">{t('addonModal.status.recommended')}</span>
                  </div>
                )}
              </div>
              
              {addon.addonProductDescription && (
                <p className={`text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                  {addon.addonProductDescription}
                </p>
              )}
              
              {/* Price and Category */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} flex-wrap gap-2`}>
                <div className="flex items-center bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-3 py-1.5 rounded-xl">
                           <span className=''>{currency.symbol}</span>

                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                    {addon.isAssigned && addon.editedSpecialPrice !== addon.addonPrice 
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
                  <span className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                    {addon.addonCategoryName}
                  </span>
                )}
              </div>

              {/* Marketing Text */}
              {addon.isAssigned && addon.editedMarketingText && (
                <div className={`mt-3 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium italic">
                    "{addon.editedMarketingText}"
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Actions */}
          <div className={`flex flex-col ${isRTL ? 'items-start mr-4' : 'items-end ml-4'} space-y-3`}>
            {/* Status Badge */}
            {addon.isAssigned && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                ✓ {t('addonModal.status.assigned')}
              </span>
            )}
            
            {/* Action Buttons */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {addon.isAssigned && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all shadow-sm hover:shadow-md"
                  title="Configure"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
              
              <button
                onClick={onToggle}
                disabled={isSaving}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
                  addon.isAssigned
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
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
        <div className={`px-6 pb-6 border-t-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-900/10 dark:to-green-900/5`}>
          <div className="pt-5">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-5`}>
              <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h5 className={`text-base font-bold text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}>
                {t('addonModal.configuration.title')}
              </h5>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={`block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.specialPrice')}
                </label>
                <div className="relative">
                  <span className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500 ${isRTL ? 'right-4' : 'left-4'}`}>{currency.symbol}</span>
                  <input
                    title='number'
                    type="number"
                    step="0.01"
                    value={addon.editedSpecialPrice || addon.addonPrice}
                    onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'specialPrice', parseFloat(e.target.value) || 0)}
                    className={`w-full py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.minQuantity')}
                </label>
                <input
                  title='number'
                  type="number"
                  min="0"
                  step="1"
                  value={addon.editedMinQuantity || 0}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'minQuantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.maxQuantity')}
                </label>
                <input
                  title='number'
                  type="number"
                  min="1"
                  value={addon.editedMaxQuantity || 10}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'maxQuantity', parseInt(e.target.value) || 10)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <div>
                {/* Empty grid cell to balance the layout */}
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('addonModal.configuration.marketingText')}
                </label>
                <input
                  type="text"
                  placeholder={t('addonModal.configuration.placeholders.marketingText')}
                  value={addon.editedMarketingText || ''}
                  onChange={(e) => onPropertyChange(addon.addonBranchProductId, 'marketingText', e.target.value)}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              {hasPropertyChanges && (
                <div className={`sm:col-span-2 flex items-center justify-between`}>
                  <button
                    onClick={onUpdate}
                    disabled={isSaving || !hasPropertyChanges}
                    className={`w-full px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isRTL ? 'flex-row-reverse' : ''} space-x-2`}
                  >
                    {isSaving ? (
                      <Loader2 className={`w-5 h-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                      <Save className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    )}
                    <span>{t('addonModal.actions.saveChanges')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddonCard;