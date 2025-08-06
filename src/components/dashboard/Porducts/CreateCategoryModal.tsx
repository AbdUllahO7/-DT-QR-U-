import { useState } from "react";
import { logger } from "../../../utils/logger";
import { httpClient } from "../../../utils/http";
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from "lucide-react";

// CreateCategoryModal Component
interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateCategoryFormData {
  categoryName: string;
  status: boolean;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    categoryName: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Kategori adı gereklidir';
    }
    

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateCategoryFormData, value: string | boolean | number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        categoryName: formData.categoryName.trim(),
        status: formData.status,
      };
      
      logger.info('Kategori ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post('/api/categories', payload);
      
      logger.info('Kategori başarıyla eklendi', { data: response.data });
      
      // Success callback'i çağır
      onSuccess();
      
      // Form'u sıfırla
      setFormData({
        categoryName: '',
        status: true,
      });
      setErrors({});
      onClose();
     } catch (error: any) {
      logger.error('❌ Kategori eklenirken hata:', error);
      logger.error('❌ Kategori eklenirken detaylı hata:', {
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
              categoryName: 'Bu isimde bir kategori zaten mevcut. Lütfen farklı bir isim seçin.'
            });
          } else if (apiMessage.toLowerCase().includes('invalid') || 
                     apiMessage.toLowerCase().includes('geçersiz')) {
            setErrors({
              general: 'Girilen bilgiler geçersiz. Lütfen kontrol edip tekrar deneyin.'
            });
          } else {
            setErrors({
              general: apiMessage || 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
            });
          }
        } else if (error.response?.status === 500) {
          setErrors({
            general: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
          });
        } else {
          setErrors({
            general: apiMessage || 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
          });
        }
      } else if (error.message) {
        setErrors({
          general: error.message || 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      } else {
        setErrors({
          general: 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      }
    } finally {
      setIsSubmitting(false);
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
              className="relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <div className="absolute   bg-gradient-to-br from-white/10 to-transparent" />
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
                    <h3 className="text-xl font-bold">Yeni Kategori Ekle</h3>
                    <p className="text-primary-100 text-sm">Menü kategorisi oluşturun</p>
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

                {/* Category Name */}
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => handleChange('categoryName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                      errors.categoryName
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Örn: Ana Yemekler, İçecekler, Tatlılar"
                  />
                  {errors.categoryName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryName}</p>
                  )}
                </div>

              

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => handleChange('status', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kategoriyi aktif et
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Aktif kategoriler menüde görünür
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
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200"
                  >
                    {isSubmitting ? 'Ekleniyor...' : 'Kategori Ekle'}
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


export default CreateCategoryModal