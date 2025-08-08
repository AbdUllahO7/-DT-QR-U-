import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, Sparkles, Plus } from 'lucide-react';
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
  onOpenIngredientSelection?: (productId: number, productName: string) => void; // New prop
}

interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isAvailable: boolean;
  imageFile: File | null;
  imageUrl: string;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  categories,
  selectedCategoryId,
  onOpenIngredientSelection
}) => {
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
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
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
      // ... (error handling remains the same)
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
                    className="absolute top-2 right-2 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Yeni Ürün Ekle</h2>
                      <p className="text-blue-100 text-xs">Menünüze ürün ekleyin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Form */}
              <div className="max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  
                  {/* General Error */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <p className="text-red-600 dark:text-red-400 text-xs">{errors.general}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Compact Image Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Ürün Görseli
                    </label>
                    
                    {imagePreview ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
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
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {dragActive ? 'Dosyayı bırakın' : 'Görsel yükleyin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, GIF (5MB max)
                            </p>
                          </div>
                        </div>
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
                    
                    <AnimatePresence>
                      {errors.image && (
                        <motion.p 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.image}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Ürün Adı <span className="text-red-500">*</span>
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
                      placeholder="Örn: Margherita Pizza"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
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
                        Fiyat (₺) <span className="text-red-500">*</span>
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
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm pr-8`}
                          placeholder="0"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₺</div>
                      </div>
                      <AnimatePresence>
                        {errors.price && (
                          <motion.p 
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            className="mt-1 text-xs text-red-600 dark:text-red-400"
                          >
                            {errors.price}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="categoryId" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => {
                          const newCategoryId = e.target.value;
                          handleChange('categoryId', newCategoryId);
                        }}
                        className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                          errors.categoryId
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                        } text-gray-900 dark:text-white text-sm`}
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                      <AnimatePresence>
                        {errors.categoryId && (
                          <motion.p 
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            className="mt-1 text-xs text-red-600 dark:text-red-400"
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
                      Açıklama <span className="text-red-500">*</span>
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
                      placeholder="Ürün açıklaması..."
                    />
                    <AnimatePresence>
                      {errors.description && (
                        <motion.p 
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Toggle */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ürünü aktif et
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Menüde görüntülenir
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => handleChange('isAvailable', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          formData.isAvailable 
                            ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                            formData.isAvailable 
                              ? 'translate-x-5 ring-2 ring-blue-500/30' 
                              : 'translate-x-0.5'
                          }`}></div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      İptal
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
                            {isUploadingImage ? 'Yükleniyor...' : 'Ekleniyor...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Ürün Ekle</span>
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