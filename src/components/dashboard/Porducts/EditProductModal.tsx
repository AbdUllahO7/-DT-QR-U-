import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { productService } from "../../../services/productService";
import { mediaService } from "../../../services/mediaService";
import { logger } from "../../../utils/logger";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Upload, Loader2,Sparkles, CheckCircle2, AlertCircle, Image } from "lucide-react";
import { Category, Product } from "../../../types/BranchManagement/type";
import { languageService } from "../../../services/LanguageService";
import { MultiLanguageInput } from "../../common/MultiLanguageInput";
import { MultiLanguageTextArea } from "../../common/MultiLanguageTextArea";
import { useTranslatableFields, TranslatableFieldValue } from "../../../hooks/useTranslatableFields";
import { productTranslationService } from "../../../services/Translations/ProductTranslationService";
import { useCurrency } from "../../../hooks/useCurrency";

export const EditProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
  categories: Category[];
  onOpenIngredientUpdate?: (productId: number, productName: string) => void;
}> = ({ isOpen, onClose, onSuccess, product, categories, onOpenIngredientUpdate }) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();
  const currency = useCurrency();

  // Supported languages - dynamically loaded
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  // Translation states
  const [productNameTranslations, setProductNameTranslations] = useState<TranslatableFieldValue>({});
  const [descriptionTranslations, setDescriptionTranslations] = useState<TranslatableFieldValue>({});

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
  const [dragActive, setDragActive] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load languages on mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');

        // Initialize empty translations
        const languageCodes = uniqueLanguages.map((lang: any) => lang.code);
        setProductNameTranslations(translationHook.getEmptyTranslations(languageCodes));
        setDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        logger.error('Failed to load languages', error, { prefix: 'EditProductModal' });
      }
    };
    loadLanguages();
  }, []);

  // Load existing product data and translations when modal opens
  useEffect(() => {
    if (!isOpen || !product) return;

    const loadProductData = async () => {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        categoryId: product.categoryId,
        isAvailable: product.isAvailable,
        imageUrl: product.imageUrl || '',
        imageFile: null
      });

      if (product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '') {
        setImagePreview(product.imageUrl);
      } else {
        setImagePreview('');
      }

      // Load existing translations
      try {
        const response = await productTranslationService.getProductTranslations(product.id);

        const productNameTrans: TranslatableFieldValue = {
          [defaultLanguage]: product.name
        };
        const descriptionTrans: TranslatableFieldValue = {
          [defaultLanguage]: product.description || ''
        };

        // Handle API response structure - could be array or object with translations property
        const translationsArray = Array.isArray(response) ? response : (response as any)?.translations || [];

        // Process translations array
        translationsArray.forEach((translation: any) => {
          if (translation.name) {
            productNameTrans[translation.languageCode] = translation.name;
          }
          if (translation.description) {
            descriptionTrans[translation.languageCode] = translation.description;
          }
        });

        setProductNameTranslations(productNameTrans);
        setDescriptionTranslations(descriptionTrans);
      } catch (error) {
        logger.error('Failed to load product translations', error, { prefix: 'EditProductModal' });
        // Initialize with default language values on error
        const productNameTrans: TranslatableFieldValue = {
          [defaultLanguage]: product.name
        };
        const descriptionTrans: TranslatableFieldValue = {
          [defaultLanguage]: product.description || ''
        };
        setProductNameTranslations(productNameTrans);
        setDescriptionTranslations(descriptionTrans);
      }

      setError(null);
      setErrors({});
    };

    loadProductData();
  }, [isOpen, product, defaultLanguage, supportedLanguages]);

  const handleChange = (field: keyof typeof formData, value: string | boolean | number | File | null) => {
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
      setErrors(prev => ({ ...prev, image: t('editProductModal.errors.imageInvalid') }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: t('editProductModal.errors.imageTooLarge') }));
      return;
    }

    setFormData(prev => ({ ...prev, imageFile: file }));
    
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
      setErrors(prev => ({ ...prev, image: t('editProductModal.errors.imageUploadFailed') }));
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setErrors({});

    try {
      let finalImageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
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

      const updatedProduct = await productService.updateProduct(product.id, payload);

      logger.info('Ürün başarıyla güncellendi', {
        productId: product.id,
        updatedProductId: updatedProduct.id
      });

      // Save translations
      try {
        const translationData = Object.keys(productNameTranslations)
          .filter(lang => lang !== defaultLanguage)
          .filter(lang =>
            productNameTranslations[lang] ||
            descriptionTranslations[lang]
          )
          .map(languageCode => ({
            productId: product.id,
            languageCode,
            name: productNameTranslations[languageCode] || undefined,
            description: descriptionTranslations[languageCode] || undefined,
          }));

        if (translationData.length > 0) {
          await productTranslationService.batchUpsertProductTranslations({
            translations: translationData
          });
          logger.info('Product translations saved', null, { prefix: 'EditProductModal' });
        }
      } catch (error) {
        logger.error('Failed to save product translations', error, { prefix: 'EditProductModal' });
        // Don't fail the whole operation if translations fail
      }

      if (onOpenIngredientUpdate) {
        onOpenIngredientUpdate(product.id, product.name);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Ürün güncelleme hatası:', err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        const apiMessage = err.response.data.message;
        
        if (err.response?.status === 400) {
          if (apiMessage.toLowerCase().includes('already exists') || 
              apiMessage.toLowerCase().includes('zaten mevcut') ||
              apiMessage.toLowerCase().includes('duplicate')) {
            setErrors({ name: t('editProductModal.errors.nameAlreadyExists') });
          } else {
            setError(apiMessage || t('editProductModal.errors.updateFailed'));
          }
        } else if (err.response?.status === 404) {
          setError(t('editProductModal.errors.productNotFound'));
        } else if (err.response?.status === 403) {
          setError(t('editProductModal.errors.permissionDenied'));
        } else if (err.response?.status >= 500) {
          setError(t('editProductModal.errors.serverError'));
        } else {
          setError(apiMessage || t('editProductModal.errors.updateFailed'));
        }
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError(t('editProductModal.errors.networkError'));
      } else {
        setError(t('editProductModal.errors.updateFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.price > 0 && formData.categoryId;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl"></div>
              
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
                          <Edit3 className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <div className="flex-1 pt-1">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          {t('editProductModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          {t('editProductModal.subtitle') || 'Update product information'}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto flex-1 p-8 space-y-6">
                  {/* General Error */}
                  <AnimatePresence>
                    {error && (
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
                                {t('editProductModal.errors.errorLabel')}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Image Upload */}
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{t('editProductModal.form.productImage.label')}</span>
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
                            alt="Preview"
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <button
                            type="button"
                            onClick={removeImage}
                            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100`}
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
                              {dragActive ? t('editProductModal.imageUpload.dragActive') : t('editProductModal.imageUpload.clickToUpload')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t('editProductModal.imageUpload.supportedFormats')} • {t('editProductModal.imageUpload.maxSize')}
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

                  {/* Product Name - Multi-language Input */}
                  <div>
                    <MultiLanguageInput
                      label={t('editProductModal.form.productName.label')}
                      value={productNameTranslations}
                      onChange={(newTranslations) => {
                        setProductNameTranslations(newTranslations);
                        // Update base formData with default language value for validation
                        const val = newTranslations[defaultLanguage] || '';
                        setFormData(prev => ({ ...prev, name: val }));

                        // Clear error if exists
                        if (errors.name && val) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.name;
                            return newErrors;
                          });
                        }
                      }}
                      languages={supportedLanguages}
                      placeholder={t('editProductModal.form.productName.placeholder')}
                      defaultLanguage={defaultLanguage}
                      required={true}
                    />
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

                  {/* Price and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                                {currency.symbol}

                        <span>{t('editProductModal.form.price.label')}</span>
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
                          {t('editProductModal.form.price.currency')}
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

                    <div>
                      <label htmlFor="categoryId" className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{t('editProductModal.form.category.label')}</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => handleChange('categoryId', e.target.value)}
                        onFocus={() => setFocusedField('categoryId')}
                        onBlur={() => setFocusedField('')}
                        style={{
                          colorScheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                        }}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white ${
                          errors.categoryId
                            ? 'border-red-300 dark:border-red-600 !bg-red-50/50 dark:!bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                            : focusedField === 'categoryId'
                            ? 'border-blue-500 dark:border-blue-400 !bg-blue-50/50 dark:!bg-blue-900/10 focus:ring-4 focus:ring-blue-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400'
                        } focus:outline-none [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-white`}
                        aria-required="true"
                      >
                        <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t('editProductModal.form.category.placeholder')}</option>
                        {categories.map((cat) => (
                          <option className='bg-white dark:bg-gray-800 text-gray-900 dark:text-white' key={cat.categoryId} value={cat.categoryId}>
                            {cat.categoryName}
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

                  {/* Description - Multi-language TextArea */}
                  <div>
                    <MultiLanguageTextArea
                      label={t('editProductModal.form.description.label')}
                      value={descriptionTranslations}
                      onChange={(newTranslations) => {
                        setDescriptionTranslations(newTranslations);
                        // Update base formData with default language value
                        const val = newTranslations[defaultLanguage] || '';
                        setFormData(prev => ({ ...prev, description: val }));
                      }}
                      languages={supportedLanguages}
                      placeholder={t('editProductModal.form.description.placeholder')}
                      defaultLanguage={defaultLanguage}
                      rows={3}
                    />
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
                          {t('editProductModal.form.status.label')}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {t('editProductModal.form.status.description')}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
                    >
                      {t('editProductModal.buttons.cancel')}
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
                              {isUploadingImage ? t('editProductModal.buttons.uploading') : t('editProductModal.buttons.updating')}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{t('editProductModal.buttons.update')}</span>
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