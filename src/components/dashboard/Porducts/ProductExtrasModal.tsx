import React, { useState, useEffect } from 'react';
import { logger } from '../../../utils/logger';
import ProductExtraCategoriesModal from './ProductExtraCategoriesModal';
import ProductExtrasManagementModal from './ProductExtrasManagementModal';


interface ProductExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}

type ModalView = 'categories' | 'extras';

const ProductExtrasModal: React.FC<ProductExtrasModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const [currentView, setCurrentView] = useState<ModalView>('categories');
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('categories');
      setSelectedCategory(null);
      logger.info('Product extras modal opened', { productId, productName });
    }
  }, [isOpen, productId, productName]);

  const handleSelectCategory = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setCurrentView('extras');
    logger.info('Selected category for extras management', { categoryId, categoryName });
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    onClose();
    onSuccess(); // Refresh parent data
  };

  if (!isOpen) return null;

  return (
    <>
      {currentView === 'categories' && (
        <ProductExtraCategoriesModal
          isOpen={true}
          onClose={handleClose}
          productId={productId}
          productName={productName}
          onSelectCategory={handleSelectCategory}
        />
      )}    

      {currentView === 'extras' && selectedCategory && (
        <ProductExtrasManagementModal
          isOpen={true}
          onClose={handleClose}
          onBack={handleBackToCategories}
          productId={productId}
          productName={productName}
          extraCategoryId={selectedCategory.id}
          extraCategoryName={selectedCategory.name}
        />
      )}
    </>
  );
};

export default ProductExtrasModal;