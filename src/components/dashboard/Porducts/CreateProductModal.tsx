import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, Sparkles, Plus } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Category } from '../../../types/dashboard';
import { logger } from '../../../utils/logger';
import { mediaService } from '../../../services/mediaService';
import { productService } from '../../../services/productService';

interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isAvailable: boolean;
  imageFile: File | null;
  imageUrl: string;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  selectedCategoryId?: number;
  onOpenIngredientSelection?: (productId: number, productName: string) => void;
}

const DEFAULT_IMAGE_URL = 'https://www.customcardsandgames.com/assets/images/noImageUploaded.png';

const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  categories,
  selectedCategoryId,
  onOpenIngredientSelection
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<CreateProductFormData>({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    isAvailable: true,
    imageFile: null,
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
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
        categoryId: initialCategoryId,
        imageUrl: '',
        imageFile: null
      }));
      setImagePreview('');
    }
  }, [isOpen, selectedCategoryId, categories]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('createProductModal.errors.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('createProductModal.validation.nameMinLength');
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('createProductModal.validation.nameMaxLength');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('createProductModal.errors.descriptionRequired');
    } else if (formData.description.trim().length < 5) {
      newErrors.description = t('createProductModal.validation.descriptionMinLength');
    } else if (formData.description.trim().length > 500) {
      newErrors.description = t('createProductModal.validation.descriptionMaxLength');
    }
    
    if (formData.price <= 0) {
      newErrors.price = t('createProductModal.errors.priceMustBePositive');
    } else if (formData.price >= 10000) {
      newErrors.price = t('createProductModal.validation.priceMax');
    }
    
    // Convert categoryId to number if it's a string
    const categoryIdToCheck = typeof formData.categoryId === 'string' ? parseInt(formData.categoryId) : formData.categoryId;
    
    if (!categoryIdToCheck || categoryIdToCheck === 0) {
      newErrors.categoryId = t('createProductModal.errors.categoryRequired');
    } else {
      const categoryExists = categories.find(cat => cat.categoryId === categoryIdToCheck);
      logger.info('Kategori validasyonu', { 
        selectedCategoryId: categoryIdToCheck,
        selectedCategoryIdType: typeof categoryIdToCheck,
        availableCategories: categories.map(cat => ({ id: cat.categoryId, name: cat.categoryName, type: typeof cat.categoryId })),
        categoryExists: !!categoryExists
      });
      
      if (!categoryExists) {
        newErrors.categoryId = t('createProductModal.form.category.invalidCategory', {
          categories: categories.map(c => c.categoryName).join(', ')
        }) || `Selected category is invalid. Available categories: (${categories.map(c => c.categoryName).join(', ')})`;
      }
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: t('createProductModal.errors.imageInvalid')
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: t('createProductModal.errors.imageTooLarge')
      }));
      return;
    }

    setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
    
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
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (formData.imageFile) {
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
          image: t('createProductModal.errors.imageUploadFailed')
        }));
        return DEFAULT_IMAGE_URL; // Use default image if upload fails
      } finally {
        setIsUploadingImage(false);
      }
    }
    return DEFAULT_IMAGE_URL; // Use default image if no file is provided
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const imageUrl = await uploadImage();

      // Ensure categoryId is a number
      const categoryId = typeof formData.categoryId === 'string' ? parseInt(formData.categoryId) : formData.categoryId;

      const payload = {
        name: formData.name.trim() as string,
        description: formData.description.trim() as string,
        price: formData.price as number,
        categoryId: categoryId, 
        isAvailable: formData.isAvailable,
        imageUrl: imageUrl,
      };
      
      logger.info('Ürün ekleme isteği gönderiliyor', { 
        payload,
        categoryIdType: typeof payload.categoryId,
        categoryIdValue: payload.categoryId 
      });
      
      const response = await productService.createProduct(payload);
      
      logger.info('Ürün başarıyla eklendi', { data: response });
      
      // Trigger ingredient selection modal
      if (onOpenIngredientSelection) {
        onOpenIngredientSelection(response.id, response.name);
      }
      
      onSuccess();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: 0,
        isAvailable: true,
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
      
      // Handle different error types with localized messages
      if (error.response?.data?.errors) {
        // Field-specific validation errors
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        // API error message
        const apiMessage = error.response.data.message;
        
        if (error.response?.status === 400) {
          setErrors({
            general: apiMessage || t('createProductModal.errors.general')
          });
        } else if (error.response?.status === 500) {
          setErrors({
            general: t('createProductModal.errors.serverError')
          });
        } else {
          setErrors({
            general: apiMessage || t('createProductModal.errors.general')
          });
        }
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        setErrors({
          general: t('createProductModal.errors.networkError')
        });
      } else {
        setErrors({
          general: t('createProductModal.errors.unknownError')
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
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ 
                type: "spring",
                stiffness: 350,
                damping: 25
              }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              {/* Compact Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                
                <div className="relative px-4 py-3">
                  <button
                    onClick={onClose}
                    type="button"
                    className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200`}
                    aria-label={t('createProductModal.accessibility.closeModal')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{t('createProductModal.title')}</h2>
                      <p className="text-blue-100 text-xs">{t('createProductModal.subtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Form */}
              <div className="max-h-[80vh] overflow-y-auto">
                <form 
                  onSubmit={handleSubmit} 
                  className="p-4 space-y-4"
                  aria-label={t('createProductModal.accessibility.formTitle')}
                >
                  
                  {/* General Error */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <p className="text-red-600 dark:text-red-400 text-xs font-medium">
                          {t('createProductModal.errors.errorLabel')}
                        </p>
                        <p className="text-red-600 dark:text-red-400 text-xs">{errors.general}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Compact Image Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('createProductModal.form.productImage.label')}
                    </label>
                    
                    {imagePreview ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={imagePreview}
                          alt={t('createProductModal.imageUpload.preview')}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className={`absolute top-1 ${isRTL ? 'left-1' : 'right-1'} p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105`}
                          aria-label={t('createProductModal.accessibility.removeImage')}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ) : (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
                          dragActive 
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                            : errors.image
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        aria-label={t('createProductModal.accessibility.imageUpload')}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {dragActive ? t('createProductModal.imageUpload.dragActive') : t('createProductModal.imageUpload.clickToUpload')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('createProductModal.imageUpload.supportedFormats')} ({t('createProductModal.imageUpload.maxSize')})
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <input
                      title="image upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    
                    <AnimatePresence>
                      {errors.image && (
                        <motion.p 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                          role="alert"
                        >
                          {errors.image}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('createProductModal.form.productName.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                        errors.name
                          ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm`}
                      placeholder={t('createProductModal.form.productName.placeholder')}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-required="true"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p 
                          id="name-error"
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                          role="alert"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price and Category Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('createProductModal.form.price.label')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="price"
                          value={formData.price}
                          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                          step="1"
                          min="0"
                          className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                            errors.price
                              ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm ${isRTL ? 'pl-8' : 'pr-8'}`}
                          placeholder={t('createProductModal.form.price.placeholder')}
                          aria-describedby={errors.price ? 'price-error' : undefined}
                          aria-required="true"
                          aria-label={t('createProductModal.accessibility.priceInput')}
                        />
                        <div className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 text-gray-400 text-sm`}>
                          {t('createProductModal.form.price.currency')}
                        </div>
                      </div>
                      <AnimatePresence>
                        {errors.price && (
                          <motion.p 
                            id="price-error"
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            className="mt-1 text-xs text-red-600 dark:text-red-400"
                            role="alert"
                          >
                            {errors.price}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="categoryId" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('createProductModal.form.category.label')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => {
                          // Convert string value to number
                          const newCategoryId = parseInt(e.target.value) || 0;
                          logger.info('Category selection changed', { 
                            rawValue: e.target.value, 
                            parsedValue: newCategoryId,
                            type: typeof newCategoryId 
                          });
                          handleChange('categoryId', newCategoryId);
                        }}
                        className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                          errors.categoryId
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                        } text-gray-900 dark:text-white text-sm`}
                        aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
                        aria-required="true"
                        aria-label={t('createProductModal.accessibility.categorySelect')}
                      >
                        <option value="0">{t('createProductModal.form.category.placeholder')}</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                      <AnimatePresence>
                        {errors.categoryId && (
                          <motion.p 
                            id="categoryId-error"
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            className="mt-1 text-xs text-red-600 dark:text-red-400"
                            role="alert"
                          >
                            {errors.categoryId}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('createProductModal.form.description.label')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none ${
                        errors.description
                          ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm`}
                      placeholder={t('createProductModal.form.description.placeholder')}
                      aria-describedby={errors.description ? 'description-error' : undefined}
                      aria-required="true"
                    />
                    <AnimatePresence>
                      {errors.description && (
                        <motion.p 
                          id="description-error"
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                          role="alert"
                        >
                          {errors.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Toggle */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className={`flex items-center justify-between cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('createProductModal.form.status.label')}
                        </span>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t('createProductModal.form.status.description')}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => handleChange('isAvailable', e.target.checked)}
                          className="sr-only"
                          aria-label={t('createProductModal.accessibility.statusToggle')}
                        />
                        <div className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          formData.isAvailable 
                            ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                            formData.isAvailable 
                              ? `${isRTL ? 'translate-x-0.5' : 'translate-x-5'} ring-2 ring-blue-500/30` 
                              : `${isRTL ? 'translate-x-5' : 'translate-x-0.5'}`
                          }`}></div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      {t('createProductModal.buttons.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-2 relative overflow-hidden text-sm"
                    >
                      {isSubmitting || isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {isUploadingImage ? t('createProductModal.buttons.uploading') : t('createProductModal.buttons.creating')}
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{t('createProductModal.buttons.create')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProductModal;