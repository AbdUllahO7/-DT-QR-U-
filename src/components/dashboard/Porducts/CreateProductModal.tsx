import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Category } from '../../../types/dashboard';
import { logger } from '../../../utils/logger';
import { mediaService } from '../../../services/mediaService';
import { productService } from '../../../services/productService';


interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  selectedCategoryId?: number;
}

interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isAvailable: boolean;
  displayOrder: number;
  imageFile: File | null;
  imageUrl: string;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  categories,
  selectedCategoryId 
}) => {
  const [formData, setFormData] = useState<CreateProductFormData>({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    isAvailable: true,
    displayOrder: 0,
    imageFile: null,
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize categoryId when modal opens or categories change
  useEffect(() => {
    if (isOpen) {
      logger.info('Modal açıldı', { 
        selectedCategoryId, 
        categoriesCount: categories.length,
        categories: categories.map(cat => ({ id: cat.categoryId, name: cat.categoryName, idType: typeof cat.categoryId }))
      });
      
      let initialCategoryId = 0;
      
      if (selectedCategoryId && categories.find(cat => cat.categoryId === selectedCategoryId)) {
        initialCategoryId = selectedCategoryId;
      } else if (categories.length > 0) {
        initialCategoryId = categories[0].categoryId;
      }
      
      logger.info('Kategori ID başlatılıyor', { initialCategoryId });
      
      setFormData(prev => ({
        ...prev,
        categoryId: initialCategoryId
      }));
    }
  }, [isOpen, selectedCategoryId, categories]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Ürün açıklaması gereklidir';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Fiyat 0\'dan büyük olmalıdır';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçimi gereklidir';
    } else {
      // Check if the selected category actually exists
      const categoryExists = categories.find(cat => cat.categoryId === formData.categoryId);
      logger.info('Kategori validasyonu', { 
        selectedCategoryId: formData.categoryId,
        availableCategories: categories.map(cat => ({ id: cat.categoryId, name: cat.categoryName })),
        categoryExists: !!categoryExists
      });
      
      if (!categoryExists) {
        newErrors.categoryId = `Seçilen kategori geçersiz. Mevcut kategoriler: ${categories.map(c => c.categoryName).join(', ')}`;
      }
    }
    
    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Görüntüleme sırası 0 veya daha büyük olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateProductFormData, value: string | boolean | number | File | null) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // First upload image if exists
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          // Image upload failed, don't proceed
          return;
        }
        imageUrl = uploadedUrl;
      }

      const payload = {
        name: formData.name.trim() as string,
        description: formData.description.trim() as string,
        price: formData.price as number,
        categoryId: formData.categoryId, 
        isAvailable: formData.isAvailable,
        displayOrder: formData.displayOrder,
        imageUrl: imageUrl,
      };
      
      logger.info('Ürün ekleme isteği gönderiliyor', { 
        payload,
        categoryIdType: typeof payload.categoryId,
        categoryIdValue: payload.categoryId 
      });
      
      const response = await productService.createProduct(payload);
      
      logger.info('Ürün başarıyla eklendi', { data: response });
      
      // Success callback'i çağır
      onSuccess();
      
      // Form'u sıfırla
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: 0,
        isAvailable: true,
        displayOrder: 0,
        imageFile: null,
        imageUrl: '',
      });
      setErrors({});
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (error: any) {
      logger.error('❌ Ürün eklenirken hata:', error);
      logger.error('❌ Ürün eklenirken detaylı hata:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // API'den gelen spesifik hataları işle
      if (error.response?.data?.errors) {
        // Field-specific validation errors
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        // API'den gelen genel hata mesajı
        const apiMessage = error.response.data.message;
        
        // Özel hata durumları için Türkçe mesajlar
        if (error.response?.status === 400) {
          if (apiMessage.toLowerCase().includes('already exists') || 
              apiMessage.toLowerCase().includes('zaten mevcut') ||
              apiMessage.toLowerCase().includes('duplicate')) {
            setErrors({
              name: 'Bu isimde bir ürün zaten mevcut. Lütfen farklı bir isim seçin.'
            });
          } else if (apiMessage.toLowerCase().includes('invalid') || 
                     apiMessage.toLowerCase().includes('geçersiz')) {
            setErrors({
              general: 'Girilen bilgiler geçersiz. Lütfen kontrol edip tekrar deneyin.'
            });
          } else {
            setErrors({
              general: apiMessage || 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
            });
          }
        } else if (error.response?.status === 500) {
          setErrors({
            general: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
          });
        } else {
          setErrors({
            general: apiMessage || 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
          });
        }
      } else if (error.message) {
        setErrors({
          general: error.message || 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      } else {
        setErrors({
          general: 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <button
                  onClick={onClose}
                  type="button"
                  className="absolute top-4 z-50 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 relative">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Yeni Ürün Ekle</h3>
                    <p className="text-green-100 text-sm">Menü ürünü oluşturun</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* General Error */}
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">Hata:</p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.general}</p>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ürün Görseli
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
                        Görsel yüklemek için tıklayın
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                      errors.name
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Örn: Margherita Pizza, Türk Kahvesi"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                      errors.description
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Ürünün detaylarını açıklayın..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                        errors.price
                          ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kategori *
                    </label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => {
                        const newCategoryId = e.target.value;
                        logger.info('Kategori seçildi', { 
                          categoryId: newCategoryId, 
                          categoryIdType: typeof newCategoryId 
                        });
                        handleChange('categoryId', newCategoryId);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                        errors.categoryId
                          ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Görüntüleme Sırası
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    value={formData.displayOrder}
                    onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                      errors.displayOrder
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.displayOrder && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayOrder}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Düşük sayılar önce görüntülenir
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleChange('isAvailable', e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ürünü aktif et
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Aktif ürünler menüde görünür
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    className="flex-1 px-4 py-3 text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting || isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isUploadingImage ? 'Görsel Yükleniyor...' : 'Ekleniyor...'}
                      </>
                    ) : (
                      'Ürün Ekle'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProductModal;