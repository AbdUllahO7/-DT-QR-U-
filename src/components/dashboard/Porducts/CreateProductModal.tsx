import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, Plus, DollarSign, Tag, FileText, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { mediaService } from '../../../services/mediaService';
import { productService } from '../../../services/productService';
import { CreateProductFormData, CreateProductModalProps, DEFAULT_IMAGE_URL } from '../../../types/BranchManagement/type';

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
  selectedCategoryId
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
  const [focusedField, setFocusedField] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize categoryId when modal opens
  useEffect(() => {
    if (isOpen) {
      logger.info('Modal açıldı', { 
        selectedCategoryId, 
        categoriesCount: categories.length,
        categories: categories.map(cat => ({ id: cat.categoryId, name: cat.categoryName }))
      });
      
      let initialCategoryId = 0;
      
      if (selectedCategoryId && categories.find(cat => cat.categoryId === selectedCategoryId)) {
        initialCategoryId = selectedCategoryId;
      } else if (categories.length > 0) {
        initialCategoryId = categories[0].categoryId;
      }
      
      setFormData(prev => ({
        ...prev,
        categoryId: initialCategoryId,
        imageUrl: '',
        imageFile: null
      }));
      setImagePreview('');
      setErrors({});
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
    
    if (formData.description.trim().length > 500) {
      newErrors.description = t('createProductModal.validation.descriptionMaxLength');
    }
    
    if (formData.price <= 0) {
      newErrors.price = t('createProductModal.errors.priceMustBePositive');
    } else if (formData.price >= 10000) {
      newErrors.price = t('createProductModal.validation.priceMax');
    }
    
    const categoryIdToCheck = typeof formData.categoryId === 'string' ? parseInt(formData.categoryId) : formData.categoryId;
    
    if (!categoryIdToCheck || categoryIdToCheck === 0) {
      newErrors.categoryId = t('createProductModal.errors.categoryRequired');
    } else {
      const categoryExists = categories.find(cat => cat.categoryId === categoryIdToCheck);
      if (!categoryExists) {
        newErrors.categoryId = t('createProductModal.form.category.invalidCategory') || 'Selected category is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateProductFormData, value: string | boolean | number | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: t('createProductModal.errors.imageInvalid') }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: t('createProductModal.errors.imageTooLarge') }));
      return;
    }

    setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setErrors(prev => ({ ...prev, image: '' }));
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
        setErrors(prev => ({ ...prev, image: t('createProductModal.errors.imageUploadFailed') }));
        return DEFAULT_IMAGE_URL;
      } finally {
        setIsUploadingImage(false);
      }
    }
    return DEFAULT_IMAGE_URL;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const imageUrl = await uploadImage();
      const categoryId = typeof formData.categoryId === 'string' ? parseInt(formData.categoryId) : formData.categoryId;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        categoryId: categoryId,
        status: formData.isAvailable,
        displayOrder: 0,
        imageUrl: imageUrl,
      };
      
      logger.info('Ürün ekleme isteği gönderiliyor', { payload });
      const response = await productService.createProduct(payload);
      logger.info('Ürün başarıyla eklendi', { data: response });

      // Removed automatic ingredient selection - user can now manage ingredients via product card icon

      onSuccess(response.id);
      
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
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        const apiMessage = error.response.data.message;
        if (error.response?.status === 400) {
          setErrors({ general: apiMessage || t('createProductModal.errors.general') });
        } else if (error.response?.status === 500) {
          setErrors({ general: t('createProductModal.errors.serverError') });
        } else {
          setErrors({ general: apiMessage || t('createProductModal.errors.general') });
        }
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        setErrors({ general: t('createProductModal.errors.networkError') });
      } else {
        setErrors({ general: t('createProductModal.errors.unknownError') });
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

  const isFormValid = formData.name.trim()  && formData.price > 0 && formData.categoryId > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl"></div>
              
              {/* Modal */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="relative px-8 py-6">
                    <button
                      onClick={onClose}
                      type="button"
                      className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 text-white z-10`}
                      aria-label={t('createProductModal.accessibility.closeModal')}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl"></div>
                        <div className="relative p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                          <Plus className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <div className="flex-1 pt-1">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          {t('createProductModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          {t('createProductModal.subtitle')}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="overflow-y-auto flex-1 p-8 space-y-6">
                  {/* General Error */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="relative overflow-hidden rounded-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
                        <div className="relative p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="p-1.5 bg-red-100 dark:bg-red-800/30 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                                {t('createProductModal.errors.errorLabel')}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Image Upload - Enhanced */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{t('createProductModal.form.productImage.label')}</span>
                    </label>
                    
                    {imagePreview ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="relative rounded-2xl overflow-hidden">
                          <img
                            src={imagePreview}
                            alt={t('createProductModal.imageUpload.preview')}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <button
                            type="button"
                            onClick={removeImage}
                            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100`}
                            aria-label={t('createProductModal.accessibility.removeImage')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          dragActive 
                            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 scale-105'
                            : errors.image
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-950/20'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center space-y-4">
                          <motion.div 
                            animate={{ 
                              y: dragActive ? -10 : 0,
                              scale: dragActive ? 1.1 : 1
                            }}
                            className={`p-4 rounded-2xl ${dragActive ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-gray-100 dark:bg-gray-700'}`}
                          >
                            <Upload className={`h-10 w-10 ${dragActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                          </motion.div>
                          <div>
                            <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              {dragActive ? t('createProductModal.imageUpload.dragActive') : t('createProductModal.imageUpload.clickToUpload')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t('createProductModal.imageUpload.supportedFormats')} • {t('createProductModal.imageUpload.maxSize')}
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
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.image}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{t('createProductModal.form.productName.label')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        maxLength={100}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          errors.name
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                            : focusedField === 'name'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400'
                        } focus:outline-none`}
                        placeholder={t('createProductModal.form.productName.placeholder')}
                        aria-required="true"
                      />
                      <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2`}>
                        {formData.name && formData.name.length >= 2 && !errors.name && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                        )}
                        <span className="text-xs text-gray-400">{formData.name.length}/100</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label htmlFor="price" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{t('createProductModal.form.price.label')}</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="price"
                          value={formData.price || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              handleChange('price', 0);
                            } else {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                handleChange('price', numValue);
                              }
                            }
                          }}
                          onFocus={() => setFocusedField('price')}
                          onBlur={() => setFocusedField('')}
                          step="0.01"
                          min="0"
                          className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.price
                              ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                              : focusedField === 'price'
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/20'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400'
                          } focus:outline-none ${isRTL ? 'pl-12' : 'pr-12'}`}
                          placeholder="0.00"
                          aria-required="true"
                        />
                        <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium`}>
                          {t('createProductModal.form.price.currency')}
                        </div>
                      </div>
                      <AnimatePresence>
                        {errors.price && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.price}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="categoryId" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{t('createProductModal.form.category.label')}</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => {
                          const newCategoryId = parseInt(e.target.value) || 0;
                          handleChange('categoryId', newCategoryId);
                        }}
                        onFocus={() => setFocusedField('categoryId')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white ${
                          errors.categoryId
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                            : focusedField === 'categoryId'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400'
                        } focus:outline-none`}
                        aria-required="true"
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
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.categoryId}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{t('createProductModal.form.description.label')}</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        onFocus={() => setFocusedField('description')}
                        onBlur={() => setFocusedField('')}
                        maxLength={500}
                        rows={3}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          errors.description
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                            : focusedField === 'description'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400'
                        } focus:outline-none`}
                        placeholder={t('createProductModal.form.description.placeholder')}
                      />
                      <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} bottom-3 text-xs text-gray-400`}>
                        {formData.description.length}/500
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.description && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Toggle */}
                  <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-600">
                    <label className={`flex items-center gap-4 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => handleChange('isAvailable', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-600 shadow-inner"></div>
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                          {t('createProductModal.form.status.label')}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {t('createProductModal.form.status.description')}
                        </p>
                      </div>
                      
                   
                    </label>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
                    >
                      {t('createProductModal.buttons.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || isUploadingImage || !isFormValid}
                      className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/50 disabled:hover:shadow-none relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <span className={`relative flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {isSubmitting || isUploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>
                              {isUploadingImage ? t('createProductModal.buttons.uploading') : t('createProductModal.buttons.creating')}
                            </span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            <span>{t('createProductModal.buttons.create')}</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProductModal;