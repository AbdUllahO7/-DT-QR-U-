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
  
  // Selection State - Tracks ID, Name, and Removal status
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    isRemoval: boolean;
  } | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('categories');
      setSelectedCategory(null);
      logger.info('Product extras modal opened', { productId, productName });
    }
  }, [isOpen, productId, productName]);

  // Handle category selection from the first modal
  const handleSelectCategory = (categoryId: number, categoryName: string, isRemoval: boolean = false) => {
    setSelectedCategory({ 
      id: categoryId, 
      name: categoryName, 
      isRemoval: isRemoval 
    });
    setCurrentView('extras');
    logger.info('Selected category for extras management', { categoryId, categoryName, isRemoval });
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
      {/* View 1: Categories List 
        This modal is now responsive (Full screen on mobile, Card on desktop)
      */}
      {currentView === 'categories' && (
        <ProductExtraCategoriesModal
          isOpen={true}
          onClose={handleClose}
          productId={productId}
          productName={productName}
          onSelectCategory={handleSelectCategory}
        />
      )}    

      {/* View 2: Extras Management 
        This modal is now responsive and handles Removal logic
      */}
      {currentView === 'extras' && selectedCategory && (
        <ProductExtrasManagementModal
          isOpen={true}
          onClose={handleClose}
          onBack={handleBackToCategories}
          productId={productId}
          productName={productName}
          extraCategoryId={selectedCategory.id}
          extraCategoryName={selectedCategory.name}
          // Pass the removal flag down so the modal can enforce Single Select UI
          isRemoval={selectedCategory.isRemoval}
        />
      )}
    </>
  );
};

export default ProductExtrasModal;