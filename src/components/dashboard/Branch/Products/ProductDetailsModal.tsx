import React from 'react';
import { 
  Check, 
  X, 
  AlertCircle,
  Utensils,
  Package
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {ProductDetailsModalProps } from '../../../../types/BranchManagement/type';


const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const { t, isRTL } = useLanguage();

  // Helper function to get translated allergen name
  const getTranslatedAllergenName = (allergenCode: string | null, originalName: string) => {
    try {
      const nameKey = `allergens.${allergenCode}.name`;
      const translatedName = t(nameKey);
      
      // If translation returns the key itself, use original value
      return translatedName === nameKey ? originalName : translatedName;
    } catch (error) {
      // Fallback to original value if translation fails
      return originalName;
    }
  };

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4"
      onClick={handleOverlayClick}
    >
      <div className={`bg-white dark:bg-gray-800 sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <div className={`flex items-center space-x-3 mt-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${product.price.toFixed(2)}
                  </span>
                
                  {product.isSelected && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {t('branchCategories.productDetails.addedToBranch')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 sm:max-h-[calc(90vh-120px)]">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Allergens Section */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('branchCategories.productDetails.allergens')}
                  </h4>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                    {product.allergens.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {product.allergens.map((allergen) => (
                    <div 
                      key={allergen.allergenId} 
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800"
                    >
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <span className="text-2xl">{allergen.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {getTranslatedAllergenName(allergen.code, allergen.name)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {allergen.code}
                          </div>
                          {allergen.presence && (
                            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                              allergen.presence === 1 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {allergen.presence === 1 ? t('branchCategories.productDetails.contains') : t('branchCategories.productDetails.mayContain')}
                            </div>
                          )}
                        </div>
                      </div>
                      {allergen.note && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                          {allergen.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('branchCategories.productDetails.ingredients')}
                  </h4>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {product.ingredients.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {product.ingredients.map((ingredient) => (
                    <div 
                      key={ingredient.id} 
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800"
                    >
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {ingredient.ingredientName}
                            </h5>
                            {ingredient.isAllergenic && (
                              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
                                {t('branchCategories.productDetails.allergenic')}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ingredient.isAvailable 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                              {ingredient.isAvailable ? t('branchCategories.productDetails.available') : t('branchCategories.productDetails.unavailable')}
                            </span>
                          </div>
                          <div className={`flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <span>{t('branchCategories.productDetails.quantity')} {ingredient.quantity} {ingredient.unit}</span>
                            <span>{t('branchCategories.productDetails.ingredientId')} {ingredient.ingredientId}</span>
                          </div>
                          
                          {/* Ingredient Allergens */}
                          {ingredient.allergens && ingredient.allergens.length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {t('branchCategories.productDetails.allergenInformation')}
                              </div>
                              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {ingredient.allergens.map((allergen) => (
                                  <span 
                                    key={allergen.id}
                                    className={`inline-flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs ${isRTL ? 'space-x-reverse' : ''}`}
                                  >
                                    <span>{allergen.icon}</span>
                                    <span>{getTranslatedAllergenName(allergen.code, allergen.name)}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {(product.product || product.orderDetails) && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('branchCategories.productDetails.additionalInformation')}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.product && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        {t('branchCategories.productDetails.originalProduct')}
                      </h5>
                      <div className="space-y-2">
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">{t('branchCategories.productDetails.originalPrice')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">${product.product.price.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">{t('branchCategories.productDetails.originalStatus')}</span>
                          <span className={`font-medium ${product.product.status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {product.product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                          </span>
                        </div>
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">{t('branchCategories.productDetails.originalDisplayOrder')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{product.product.displayOrder}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.orderDetails && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        {t('branchCategories.productDetails.orderDetails')}
                      </h5>
                      <pre className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border">
                        {JSON.stringify(product.orderDetails, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('branchCategories.productDetails.lastUpdated')} {new Date().toLocaleDateString()}
            </div>
            <button
              onClick={onClose}
              className={`px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Check className="h-4 w-4" />
              {t('branchCategories.productDetails.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;