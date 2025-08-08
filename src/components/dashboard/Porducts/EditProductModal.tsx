// EditProductModal Component

import { ImageIcon, Loader2, X } from "lucide-react";
import { logger } from "../../../utils/logger";
import { productService } from "../../../services/productService";
import { mediaService } from "../../../services/mediaService";
import { Category, Product } from "../../../types/dashboard";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";

// EditProductModal Component - Updated with image upload functionality
export const EditProductModal: React.FC<{
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
    imageUrl: product.imageUrl || '',
    imageFile: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize image preview on modal open
  useEffect(() => {
    if (isOpen && product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '') {
      setImagePreview(product.imageUrl);
    } else {
      setImagePreview('');
    }
  }, [isOpen, product.imageUrl]);

  const handleChange = (field: keyof typeof formData, value: string | boolean | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Lütfen geçerli bir görsel dosyası seçin'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Görsel dosyası 5MB\'dan küçük olmalıdır'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous image errors
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!formData.imageFile) return null;

    try {
      setIsUploadingImage(true);
      logger.info('Görsel yükleniyor', { fileName: formData.imageFile.name });
      
      const imageUrl = await mediaService.uploadFile(formData.imageFile);
      
      logger.info('Görsel başarıyla yüklendi', { imageUrl });
      return imageUrl;
    } catch (error: any) {
      logger.error('❌ Görsel yüklenirken hata:', error);
      setErrors(prev => ({
        ...prev,
        image: 'Görsel yüklenirken bir hata oluştu'
      }));
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setErrors({});

    try {
      // Handle image upload if a new file was selected
      let finalImageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          // Image upload failed, don't proceed
          return;
        }
        finalImageUrl = uploadedUrl;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
        imageUrl: finalImageUrl
      };

      logger.info('Ürün güncelleme isteği gönderiliyor', { payload, productId: product.id });

      await productService.updateProduct(product.id, payload);
      logger.info('Ürün başarıyla güncellendi', { productId: product.id });
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Ürün güncelleme hatası:', err);
      
      // API'den gelen spesifik hataları işle
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        const apiMessage = err.response.data.message;
        
        if (err.response?.status === 400) {
          if (apiMessage.toLowerCase().includes('already exists') || 
              apiMessage.toLowerCase().includes('zaten mevcut') ||
              apiMessage.toLowerCase().includes('duplicate')) {
            setErrors({
              name: 'Bu isimde bir ürün zaten mevcut. Lütfen farklı bir isim seçin.'
            });
          } else {
            setError(apiMessage || 'Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
          }
        } else {
          setError(apiMessage || 'Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } else {
        setError('Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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
            {/* General Error */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Hata:</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Ürün Görseli')}
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                    errors.image
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('Görsel yüklemek için tıklayın')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF (maksimum 5MB)
                  </p>
                </div>
              )}
              
              <input
                title='image upload'
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {errors.image && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Ürün Adı')} *
              </label>
              <input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.name
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Açıklama')}
              </label>
              <textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                  errors.description
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Fiyat (₺)')} *
                </label>
                <input
                  id="edit-price"
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                    errors.price
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                  required
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="edit-categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('Kategori')} *
                </label>
                <select
                  id="edit-categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                    errors.categoryId
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                id="edit-isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => handleChange('isAvailable', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="edit-isAvailable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('Stokta Var')}
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                {t('İptal')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isSubmitting || isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isUploadingImage ? t('Görsel Yükleniyor...') : t('Kaydediliyor...')}
                  </>
                ) : (
                  t('Kaydet')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};