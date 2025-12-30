import React, { useEffect, useState } from 'react';
import {
  Loader2,
  CheckCircle,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { theme } from '../../../../types/BranchManagement/type';
import { MenuProduct } from '../../../../types/menu/type';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { branchProductExtraCategoriesService } from '../../../../services/Branch/Extras/BranchProductExtraCategoriesService';
import { branchProductExtrasService } from '../../../../services/Branch/Extras/BranchProductExtrasService';
import { BranchProductExtraCategory, BranchProductExtra } from '../../../../types/Branch/Extras/type';
import { ProductAddon } from '../../../../services/Branch/Online/OnlineMenuService';
import { SelectedAddon, SelectedExtra } from './OnlineMenu';

interface OnlineMenuProductModalProps {
  product: MenuProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: MenuProduct,
    quantity: number,
    addons: SelectedAddon[],
    extras: SelectedExtra[]
  ) => Promise<void>;
  isAddingToBasket: boolean;
  currency?: string;
}

interface AlertModalState {
  isOpen: boolean;
  message: string;
}

export const OnlineMenuProductModal: React.FC<OnlineMenuProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isAddingToBasket,
  currency = 'TRY',
}) => {
  const { t } = useLanguage();

  // ───── Product Modal States ─────
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);

  // ───── Validation States ─────
  const [categoryConstraints, setCategoryConstraints] = useState<BranchProductExtraCategory[]>([]);
  const [extraConstraints, setExtraConstraints] = useState<BranchProductExtra[]>([]);
  const [alertModal, setAlertModal] = useState<AlertModalState>({
    isOpen: false,
    message: '',
  });

  // ==========================================
  // FETCH CONSTRAINTS FOR VALIDATION
  // ==========================================
  useEffect(() => {
    if (product?.branchProductId) {
      // Fetch category constraints
      branchProductExtraCategoriesService
        .getBranchProductExtraCategories({ branchProductId: product.branchProductId })
        .then(setCategoryConstraints)
        .catch((error) => {
          console.error('Failed to fetch category constraints:', error);
        });

      // Fetch individual extra constraints
      branchProductExtrasService
        .getBranchProductExtrasByBranchProductId(product.branchProductId)
        .then(setExtraConstraints)
        .catch((error) => {
          console.error('Failed to fetch extra constraints:', error);
        });
    }
  }, [product]);

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setProductQuantity(1);
      setSelectedAddons([]);
      setSelectedExtras([]);
    }
  }, [product]);

  // ==========================================
  // VALIDATION FUNCTIONS
  // ==========================================
  const validateExtras = (): { isValid: boolean; message?: string } => {
    // Category-level validation
    for (const category of categoryConstraints) {
      const selectedExtrasInCategory = selectedExtras.filter(
        (e) => e.extraCategoryName === category.extraCategoryName
      );

      const totalQuantity = selectedExtrasInCategory.reduce((sum, e) => sum + e.quantity, 0);

      if (totalQuantity < category.minSelectionCount) {
        return {
          isValid: false,
          message: `${category.extraCategoryName || 'Category'} requires at least ${category.minSelectionCount} selections`,
        };
      }

      if (totalQuantity > category.maxSelectionCount) {
        return {
          isValid: false,
          message: `${category.extraCategoryName || 'Category'} allows maximum ${category.maxSelectionCount} selections`,
        };
      }
    }

    // Individual extra validation - only for non-removal extras
    for (const extra of selectedExtras) {
      if (!extra.isRemoval) {
        const constraint = extraConstraints.find(
          (e) => e.extraId === extra.extraId
        );

        if (constraint) {
          if (extra.quantity < constraint.minQuantity) {
            return {
              isValid: false,
              message: `${extra.extraName} requires at least ${constraint.minQuantity}`,
            };
          }

          if (extra.quantity > constraint.maxQuantity) {
            return {
              isValid: false,
              message: `${extra.extraName} allows maximum ${constraint.maxQuantity}`,
            };
          }
        }
      }
    }

    return { isValid: true };
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAddonToggle = (addon: ProductAddon) => {
    setSelectedAddons((prev) => {
      const idx = prev.findIndex(
        (a) => a.branchProductAddonId === addon.branchProductAddonId
      );
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [
        ...prev,
        {
          addonBranchProductId: addon.branchProductAddonId,
          branchProductAddonId: addon.branchProductAddonId,
          quantity: 1,
          addon,
        },
      ];
    });
  };

  const updateAddonQuantity = (branchProductAddonId: number, delta: number) => {
    setSelectedAddons((prev) =>
      prev.map((a) => {
        if (a.branchProductAddonId !== branchProductAddonId) return a;
        const maxQty = a.addon.maxQuantity || 99;
        const newQty = Math.max(1, Math.min(maxQty, a.quantity + delta));
        return { ...a, quantity: newQty };
      })
    );
  };

  const handleExtraToggle = (extra: any) => {
    if (extra.isRemoval) {
      // Toggle removal extras on/off
      setSelectedExtras((prev) => {
        const idx = prev.findIndex(
          (e) => e.branchProductExtraId === extra.branchProductExtraId
        );
        if (idx >= 0) {
          return prev.filter((_, i) => i !== idx);
        }
        return [
          ...prev,
          {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            extraName: extra.extraName,
            extraCategoryName: extra.categoryName,
            quantity: 1,
            isRemoval: true,
            unitPrice: extra.unitPrice || 0,
            maxQuantity: extra.maxQuantity,
            minQuantity: extra.minQuantity,
            selectionMode: extra.selectionMode,
            isRequired: extra.isRequired,
          },
        ];
      });
    } else {
      // Add quantity extras
      setSelectedExtras((prev) => {
        const idx = prev.findIndex(
          (e) => e.branchProductExtraId === extra.branchProductExtraId
        );
        if (idx >= 0) return prev; // Already selected, do nothing
        return [
          ...prev,
          {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            extraName: extra.extraName,
            extraCategoryName: extra.categoryName,
            quantity: 1,
            isRemoval: false,
            unitPrice: extra.unitPrice || 0,
            maxQuantity: extra.maxQuantity,
            minQuantity: extra.minQuantity,
            selectionMode: extra.selectionMode,
            isRequired: extra.isRequired,
          },
        ];
      });
    }
  };

  const updateExtraQuantity = (branchProductExtraId: number, delta: number) => {
    setSelectedExtras((prev) =>
      prev.map((e) => {
        if (e.branchProductExtraId !== branchProductExtraId) return e;
        if (e.isRemoval) return e;

        const newQty = Math.max(
          e.minQuantity || 1,
          Math.min(e.maxQuantity || 10, e.quantity + delta)
        );
        return { ...e, quantity: newQty };
      })
    );
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = product.price * productQuantity;

    // Add addons price
    selectedAddons.forEach((sa) => {
      const price = sa.addon.specialPrice ?? sa.addon.price;
      total += price * sa.quantity * productQuantity;
    });

    // Add extras price (only non-removal ones)
    selectedExtras.forEach((se) => {
      if (!se.isRemoval) {
        total += se.unitPrice * se.quantity * productQuantity;
      }
    });

    return total;
  };

  const handleAddToBasket = async () => {
    if (!product) return;

    // Validate extras before adding to cart
    const validation = validateExtras();
    if (!validation.isValid) {
      setAlertModal({
        isOpen: true,
        message: validation.message!,
      });
      return;
    }

    try {
      await onAddToCart(product, productQuantity, selectedAddons, selectedExtras);
    } catch (e: any) {
      setAlertModal({
        isOpen: true,
        message: e.message || t('menu.error.addToBasket'),
      });
    }
  };

  const formatPrice = (price: number, curr: string = currency) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: curr }).format(price);

  if (!product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
        <div
          className={`${theme.background.card} w-full sm:max-w-3xl h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. STICKY HEADER */}
          <div className="shrink-0 relative">
            {/* Product Image Background for Header */}
            <div className="h-48 sm:h-56 w-full relative">
              <img
                src={product.productImageUrl}
                alt={product.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold shadow-sm">{product.productName}</h3>
                {product.productDescription && (
                  <p className="text-white/90 text-sm mt-1 line-clamp-2">
                    {product.productDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className="space-y-3">
                <h4 className={`font-bold text-sm uppercase tracking-wider ${theme.text.secondary}`}>
                  {t('menu.ingredients')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((i) => (
                    <span
                      key={i.ingredientId}
                      className="text-sm bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      {i.ingredientName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {product.allergens?.length > 0 && (
              <div className="space-y-3">
                <h4 className={`font-bold text-sm uppercase tracking-wider ${theme.text.secondary}`}>
                  {t('menu.allergens')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((a) => (
                    <span
                      key={a.id}
                      className="text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-800/50 flex items-center gap-1"
                    >
                      {a.icon} {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-slate-100 dark:border-slate-700/50" />

            {/* Extras Section */}
            {product.availableExtras && product.availableExtras.length > 0 && (
              <div className="space-y-6">
                {product.availableExtras.map(
                  (extraCategory) =>
                    extraCategory.extras &&
                    extraCategory.extras.length > 0 && (
                      <div key={extraCategory.categoryId} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className={`font-bold text-lg ${theme.text.primary}`}>
                            {extraCategory.categoryName}
                          </h5>
                          {extraCategory.isRequired && (
                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                              {t('menu.required') || 'Required'}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {extraCategory.extras.map((extra) => {
                            const isSelected = selectedExtras.some(
                              (s) => s.branchProductExtraId === extra.branchProductExtraId
                            );
                            const selectedExtra = selectedExtras.find(
                              (s) => s.branchProductExtraId === extra.branchProductExtraId
                            );

                            return (
                              <div
                                key={extra.branchProductExtraId}
                                onClick={() =>
                                  handleExtraToggle({
                                    ...extra,
                                    categoryName: extraCategory.categoryName,
                                  })
                                }
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                  extra.isRemoval
                                    ? isSelected
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                                    : isSelected
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm ring-1 ring-emerald-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {/* Selection Indicator */}
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                        isSelected
                                          ? extra.isRemoval
                                            ? 'bg-red-500 border-red-500'
                                            : 'bg-emerald-500 border-emerald-500'
                                          : 'border-slate-300 dark:border-slate-500'
                                      }`}
                                    >
                                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>

                                    <span className={`font-medium ${theme.text.primary}`}>
                                      {extra.extraName}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {!extra.isRemoval && extra.unitPrice && extra.unitPrice > 0 && (
                                      <span className={`font-medium ${theme.text.primary}`}>
                                        +{formatPrice(extra.unitPrice || 0, currency)}
                                      </span>
                                    )}
                                    {extra.isRemoval && (
                                      <span className="text-xs font-bold text-red-500 uppercase">
                                        {t('menu.remove') || 'Remove'}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Quantity Controls inside card */}
                                {isSelected && !extra.isRemoval && (
                                  <div
                                    className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                                      <button
                                        onClick={() => updateExtraQuantity(extra.branchProductExtraId, -1)}
                                        disabled={selectedExtra?.quantity === (extra.minQuantity || 1)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="font-bold w-6 text-center text-sm">
                                        {selectedExtra?.quantity || 1}
                                      </span>
                                      <button
                                        onClick={() => updateExtraQuantity(extra.branchProductExtraId, 1)}
                                        disabled={
                                          selectedExtra && selectedExtra.quantity >= (extra.maxQuantity || 10)
                                        }
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Addons Section */}
            {product.availableAddons && product.availableAddons.length > 0 && (
              <div className="space-y-4">
                <h4 className={`font-bold text-lg ${theme.text.primary}`}>{t('menu.addons')}</h4>
                <div className="grid grid-cols-1 gap-3">
                  {product.availableAddons.map((addon) => {
                    const isSelected = selectedAddons.some(
                      (a) => a.branchProductAddonId === addon.branchProductAddonId
                    );
                    const currentAddon = selectedAddons.find(
                      (a) => a.branchProductAddonId === addon.branchProductAddonId
                    );

                    return (
                      <div
                        key={addon.branchProductAddonId}
                        onClick={() => handleAddonToggle(addon)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm ring-1 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-500'
                              }`}
                            >
                              {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`font-medium ${theme.text.primary}`}>
                              {addon.addonProductName}
                            </span>
                          </div>
                          <span className="font-medium text-emerald-600">
                            +{formatPrice(addon.specialPrice ?? addon.price, currency)}
                          </span>
                        </div>

                        {/* Addon Quantity */}
                        {isSelected && currentAddon && (
                          <div
                            className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => updateAddonQuantity(addon.branchProductAddonId, -1)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold w-6 text-center text-sm">
                                {currentAddon.quantity}
                              </span>
                              <button
                                onClick={() => updateAddonQuantity(addon.branchProductAddonId, 1)}
                                disabled={currentAddon.quantity >= (addon.maxQuantity || 99)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-600 dark:text-slate-300"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
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

          {/* 3. STICKY FOOTER */}
          <div
            className={`shrink-0 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 ${theme.background.card} z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}
          >
            <div className="flex flex-col gap-4">
              {/* Main Quantity Selector (Centered) */}
              <div className="flex items-center justify-center gap-6 mb-2">
                <button
                  onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-3xl font-bold min-w-[3rem] text-center">{productQuantity}</span>
                <button
                  onClick={() => setProductQuantity(productQuantity + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              <button
                onClick={handleAddToBasket}
                disabled={isAddingToBasket}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex-1 text-left">
                  {isAddingToBasket ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('menu.adding')}
                    </span>
                  ) : (
                    t('menu.addToOrder')
                  )}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                  {formatPrice(calculateTotalPrice(), currency)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">
              {t('menu.validationError') || 'Validation Error'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{alertModal.message}</p>
            <button
              onClick={() => setAlertModal({ isOpen: false, message: '' })}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {t('menu.ok') || 'OK'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
