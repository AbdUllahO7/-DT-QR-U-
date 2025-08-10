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
  const { t, isRTL } = useLanguage();
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
      setError(t('editCategoryModal.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('editCategoryModal.title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('editCategoryModal.accessibility.closeModal')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Category Name Field */}
            <div>
              <label 
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t('editCategoryModal.form.categoryName.label')} *
              </label>
              <input
                id="categoryName"
                name="categoryName"
                type="text"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                placeholder={t('editCategoryModal.form.categoryName.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                aria-describedby="categoryName-error"
              />
            </div>

            {/* Description Field */}
            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t('editCategoryModal.form.description.label')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('editCategoryModal.form.description.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={4}
              />
            </div>

            {/* Status Checkbox */}
            <div className="flex items-center">
              <input
                id="status"
                name="status"
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                aria-describedby="status-description"
              />
              <label 
                htmlFor="status"
                className={`text-sm text-gray-700 dark:text-gray-300 cursor-pointer ${isRTL ? 'mr-2' : 'ml-2'}`}
              >
                {t('editCategoryModal.form.status.label')}
              </label>
            </div>
            <p 
              id="status-description" 
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {t('editCategoryModal.form.status.description')}
            </p>

            {/* Error Display */}
            {error && (
              <div 
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {t('editCategoryModal.buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.categoryName.trim()}
                className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('editCategoryModal.buttons.saving')}
                  </>
                ) : (
                  t('editCategoryModal.buttons.save')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};