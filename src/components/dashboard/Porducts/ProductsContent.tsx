import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, ArrowUp, List, Grid3X3, Edit2, Trash2,
  GripVertical,  EyeOff, Package, Utensils, X, Sparkles
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Category, Product } from '../../../types/dashboard';
import { productService } from '../../../services/productService';
import { logger } from '../../../utils/logger';
import CreateCategoryModal from './CreateCategoryModal';
import CreateProductModal from './CreateProductModal';

// Add custom styles for line clamping
const customStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

// ConfirmDeleteModal Component
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  isSubmitting?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, isSubmitting = false }) => {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      logger.error('Silme hatası:', err);
      setError('Silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              {t('İptal')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('Siliniyor...') : t('Sil')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// EditCategoryModal Component
const EditCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category;
}> = ({ isOpen, onClose, onSuccess, category }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    categoryName: category.categoryName,
    description: category.description || '',
    status: category.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.updateCategory(category.categoryId, {
        categoryName: formData.categoryName,
        description: formData.description,
        status: formData.status
      });
      logger.info('Kategori başarıyla güncellendi', { categoryId: category.categoryId });
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Kategori güncelleme hatası:', err);
      setError('Kategori güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Kategori Düzenle')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Kategori Adı')} *
              </label>
              <input
                title="categoryName"
                type="text"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Açıklama')}
              </label>
              <textarea
                title="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>

            <div className="flex items-center">
              <input
                title="status"
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('Aktif')}
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              >
                {t('İptal')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('Kaydediliyor...') : t('Kaydet')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// EditProductModal Component
const EditProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
  categories: Category[];
}> = ({ isOpen, onClose, onSuccess, product, categories }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price,
    categoryId: product.categoryId,
    isAvailable: product.isAvailable,
    imageUrl: product.imageUrl || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
        imageUrl: formData.imageUrl
      });
      logger.info('Ürün başarıyla güncellendi', { productId: product.id });
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Ürün güncelleme hatası:', err);
      setError('Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Ürün Düzenle')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Ürün Adı')} *
              </label>
              <input
                title="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Açıklama')}
              </label>
              <textarea
                title="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Fiyat (₺)')} *
              </label>
              <input
                title="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Kategori')} *
              </label>
              <select
                title="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Resim URL')}
              </label>
              <input
                title="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                title="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('Stokta Var')}
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              >
                {t('İptal')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('Kaydediliyor...') : t('Kaydet')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// SortableProduct Component
const SortableProduct: React.FC<{
  product: Product;
  isDark: boolean;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
}> = ({ product, isDark, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const hasValidImage = product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '' && !imageError;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-gray-600"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing mt-1"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h4>
                {!product.isAvailable && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 flex-shrink-0">
                    <EyeOff className="h-3 w-3 mr-1" />
                    {t('Stokta Yok')}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} ₺
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    title={t('Ürünü düzenle')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title={t('Ürünü sil')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SortableCategory Component
const SortableCategory: React.FC<{
  category: Category;
  isDark: boolean;
  onToggle: (categoryId: number) => void;
  onEditProduct: (productId: number) => void;
  onDeleteProduct: (productId: number) => void;
  onEditCategory: (categoryId: number) => void;
  onDeleteCategory: (categoryId: number) => void;
  activeId: number | null;
  allCategories: Category[];
}> = ({ category, isDark, onToggle, onEditProduct, onDeleteProduct, onEditCategory, onDeleteCategory, activeId, allCategories }) => {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.categoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.categoryName}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category.products.length} {t('ürün')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                title={t('Kategoriyi düzenle')}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title={t('Kategoriyi sil')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => onToggle(category.categoryId)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {category.isExpanded ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {category.isExpanded && (
        <div className="p-4">
          <SortableContext items={category.products.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {category.products.map((product) => (
                <SortableProduct
                  key={product.id}
                  product={product}
                  isDark={isDark}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                />
              ))}
              {category.products.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('Bu kategoride henüz ürün yok.')}</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
};

// Main ProductsContent Component
const ProductsContent: React.FC = () => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'product' | 'category';
    id: number;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [selectedCategoryForProduct, setSelectedCategoryForProduct] = useState<string>('');
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await productService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      logger.error('Kategori verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setCategories(categories.map(cat =>
      cat.categoryId === categoryId
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const handleDeleteProduct = (productId: number) => {
    const product = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === productId);

    if (!product) {
      logger.error('Silinecek ürün bulunamadı:', { productId });
      return;
    }

    setDeleteConfig({
      type: 'product',
      id: productId,
      title: t('Ürünü Sil'),
      message: t(`"${product.name}" adlı ürünü silmek istediğinizden emin misiniz?`),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await productService.deleteProduct(productId);
          setCategories(categories.map(cat => ({
            ...cat,
            products: cat.products.filter(product => product.id !== productId)
          })));
          logger.info('Ürün başarıyla silindi', { productId });
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditProduct = (productId: number) => {
    const productToEdit = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === productId);
    
    if (productToEdit) {
      setSelectedProductForEdit(productToEdit);
      setIsEditProductModalOpen(true);
    } else {
      logger.error('Düzenlenecek ürün bulunamadı:', { productId });
      alert(t('Ürün bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.'));
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    
    if (!category) {
      alert(t('Kategori bulunamadı.'));
      return;
    }

    setDeleteConfig({
      type: 'category',
      id: categoryId,
      title: t('Kategoriyi Sil'),
      message: category.products.length > 0
        ? t(`"${category.categoryName}" kategorisinde ${category.products.length} ürün bulunuyor. Bu kategoriyi silmek tüm ürünleri de silecektir. Devam etmek istediğinizden emin misiniz?`)
        : t(`"${category.categoryName}" kategorisini silmek istediğinizden emin misiniz?`),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await productService.deleteCategory(categoryId);
          setCategories(categories.filter(cat => cat.categoryId !== categoryId));
          logger.info('Kategori başarıyla silindi', { categoryId });
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(cat => cat.categoryId === categoryId);
    
    if (categoryToEdit) {
      setSelectedCategoryForEdit(categoryToEdit);
      setIsEditCategoryModalOpen(true);
    } else {
      logger.error('Düzenlenecek kategori bulunamadı:', { categoryId });
      alert(t('Kategori bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.'));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId === overId) return;

    const activeProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === activeId);

    if (activeProduct) {
      const overCategory = categories.find(cat => cat.categoryId === overId);
      const overProduct = categories
        .flatMap(cat => cat.products)
        .find(product => product.id === overId);

      if (overCategory) {
        setCategories(prev => {
          const newCategories = [...prev];
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overId };
            targetCategory.products.push(updatedProduct);
          }

          return newCategories;
        });
      } else if (overProduct && activeProduct.categoryId !== overProduct.categoryId) {
        setCategories(prev => {
          const newCategories = [...prev];
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overProduct.categoryId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overProduct.categoryId };
            const overIndex = targetCategory.products.findIndex(product => product.id === overId);
            targetCategory.products.splice(overIndex, 0, updatedProduct);
          }

          return newCategories;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId === overId) return;

    const activeCategory = categories.find(cat => cat.categoryId === activeId);
    const overCategory = categories.find(cat => cat.categoryId === overId);

    if (activeCategory && overCategory) {
      setCategories(prev => {
        const oldIndex = prev.findIndex(cat => cat.categoryId === activeId);
        const newIndex = prev.findIndex(cat => cat.categoryId === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    const activeProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === activeId);
    const overProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === overId);

    if (activeProduct && overProduct && activeProduct.categoryId === overProduct.categoryId) {
      setCategories(prev => {
        const newCategories = [...prev];
        const category = newCategories.find(cat => cat.categoryId === activeProduct.categoryId);

        if (category) {
          const oldIndex = category.products.findIndex(product => product.id === activeId);
          const newIndex = category.products.findIndex(product => product.id === overId);
          category.products = arrayMove(category.products, oldIndex, newIndex);
        }

        return newCategories;
      });
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    products: category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.products.length > 0 || searchQuery === '');

  if (loading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
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

  if (categories.length === 0) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Menü öğelerini ara...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>{t('İlk Kategori Ekle')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Utensils className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t('Henüz menü kategoriniz bulunmuyor')}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {t('Restoranınızın menüsünü oluşturmaya başlamak için ilk kategoriyi ekleyin. Örneğin "Ana Yemekler", "İçecekler" veya "Tatlılar" gibi.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsCreateCategoryModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              {t('İlk Kategoriyi Ekle')}
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
              <Package className="h-5 w-5" />
              {t('Örnek Menü İçe Aktar')}
            </button>
          </div>
        </div>

        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={loadCategories}
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Menü öğelerini ara...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Filtrele')}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Sırala')}</span>
              </button>

              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Yeni Kategori')}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedCategoryForProduct(''); 
                  setIsCreateProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>{t('Yeni Ürün')}</span>
              </button>
            </div>
          </div>
        </div>

        <SortableContext items={filteredCategories.map(cat => cat.categoryId)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <SortableCategory
                key={category.categoryId}
                category={category}
                isDark={isDark}
                onToggle={toggleCategory}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                activeId={activeId}
                allCategories={categories}
              />
            ))}

            {filteredCategories.length === 0 && searchQuery && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('Arama sonucu bulunamadı')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('"{0}" araması için ürün bulunamadı. Farklı bir arama terimi deneyin.')}
                </p>
              </div>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            (() => {
              const activeCategory = categories.find(cat => cat.categoryId === activeId);
              const activeProduct = categories
                .flatMap(cat => cat.products)
                .find(product => product.id === activeId);

              if (activeCategory) {
                return (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 rotate-3 scale-105">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{activeCategory.categoryName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activeCategory.description}</p>
                  </div>
                );
              } else if (activeProduct) {
                const hasValidImage = activeProduct.imageUrl && activeProduct.imageUrl !== 'string' && activeProduct.imageUrl.trim() !== '';
                return (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600 rotate-3 scale-105">
                    <div className="flex items-start gap-3">
                      {hasValidImage ? (
                        <img
                          src={activeProduct.imageUrl}
                          alt={activeProduct.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-600 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">{activeProduct.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{activeProduct.description}</p>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeProduct.price.toFixed(2)} ₺</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()
          ) : null}
        </DragOverlay>
      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={loadCategories}
      />
      
      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => {
          setIsCreateProductModalOpen(false);
          setSelectedCategoryForProduct('');
        }}
        onSuccess={loadCategories}
        categories={categories}
      />

      {isEditCategoryModalOpen && selectedCategoryForEdit && (
        <EditCategoryModal
          isOpen={isEditCategoryModalOpen}
          onClose={() => {
            setIsEditCategoryModalOpen(false);
            setSelectedCategoryForEdit(null);
          }}
          onSuccess={loadCategories}
          category={selectedCategoryForEdit}
        />
      )}

      {isEditProductModalOpen && selectedProductForEdit && (
        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setSelectedProductForEdit(null);
          }}
          onSuccess={loadCategories}
          product={selectedProductForEdit}
          categories={categories}
        />
      )}

      {isConfirmDeleteModalOpen && deleteConfig && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={() => {
            setIsConfirmDeleteModalOpen(false);
            setDeleteConfig(null);
          }}
          onConfirm={deleteConfig.onConfirm}
          title={deleteConfig.title}
          message={deleteConfig.message}
          isSubmitting={isDeleting}
        />
      )}
    </DndContext>
  );
};

export default ProductsContent;