"use client"

import React from "react"
import { useState, useMemo, useEffect } from "react"
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Utensils, 
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Layers,
  Check
} from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { ProductModalProps, SelectedAddon, ExtraCategory } from "../../../../types/menu/type"
import { Allergen } from "../../../../services/allergen"
import { ProductExtraMenu } from "../../../../types/Extras/type"

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart
}) => {
  const { t } = useLanguage()
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([])
  const [selectedExtras, setSelectedExtras] = useState<Map<number, number>>(new Map())
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [errors, setErrors] = useState<Map<number, string>>(new Map())
  const [quantity, setQuantity] = useState(1)
  
  // Initialize expanded categories when product changes
  useEffect(() => {
    if (product?.availableExtras) {
      const requiredCategories = product.availableExtras
        .filter(cat => cat?.isRequired)
        .map(cat => cat.categoryId)
      setExpandedCategories(new Set(requiredCategories))
    }
    // Reset state when product changes
    setSelectedAddons([])
    setSelectedExtras(new Map())
    setErrors(new Map())
    setQuantity(1)
  }, [product])

  // Calculate total price
  const getTotalPrice = useMemo(() => {
    if (!product) return 0
    
    let total = (product.price || 0) * quantity
    
    // Add addons price
    const addonsPrice = selectedAddons.reduce((sum, addon) => 
      sum + ((addon.price || 0) * (addon.quantity || 0)), 0
    ) * quantity
    
    // Add extras price
    if (product.availableExtras && Array.isArray(product.availableExtras)) {
      selectedExtras.forEach((qty, extraId) => {
        const extra = product.availableExtras
          ?.flatMap(cat => cat?.extras || [])
          .find(e => e && e.branchProductExtraId === extraId)
        if (extra && !extra.isRemoval) {
          total += ((extra.finalPrice || extra.unitPrice || 0) * qty * quantity)
        }
      })
    }
    
    return total + addonsPrice
  }, [product, selectedAddons, selectedExtras, quantity])

  const hasExtras = product?.availableExtras && Array.isArray(product.availableExtras) && product.availableExtras.length > 0
  
  const getTranslatedAllergen = (allergen: Allergen) => {
    try {
      const nameKey = `allergens.${allergen.code}.name`;
      const descKey = `allergens.${allergen.code}.description`;
      
      const translatedName = t(nameKey);
      const translatedDesc = t(descKey);
      
      return {
        name: translatedName === nameKey ? allergen.name : translatedName,
        description: translatedDesc === descKey ? allergen.description : translatedDesc
      };
    } catch (error) {
      return {
        name: allergen.name || '',
        description: allergen.description || ''
      };
    }
  };

  // Addons Management
  const handleAddonChange = (addon: any, newQuantity: number) => {
    if (!addon) return
    
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.branchProductAddonId === addon.branchProductAddonId)
      
      if (newQuantity === 0) {
        return prev.filter(a => a.branchProductAddonId !== addon.branchProductAddonId)
      }
      
      const constrainedQuantity = Math.max(
        addon.minQuantity || 0, 
        Math.min(addon.maxQuantity || 999, newQuantity)
      )
      
      if (existingIndex >= 0) {
        return prev.map((a, index) => 
          index === existingIndex 
            ? { ...a, quantity: constrainedQuantity }
            : a
        )
      } else {
        return [...prev, {
          branchProductAddonId: addon.branchProductAddonId,
          addonName: addon.addonName || '',
          price: addon.price || 0,
          quantity: constrainedQuantity
        }]
      }
    })
  }

  const handleAddAddon = (addon: any) => {
    if (!addon) return
    const initialQuantity = Math.max(1, addon.minQuantity || 1)
    handleAddonChange(addon, initialQuantity)
  }

  const handleDecreaseAddon = (addon: any, currentQuantity: number) => {
    if (!addon) return
    const minQty = addon.minQuantity || 1
    const newQuantity = currentQuantity - 1
    
    if (newQuantity < minQty) {
      handleAddonChange(addon, 0)
    } else {
      handleAddonChange(addon, newQuantity)
    }
  }

  const handleIncreaseAddon = (addon: any, currentQuantity: number) => {
    if (!addon) return
    const maxQty = addon.maxQuantity || 999
    const newQuantity = Math.min(maxQty, currentQuantity + 1)
    handleAddonChange(addon, newQuantity)
  }

  const getAddonQuantity = (addonId: number): number => {
    const addon = selectedAddons.find(a => a.branchProductAddonId === addonId)
    return addon?.quantity || 0
  }

  // Extras Management
  const handleExtraQuantityChange = (branchProductExtraId: number, change: number, extra: ProductExtraMenu) => {
    if (!extra) return
    
    const currentQty = selectedExtras.get(branchProductExtraId) || 0
    const maxQty = extra.maxQuantity || 10
    const minQty = extra.minQuantity || 0
    
    let newQty = currentQty + change
    
    // For removal extras, allow 0 or 1 only
    if (extra.isRemoval) {
      newQty = newQty > 0 ? 1 : 0
    } else {
      newQty = Math.max(minQty, Math.min(newQty, maxQty))
    }
    
    const newMap = new Map(selectedExtras)
    if (newQty === 0) {
      newMap.delete(branchProductExtraId)
    } else {
      newMap.set(branchProductExtraId, newQty)
    }
    setSelectedExtras(newMap)
  }

  // Validation
  const validateExtras = (): boolean => {
    if (!product || !hasExtras || !product.availableExtras) return true
    
    const newErrors = new Map<number, string>()

    product.availableExtras.forEach(category => {
      if (!category || !Array.isArray(category.extras)) return
      
      const categoryExtras = category.extras.filter(extra => 
        extra && selectedExtras.has(extra.branchProductExtraId)
      )
      
      const selectedCount = categoryExtras.length
      const totalQuantity = categoryExtras.reduce((sum, extra) => 
        sum + (selectedExtras.get(extra.branchProductExtraId) || 0), 0
      )

      // Check required category
      if (category.isRequired && selectedCount === 0) {
        newErrors.set(category.categoryId, t('productModal.categoryRequired', { name: category.categoryName }))
      }

      // Check min selection count
      if (category.minSelectionCount > 0 && selectedCount < category.minSelectionCount) {
        const availableCount = category.extras.length
        if (availableCount < category.minSelectionCount) {
          // Impossible to satisfy - need more extras in this category
          newErrors.set(
            category.categoryId,
            `${category.categoryName}: Cannot satisfy requirement (requires ${category.minSelectionCount} selections but only ${availableCount} available)`
          )
        } else {
          newErrors.set(
            category.categoryId,
            t('productModal.minSelectionError', { 
              min: category.minSelectionCount, 
              name: category.categoryName 
            })
          )
        }
      }

      // Check max selection count
      if (category.maxSelectionCount > 0 && selectedCount > category.maxSelectionCount) {
        newErrors.set(
          category.categoryId,
          t('productModal.maxSelectionError', { 
            max: category.maxSelectionCount, 
            name: category.categoryName 
          })
        )
      }

      // Check min total quantity
      if (category.minTotalQuantity > 0 && totalQuantity < category.minTotalQuantity) {
        newErrors.set(
          category.categoryId,
          `${category.categoryName}: Need at least ${category.minTotalQuantity} total items (currently ${totalQuantity})`
        )
      }

      // Check max total quantity
      if (category.maxTotalQuantity > 0 && totalQuantity > category.maxTotalQuantity) {
        newErrors.set(
          category.categoryId,
          `${category.categoryName}: Maximum ${category.maxTotalQuantity} total items allowed (currently ${totalQuantity})`
        )
      }

      // Check individual extra requirements
      category.extras.forEach(extra => {
        if (extra && extra.isRequired && !selectedExtras.has(extra.branchProductExtraId)) {
          newErrors.set(
            category.categoryId,
            t('productModal.extraRequired', { name: extra.extraName || '' })
          )
        }
      })
    })

    setErrors(newErrors)
    return newErrors.size === 0
  }

  // Get category validation status
  const getCategoryStatus = (category: ExtraCategory): 'valid' | 'invalid' | 'partial' => {
    if (!category || !Array.isArray(category.extras)) return 'partial'
    
    const categoryExtras = category.extras.filter(extra => 
      extra && selectedExtras.has(extra.branchProductExtraId)
    )
    const selectedCount = categoryExtras.length
    const totalQuantity = categoryExtras.reduce((sum, extra) => 
      sum + (selectedExtras.get(extra.branchProductExtraId) || 0), 0
    )

    if (errors.has(category.categoryId)) return 'invalid'
    
    if (category.isRequired && selectedCount === 0) return 'invalid'
    
    if (category.minSelectionCount > 0 && selectedCount < category.minSelectionCount) return 'invalid'
    if (category.minTotalQuantity > 0 && totalQuantity < category.minTotalQuantity) return 'invalid'
    
    if (selectedCount > 0) return 'valid'
    
    return 'partial'
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    const newSet = new Set(expandedCategories)
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId)
    } else {
      newSet.add(categoryId)
    }
    setExpandedCategories(newSet)
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return
    
    if (!validateExtras()) {
      return
    }

    const extras: ProductExtraMenu[] = []
    
    if (product.availableExtras && Array.isArray(product.availableExtras)) {
      selectedExtras.forEach((qty, extraId) => {
        const extra = product.availableExtras
          ?.flatMap(cat => cat?.extras || [])
          .find(e => e && e.branchProductExtraId === extraId)
        if (extra) {
          extras.push({
            branchProductExtraId: extra.branchProductExtraId,
            productExtraId: extra.productExtraId,
            extraId: extra.extraId,
            extraName: extra.extraName || '',
            categoryName: extra.categoryName || '',
            selectionMode: extra.selectionMode || 0,
            unitPrice: extra.unitPrice || 0,
            finalPrice: extra.finalPrice || 0,
            isRequired: extra.isRequired || false,
            quantity: qty,
            isRemoval: extra.isRemoval || false,
            displayOrder: extra.displayOrder || 0
          })
        }
      })
    }

    console.log('Selected extras:', extras)
    console.log('Selected addons:', selectedAddons)

    onAddToCart(product, selectedAddons, extras)
    
    // Reset state
    setSelectedAddons([])
    setSelectedExtras(new Map())
    setErrors(new Map())
    setQuantity(1)
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 dark:border-slate-700/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 p-6 border-b border-slate-200/50 dark:border-slate-700/50 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{t('productModal.customizeOrder')}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="flex space-x-4 mb-6 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
            {product.productImageUrl && (
              <img
                src={product.productImageUrl}
                alt={product.productName || ''}
                className="w-20 h-20 object-cover ml-2 rounded-lg shadow-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {product.productName || ''}
                  </h3>
                  {product.productDescription && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      {product.productDescription}
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                      ${(product.price || 0).toFixed(2)}
                    </span>
                    {product.isRecommended && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center">
                        <Award className="h-2 w-2 mr-1" />
                        {t('productModal.recommended')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Allergens */}
          {product.allergens && Array.isArray(product.allergens) && product.allergens.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('productModal.allergenInformation')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen: Allergen) => {
                  if (!allergen) return null
                  const translatedAllergen = getTranslatedAllergen(allergen);
                  return (
                    <span
                      key={allergen.id}
                      className="inline-flex items-center text-xs bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/50 cursor-help"
                      title={`${translatedAllergen.name} - ${translatedAllergen.description}`}
                    >
                      <span className="mr-1">{allergen.icon}</span>
                      {translatedAllergen.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <Utensils className="h-3 w-3 mr-1 text-orange-500" />
                {t('productModal.ingredients')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => {
                  if (!ingredient) return null
                  return (
                    <span
                      key={ingredient.ingredientId}
                      className="text-xs bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full"
                    >
                      {ingredient.ingredientName || ''}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Available Addons */}
          {product.availableAddons && Array.isArray(product.availableAddons) && product.availableAddons.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                {t('productModal.availableAddons')}
              </h4>
              <div className="space-y-3">
                {product.availableAddons.map((addon) => {
                  if (!addon) return null
                  const addonQuantity = getAddonQuantity(addon.branchProductAddonId)
                  const minQty = addon.minQuantity || 1
                  const maxQty = addon.maxQuantity || 999
                  
                  return (
                    <div
                      key={addon.branchProductAddonId}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <div className="flex space-x-3 flex-1">
                        {addon.addonImageUrl && (
                          <img
                            src={addon.addonImageUrl}
                            alt={addon.addonName || ''}
                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                {addon.addonName || ''}
                              </h5>
                              {addon.addonDescription && (
                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                                  {addon.addonDescription}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm font-bold text-orange-600">
                                  +${(addon.price || 0).toFixed(2)}
                                </span>
                                {addon.isRecommended && (
                                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-1.5 py-0.5 rounded-full">
                                    {t('productModal.recommended')}
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity constraints info */}
                              <div className="flex items-center space-x-2 mt-1">
                                {addon.minQuantity > 1 && (
                                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                                    {t('productModal.min')}: {addon.minQuantity}
                                  </span>
                                )}
                                {addon.maxQuantity && addon.maxQuantity < 999 && (
                                  <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                                    {t('productModal.max')}: {addon.maxQuantity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Addon Allergens */}
                          {addon.allergens && Array.isArray(addon.allergens) && addon.allergens.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {addon.allergens.slice(0, 3).map((allergen: Allergen) => {
                                  if (!allergen) return null
                                  const translatedAllergen = getTranslatedAllergen(allergen);
                                  return (
                                    <span
                                      key={allergen.id}
                                      className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full cursor-help inline-flex items-center"
                                      title={`${translatedAllergen.name} - ${translatedAllergen.description}`}
                                    >
                                      <span className="mr-0.5">{allergen.icon}</span>
                                      {translatedAllergen.name}
                                    </span>
                                  );
                                })}
                                {addon.allergens.length > 3 && (
                                  <span 
                                    className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full cursor-help"
                                    title={addon.allergens.slice(3).map((a: Allergen) => a ? getTranslatedAllergen(a).name : '').join(', ')}
                                  >
                                    +{addon.allergens.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Addon Quantity Controls */}
                      <div className="flex items-center space-x-2 ml-4">
                        {addonQuantity > 0 ? (
                          <div className="flex items-center space-x-2 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                            <button
                              onClick={() => handleDecreaseAddon(addon, addonQuantity)}
                              className={`w-7 h-7 ${
                                addonQuantity <= minQty 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-red-500 hover:bg-red-600'
                              } text-white rounded-md flex items-center justify-center transition-colors`}
                              disabled={addonQuantity <= minQty}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                              {addonQuantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseAddon(addon, addonQuantity)}
                              className={`w-7 h-7 ${
                                addonQuantity >= maxQty 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-orange-500 hover:bg-orange-600'
                              } text-white rounded-md flex items-center justify-center transition-colors`}
                              disabled={addonQuantity >= maxQty}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddAddon(addon)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>
                              {t('productModal.add')} {addon.minQuantity > 1 ? `(${addon.minQuantity})` : ''}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Extras Section */}
          {hasExtras && product.availableExtras && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-blue-500" />
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {t('productModal.extras')}
                </h4>
              </div>

              <div className="space-y-3">
                {product.availableExtras.map((category) => {
                  if (!category) return null
                  
                  const isExpanded = expandedCategories.has(category.categoryId)
                  const status = getCategoryStatus(category)
                  const error = errors.get(category.categoryId)
                  
                  const categoryExtras = (category.extras || []).filter(extra => 
                    extra && selectedExtras.has(extra.branchProductExtraId)
                  )
                  const selectedCount = categoryExtras.length
                  const totalQuantity = categoryExtras.reduce((sum, extra) => 
                    sum + (selectedExtras.get(extra.branchProductExtraId) || 0), 0
                  )

                  return (
                    <div
                      key={category.categoryId}
                      className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                        status === 'valid'
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                          : status === 'invalid'
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                      }`}
                    >
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.categoryId)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status === 'valid'
                              ? 'bg-green-500'
                              : status === 'invalid'
                              ? 'bg-red-500'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}>
                            {status === 'valid' ? (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : status === 'invalid' ? (
                              <AlertCircle className="h-5 w-5 text-white" />
                            ) : (
                              <Info className="h-5 w-5 text-white" />
                            )}
                          </div>
                          
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                                {category.categoryName || ''}
                              </h5>
                              {category.isRequired && (
                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                                  {t('productModal.required')}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-1">
                              {selectedCount > 0 && (
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {selectedCount} {t('productModal.selected')}
                                </span>
                              )}
                              
                              {(category.minSelectionCount > 0 || category.maxSelectionCount > 0) && (
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {category.minSelectionCount > 0 && category.maxSelectionCount > 0
                                    ? `${t('productModal.select')} ${category.minSelectionCount}-${category.maxSelectionCount}`
                                    : category.minSelectionCount > 0
                                    ? `${t('productModal.minSelect')} ${category.minSelectionCount}`
                                    : `${t('productModal.maxSelect')} ${category.maxSelectionCount}`
                                  }
                                </span>
                              )}
                              
                              {(category.minTotalQuantity > 0 || category.maxTotalQuantity > 0) && (
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  ({t('productModal.qty')}: {totalQuantity}
                                  {category.minTotalQuantity > 0 && `/${category.minTotalQuantity}`}
                                  {category.maxTotalQuantity > 0 && category.minTotalQuantity === 0 && `/${category.maxTotalQuantity}`}
                                  {category.maxTotalQuantity > 0 && category.minTotalQuantity > 0 && `-${category.maxTotalQuantity}`})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Error Message */}
                      {error && (
                        <div className="px-4 pb-2">
                          <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                          </div>
                        </div>
                      )}

                      {/* Category Extras */}
                      {isExpanded && category.extras && Array.isArray(category.extras) && (
                        <div className="p-4 pt-0 space-y-3">
                          {category.extras
                            .filter(extra => extra !== null && extra !== undefined)
                            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map((extra) => {
                              const qty = selectedExtras.get(extra.branchProductExtraId) || 0
                              const price = extra.finalPrice || extra.unitPrice || 0
                              const isSelected = qty > 0

                              return (
                                <div
                                  key={extra.branchProductExtraId}
                                  className={`p-3 rounded-lg border transition-all duration-300 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h6 className="font-semibold text-slate-900 dark:text-white text-sm">
                                          {extra.extraName || ''}
                                        </h6>
                                        {extra.isRequired && (
                                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-full font-bold">
                                            *
                                          </span>
                                        )}
                                        {extra.isRemoval && (
                                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-full font-bold">
                                            {t('productModal.removal')}
                                          </span>
                                        )}
                                      </div>
                                      
                                      {!extra.isRemoval && (
                                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                          +${price.toFixed(2)}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Extra Controls */}
                                    <div className="flex items-center gap-2 ml-4">
                                      {extra.isRemoval ? (
                                        <button
                                          onClick={() => handleExtraQuantityChange(
                                            extra.branchProductExtraId,
                                            isSelected ? -1 : 1,
                                            extra
                                          )}
                                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                                            isSelected
                                              ? 'bg-blue-500 text-white'
                                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                          }`}
                                        >
                                          {isSelected && <Check className="h-3 w-3" />}
                                          {isSelected ? t('productModal.removed') : t('productModal.remove')}
                                        </button>
                                      ) : (
                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                                          <button
                                            onClick={() => handleExtraQuantityChange(extra.branchProductExtraId, -1, extra)}
                                            disabled={qty === 0}
                                            className="w-7 h-7 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md flex items-center justify-center transition-colors"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                                            {qty}
                                          </span>
                                          <button
                                            onClick={() => handleExtraQuantityChange(extra.branchProductExtraId, 1, extra)}
                                            disabled={qty >= (extra.maxQuantity || 10)}
                                            className="w-7 h-7 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md flex items-center justify-center transition-colors"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {!extra.isRemoval && ((extra.minQuantity ?? 0) > 0 || (extra.maxQuantity ?? 0) > 0) && (
                                    <div className="mt-1 flex items-center gap-2">
                                      {(extra.minQuantity ?? 0) > 0 && (
                                        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                                          {t('productModal.min')}: {extra.minQuantity ?? 0}
                                        </span>
                                      )}
                                      {(extra.maxQuantity ?? 0) > 0 && (
                                        <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                                          {t('productModal.max')}: {extra.maxQuantity ?? 0}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl mb-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
                {t('productModal.orderSummary')}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{product.productName || ''} × {quantity}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    ${((product.price || 0) * quantity).toFixed(2)}
                  </span>
                </div>
                
                {selectedAddons.map((addon) => (
                  <div key={addon.branchProductAddonId} className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      {addon.addonName} × {addon.quantity * quantity}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      +${((addon.price || 0) * addon.quantity * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                {Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
                  const extra = product.availableExtras
                    ?.flatMap(cat => cat?.extras || [])
                    .find(e => e && e.branchProductExtraId === extraId)
                  if (!extra || extra.isRemoval) return null
                  return (
                    <div key={extraId} className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        {extra.extraName || ''} × {qty * quantity}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        +${(((extra.finalPrice || extra.unitPrice || 0) * qty * quantity)).toFixed(2)}
                      </span>
                    </div>
                  )
                })}
                
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {t('productModal.total')}
                    </span>
                    <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                      ${getTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold ml-2 text-slate-700 dark:text-slate-300">
                  {t('productModal.quantity')}:
                </span>
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800 dark:text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{t('productModal.addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal