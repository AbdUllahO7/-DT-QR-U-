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
  
  // Selection State - Updated to track isRemoval status
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    isRemoval: boolean;
  } | null>(null);


  console.log("selectedCategory",selectedCategory)

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('categories');
      setSelectedCategory(null);
      logger.info('Product extras modal opened', { productId, productName });
    }
  }, [isOpen, productId, productName]);

  // Updated to accept isRemoval flag from the categories modal
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
      {currentView === 'categories' && (
        <ProductExtraCategoriesModal
          isOpen={true}
          onClose={handleClose}
          productId={productId}
          productName={productName}
          // Note: You must update ProductExtraCategoriesModal to pass the isRemoval boolean in this callback
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
          // Pass the removal flag down so the modal can enforce Single Select
          isRemoval={selectedCategory.isRemoval}
        />
      )}
    </>
  );
};

export default ProductExtrasModal;