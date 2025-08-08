import { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Category } from "../../../types/dashboard";
import { productService } from "../../../services/productService";
import { logger } from "../../../utils/logger";
import { X } from "lucide-react";

// EditCategoryModal Component
export const EditCategoryModal: React.FC<{
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