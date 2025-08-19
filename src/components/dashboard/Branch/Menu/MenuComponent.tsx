import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  Star, 
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Leaf,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { branchProductService } from '../../../../services/Branch/BranchProductService';

// Interfaces matching the actual API response from getBranchMenu
interface MenuAllergen {
  allergenId: number;
  code: string;
  name: string;
  icon: string;
  presence: number;
  note: string;
}

interface MenuIngredient {
  id: number;
  productId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergens: MenuAllergen[];
}

interface MenuProduct {
  branchProductId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  price: number;
  isRecommended: boolean;
  ingredients: MenuIngredient[];
  allergens: MenuAllergen[];
  availableAddons: any[]; // You can type this more specifically if needed
}

interface MenuCategory {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
  products: MenuProduct[];
}

interface BranchMenuResponse {
  branchId: number;
  branchName: string;
  restaurantName: string;
  branchAddress: string;
  isOpen: boolean;
  categories: MenuCategory[];
}

interface CartItem {
  branchProductId: number;
  productName: string;
  price: number;
  quantity: number;
  productImageUrl?: string;
}

interface MenuComponentProps {
  branchId: number;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ branchId }) => {
  const { t, isRTL } = useLanguage();
  
  // State management
  const [menuData, setMenuData] = useState<BranchMenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Function to merge duplicate categories
  const mergeDuplicateCategories = (categories: MenuCategory[]): MenuCategory[] => {
    const categoryMap = new Map<number, MenuCategory>();
    
    categories.forEach(category => {
      const existingCategory = categoryMap.get(category.categoryId);
      
      if (existingCategory) {
        // Merge products from duplicate category
        existingCategory.products.push(...category.products);
      } else {
        // First time seeing this categoryId, create new entry
        categoryMap.set(category.categoryId, {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          displayOrder: category.displayOrder,
          products: [...category.products] // Create a copy of products array
        });
      }
    });
    
    // Convert map back to array and sort by displayOrder
    return Array.from(categoryMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  };

  // Fetch menu data
  useEffect(() => {
    if (branchId) {
      fetchMenuData();
    }
  }, [branchId]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get branch menu with full details
      const menuResponse = await branchProductService.getBranchMenu(branchId, [
        'ingredients', 
        'allergens', 
        'availableAddons'
      ]);
      
      // Note: The service might need to be updated to return the exact structure
      // For now, we'll handle both possible response formats
      if (Array.isArray(menuResponse)) {
        // If it returns an array of products, we need to group them by category
        // This would require additional logic
        setError('Menu format not supported yet. Please update the service.');
        return;
      }
      
      // Assuming the service returns the correct structure as shown in the example
      const typedMenuData = menuResponse as unknown as BranchMenuResponse;
      
      // Merge duplicate categories before setting state
      if (typedMenuData.categories) {
        const mergedCategories = mergeDuplicateCategories(typedMenuData.categories);
        
        // Update the menu data with merged categories
        const updatedMenuData = {
          ...typedMenuData,
          categories: mergedCategories
        };
        
        setMenuData(updatedMenuData);
        
        // Set the first category as selected
        if (mergedCategories.length > 0) {
          setSelectedCategory(mergedCategories[0].categoryId);
        }
      } else {
        setMenuData(typedMenuData);
      }
      
    } catch (err: any) {
      console.error('Error fetching menu data:', err);
      setError('Menü yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Cart functions
  const addToCart = (product: MenuProduct) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.branchProductId === product.branchProductId);
      if (existingItem) {
        return prev.map(item =>
          item.branchProductId === product.branchProductId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        branchProductId: product.branchProductId,
        productName: product.productName,
        price: product.price,
        quantity: 1,
        productImageUrl: product.productImageUrl
      }];
    });
  };

  const removeFromCart = (branchProductId: number) => {
    setCart(prev => {
      return prev.reduce((acc, item) => {
        if (item.branchProductId === branchProductId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // If quantity is 1, don't add it back (effectively removing it)
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const getCartItemQuantity = (branchProductId: number): number => {
    const item = cart.find(item => item.branchProductId === branchProductId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Filter categories and products
  const getFilteredCategories = (): MenuCategory[] => {
    if (!menuData?.categories) return [];
    
    return menuData.categories.filter(category =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.products.some(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ).sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const getProductsForCategory = (categoryId: number): MenuProduct[] => {
    const category = menuData?.categories.find(cat => cat.categoryId === categoryId);
    return category?.products || [];
  };

  const getFilteredProducts = (products: MenuProduct[]): MenuProduct[] => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
              <ChefHat className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 dark:text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Menü Yükleniyor
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Lezzetli seçeneklerimiz hazırlanıyor...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Menü Yüklenemedi
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <button 
              onClick={fetchMenuData}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!menuData) return null;

  const filteredCategories = getFilteredCategories();

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Restaurant Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {menuData.restaurantName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {menuData.branchName} • {menuData.isOpen ? 'Açık' : 'Kapalı'}
                </p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Menüde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-orange-600" />
                Kategoriler
              </h3>
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryId)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.categoryId
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.categoryName}</span>
                      <span className={`text-sm ${
                        selectedCategory === category.categoryId 
                          ? 'text-orange-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.products.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div>
                {/* Category Header */}
                {(() => {
                  const currentCategory = filteredCategories.find(cat => cat.categoryId === selectedCategory);
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : [];
                  
                  return currentCategory ? (
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                          <Sparkles className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{currentCategory.categoryName}</h2>
                        <p className="text-orange-100">
                          {products.length} ürün mevcut
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(() => {
                    const currentCategory = filteredCategories.find(cat => cat.categoryId === selectedCategory);
                    const products = currentCategory ? getFilteredProducts(currentCategory.products) : [];
                    
                    return products.map((product) => (
                      <div
                        key={product.branchProductId}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                          {product.productImageUrl ? (
                            <img
                              src={product.productImageUrl}
                              alt={product.productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="h-16 w-16 text-orange-300 dark:text-orange-600" />
                            </div>
                          )}
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex space-x-2">
                            {product.isRecommended && (
                              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                Önerilen
                              </span>
                            )}
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {product.productName}
                          </h3>
                          
                          {product.productDescription && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.productDescription}
                            </p>
                          )}

                          {/* Allergens */}
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {product.allergens.slice(0, 3).map((allergen) => (
                                <span
                                  key={allergen.allergenId}
                                  className="inline-flex items-center text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full"
                                  title={allergen.name}
                                >
                                  <span className="mr-1">{allergen.icon}</span>
                                  {allergen.code}
                                </span>
                              ))}
                              {product.allergens.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{product.allergens.length - 3} daha
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                ₺{product.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Add to Cart Controls */}
                            <div className="flex items-center space-x-2">
                              {getCartItemQuantity(product.branchProductId) > 0 ? (
                                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                  <button
                                    onClick={() => removeFromCart(product.branchProductId)}
                                    className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                    {getCartItemQuantity(product.branchProductId)}
                                  </span>
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Ekle</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Empty State for Category */}
                {(() => {
                  const currentCategory = filteredCategories.find(cat => cat.categoryId === selectedCategory);
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : [];
                  
                  return products.length === 0 && (
                    <div className="text-center py-12">
                      <Coffee className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {searchTerm ? 'Arama sonucu bulunamadı' : 'Bu kategoride ürün bulunamadı'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm ? 'Farklı anahtar kelimeler deneyin' : 'Diğer kategorileri kontrol edin'}
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Welcome State */
              <div className="text-center py-16">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UtensilsCrossed className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {menuData.restaurantName} Menüsü
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Kategori seçerek lezzetli ürünlerimizi keşfetmeye başlayın
                  </p>
                  {filteredCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategory(filteredCategories[0].categoryId)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    >
                      Menüyü Keşfet
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sepetim
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Plus className="h-5 w-5 rotate-45 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.branchProductId} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                        {item.productImageUrl && (
                          <img 
                            src={item.productImageUrl} 
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ₺{item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.branchProductId)}
                            className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              // Find the product to add back to cart
                              const product = menuData?.categories
                                .flatMap(cat => cat.products)
                                .find(p => p.branchProductId === item.branchProductId);
                              if (product) {
                                addToCart(product);
                              }
                            }}
                            className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Toplam:
                      </span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        ₺{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200">
                      Sipariş Ver
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Sepetiniz boş
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ürün eklemek için menüyü inceleyin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuComponent;