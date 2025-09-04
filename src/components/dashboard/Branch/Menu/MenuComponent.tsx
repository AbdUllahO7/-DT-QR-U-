"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChefHat,
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
  Award,
  X,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  ArrowUp,
  Zap,
  Shield,
  Truck,
  Utensils,
  Flame,
  Users,
  Leaf,
  Timer
} from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { branchProductService } from "../../../../services/Branch/BranchProductService"
import { BranchMenuResponse, CartItem, MenuCategory, MenuComponentProps, MenuProduct } from "../../../../types/menu/type"
import LanguageSelector from "../../../LanguageSelector"

// Footer Component
const Footer: React.FC = () => {
  const { t } = useLanguage()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Features Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {t('menu.whyChooseUs.title')}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
              {t('menu.whyChooseUs.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('menu.whyChooseUs.freshIngredients.title')}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t('menu.whyChooseUs.freshIngredients.description')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('menu.whyChooseUs.fastDelivery.title')}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t('menu.whyChooseUs.fastDelivery.description')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('menu.whyChooseUs.qualityAssured.title')}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t('menu.whyChooseUs.qualityAssured.description')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('menu.whyChooseUs.expertChefs.title')}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t('menu.whyChooseUs.expertChefs.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-slate-950 to-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {t('menu.footer.brand')}
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4 text-sm">
                {t('menu.footer.description')}
              </p>
              <div className="flex space-x-2">
                <a href="#" className="w-8 h-8 bg-slate-800/50 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-blue-500 group">
                  <Facebook className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-800/50 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-pink-500 group">
                  <Instagram className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-800/50 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-blue-400 group">
                  <Twitter className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-800/50 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-orange-500 group">
                  <Globe className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-orange-500" />
                {t('menu.footer.quickLinks')}
              </h4>
              <ul className="space-y-2">
                {[
                  t('menu.footer.links.ourMenu'),
                  t('menu.footer.links.aboutUs'),
                  t('menu.footer.links.locations'),
                  t('menu.footer.links.reservations'),
                  t('menu.footer.links.specialOffers'),
                  t('menu.footer.links.giftCards')
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-orange-500" />
                {t('menu.footer.services')}
              </h4>
              <ul className="space-y-2">
                {[
                  t('menu.footer.services.onlineOrdering'),
                  t('menu.footer.services.tableBooking'),
                  t('menu.footer.services.privateEvents'),
                  t('menu.footer.services.catering'),
                  t('menu.footer.services.takeaway'),
                  t('menu.footer.services.corporateMeals')
                ].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                {t('menu.footer.getInTouch')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                    <MapPin className="h-3 w-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t('menu.footer.visitUs')}</p>
                    <p className="text-slate-400 text-xs">123 Culinary Street<br />Food District, City</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                    <Phone className="h-3 w-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t('menu.footer.callUs')}</p>
                    <p className="text-slate-400 text-xs">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                    <Mail className="h-3 w-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t('menu.footer.emailUs')}</p>
                    <p className="text-slate-400 text-xs">hello@menuhub.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <p>&copy; 2024 MenuHub. {t('menu.footer.copyright')}</p>
                <span className="hidden lg:inline">|</span>
                <a href="#" className="hover:text-white transition-colors">{t('menu.footer.privacyPolicy')}</a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">{t('menu.footer.termsOfService')}</a>
              </div>
              
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <span>{t('menu.footer.poweredBy')}</span>
                <div className="flex items-center space-x-1 text-orange-500 font-semibold">
                  <Flame className="h-3 w-3" />
                  <span>Idigitek</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center group transform hover:scale-110"
          >
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        )}
      </footer>
    </>
  )
}

const MenuComponent: React.FC<MenuComponentProps> = ({ branchId }) => {
  const { t, isRTL } = useLanguage()

  // State management
  const [menuData, setMenuData] = useState<BranchMenuResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // Function to merge duplicate categories
  const mergeDuplicateCategories = (categories: MenuCategory[]): MenuCategory[] => {
    const categoryMap = new Map<number, MenuCategory>()

    categories.forEach((category) => {
      const existingCategory = categoryMap.get(category.categoryId)

      if (existingCategory) {
        existingCategory.products.push(...category.products)
      } else {
        categoryMap.set(category.categoryId, {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          displayOrder: category.displayOrder,
          products: [...category.products],
        })
      }
    })

    return Array.from(categoryMap.values()).sort((a, b) => a.displayOrder - b.displayOrder)
  }

  // Fetch menu data
  useEffect(() => {
    if (branchId) {
      fetchMenuData()
    }
  }, [branchId])

  const fetchMenuData = async () => {
    try {
      setLoading(true)
      setError(null)

      const menuResponse = await branchProductService.getBranchMenu(branchId, [
        "ingredients",
        "allergens",
        "availableAddons",
      ])

      if (Array.isArray(menuResponse)) {
        setError("Menu format not supported yet. Please update the service.")
        return
      }

      const typedMenuData = menuResponse as unknown as BranchMenuResponse

      if (typedMenuData.categories) {
        const mergedCategories = mergeDuplicateCategories(typedMenuData.categories)

        const updatedMenuData = {
          ...typedMenuData,
          categories: mergedCategories,
        }

        setMenuData(updatedMenuData)

        if (mergedCategories.length > 0) {
          setSelectedCategory(mergedCategories[0].categoryId)
        }
      } else {
        setMenuData(typedMenuData)
      }
    } catch (err: any) {
      console.error("Error fetching menu data:", err)
      setError("Unable to load menu. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Cart functions
  const addToCart = (product: MenuProduct) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.branchProductId === product.branchProductId)
      if (existingItem) {
        return prev.map((item) =>
          item.branchProductId === product.branchProductId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          branchProductId: product.branchProductId,
          productName: product.productName,
          price: product.price,
          quantity: 1,
          productImageUrl: product.productImageUrl,
        },
      ]
    })
  }

  const removeFromCart = (branchProductId: number) => {
    setCart((prev) => {
      return prev.reduce((acc, item) => {
        if (item.branchProductId === branchProductId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[])
    })
  }

  const toggleFavorite = (branchProductId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(branchProductId)) {
        newFavorites.delete(branchProductId)
      } else {
        newFavorites.add(branchProductId)
      }
      return newFavorites
    })
  }

  const getCartItemQuantity = (branchProductId: number): number => {
    const item = cart.find((item) => item.branchProductId === branchProductId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Filter categories and products
  const getFilteredCategories = (): MenuCategory[] => {
    if (!menuData?.categories) return []

    return menuData.categories
      .filter(
        (category) =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.products.some((product) => product.productName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }

  const getFilteredProducts = (products: MenuProduct[]): MenuProduct[] => {
    if (!searchTerm) return products
    return products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <div className="mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
              <div className="flex items-center justify-center space-x-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse animation-delay-100" />
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse animation-delay-200" />
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
              {t('menu.loading')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {t('menu.loadingSubtitle')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-slate-900 dark:to-red-950/20 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{t('menu.error.title')}</h2>
            <p className="text-red-600 dark:text-red-400 mb-6 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('menu.error.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!menuData) return null

  const filteredCategories = getFilteredCategories()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Modern Header with Glassmorphism */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl mr-2 font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  {menuData.restaurantName}
                </h1>
                
                <div className="flex items-center space-x-2 mt-1 mr-2">
                  <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <MapPin className="h-3 w-3" />
                    <p className="text-xs font-medium">{menuData.branchName}</p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm mr-2${
                    menuData.isOpen 
                      ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                      : "bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ml-2 ${menuData.isOpen ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                    <span className="text-xs font-semibold">{menuData.isOpen ? t('menu.open') : t('menu.closed')}</span>
                    
                  </div>
                </div>
              </div>
              
            </div>

            <div className="flex items-center space-x-4">
              <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-gradient-to-r ml-2 from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </button>
              <LanguageSelector variant="header" />

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg" />
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder={t('menu.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border-0 rounded-2xl focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm font-medium outline-none"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
                  <Filter className="h-3 w-3 text-white" />
                </div>
                {t('menu.categories')}
              </h3>
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryId)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedCategory === category.categoryId
                        ? "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                        : "bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 text-slate-700 dark:text-slate-300 hover:shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{category.categoryName}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                          selectedCategory === category.categoryId
                            ? "bg-white/20 text-white"
                            : "bg-slate-200/50 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {category.products.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Products Grid */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div>
                {/* Enhanced Category Header */}
                {(() => {
                  const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                  return currentCategory ? (
                    <div className="mb-8">
                      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 rounded-2xl p-6 text-white text-center shadow-lg">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                          }} />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4 shadow-lg">
                            <Sparkles className="h-7 w-7 animate-pulse" />
                          </div>
                          <h2 className="text-2xl font-bold mb-2">{currentCategory.categoryName}</h2>
                          <p className="text-orange-100 text-sm">
                            {products.length} {t('menu.deliciousItems')} {products.length === 1 ? t('menu.item') : t('menu.items')} {t('menu.available')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(() => {
                    const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                    const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                    return products.map((product) => (
                      <div
                        key={product.branchProductId}
                        className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1 hover:rotate-1"
                      >
                        {/* Enhanced Product Image */}
                        <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex-shrink-0 overflow-hidden">
                          {product.productImageUrl ? (
                            <img
                              src={product.productImageUrl || "/placeholder.svg"}
                              alt={product.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                            </div>
                          )}

                          {/* Enhanced Badges */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {product.isRecommended && (
                              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg backdrop-blur-sm">
                                <Award className="h-2 w-2 mr-1" />
                                {t('menu.chefsChoice')}
                              </span>
                            )}
                          </div>

                          {/* Enhanced Favorite Button */}
                          <div className="absolute top-2 right-2">
                            <button 
                              onClick={() => toggleFavorite(product.branchProductId)}
                              className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            >
                              <Heart className={`h-3 w-3 transition-colors ${
                                favorites.has(product.branchProductId) 
                                  ? 'text-red-500 fill-current' 
                                  : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
                              }`} />
                            </button>
                          </div>

                          {/* Enhanced Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Enhanced Product Info */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {product.productName}
                            </h3>

                            {product.productDescription && (
                              <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed text-sm">
                                {product.productDescription}
                              </p>
                            )}
                          </div>

                          {/* Enhanced Allergens */}
                          <div className="mb-3 min-h-[50px] flex flex-col justify-start">
                            {product.allergens && product.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {product.allergens.slice(0, 2).map((allergen) => (
                                  <span
                                    key={allergen.allergenId}
                                    className="inline-flex items-center text-xs bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm shadow-sm"
                                    title={allergen.name}
                                  >
                                    <span className="mr-1 text-sm">{allergen.icon}</span>
                                    {allergen.code}
                                  </span>
                                ))}
                                {product.allergens.length > 2 && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                                    +{product.allergens.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Enhanced Ingredients */}
                          <div className="mb-3 min-h-[50px] flex flex-col justify-start">
                            {product.ingredients && product.ingredients.length > 0 && (
                              <>
                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                  <Utensils className="h-3 w-3 mr-1 text-orange-500" />
                                  {t('menu.ingredients')}
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {product.ingredients.slice(0, 2).map((ingredient) => (
                                    <span
                                      key={ingredient.ingredientId}
                                      className="inline-flex items-center text-xs bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm"
                                      title={ingredient.ingredientName}
                                    >
                                      {ingredient.ingredientName}
                                    </span>
                                  ))}
                                  {product.ingredients.length > 2 && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                                      +{product.ingredients.length - 2}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Enhanced Price and Actions */}
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Enhanced Add to Cart Controls */}
                            <div className="flex items-center space-x-2">
                              {getCartItemQuantity(product.branchProductId) > 0 ? (
                                <div className="flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-1 border border-slate-200/50 dark:border-slate-600/50">
                                  <button
                                    onClick={() => removeFromCart(product.branchProductId)}
                                    className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                                    {getCartItemQuantity(product.branchProductId)}
                                  </span>
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="w-7 h-7 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-3 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span className="text-xs">{t('menu.add')}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Enhanced Empty State for Category */}
                {(() => {
                  const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                  return (
                    products.length === 0 && (
                      <div className="text-center py-12">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-10 max-w-md mx-auto border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Coffee className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                            {searchTerm ? t('menu.noResults') : t('menu.noItemsCategory')}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {searchTerm ? t('menu.noResultsDesc') : t('menu.noItemsCategoryDesc')}
                          </p>
                        </div>
                      </div>
                    )
                  )
                })()}
              </div>
            ) : (
              /* Enhanced Welcome State */
              <div className="text-center py-12">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-10 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <UtensilsCrossed className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    {menuData.restaurantName} {t('menu.title')}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
                    {t('menu.selectCategory')}
                  </p>
                  {filteredCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategory(filteredCategories[0].categoryId)}
                      className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-sm transform hover:scale-105"
                    >
                      {t('menu.exploreMenu')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
          <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('menu.cart.title')}
                </h3>
                <button 
                  onClick={() => setShowCart(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.branchProductId} className="flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                        {item.productImageUrl && (
                          <img
                            src={item.productImageUrl || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg shadow-md"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{item.productName}</h4>
                          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-700/50 rounded-lg p-1">
                          <button
                            onClick={() => removeFromCart(item.branchProductId)}
                            className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-100 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const product = menuData?.categories
                                .flatMap((cat) => cat.products)
                                .find((p) => p.branchProductId === item.branchProductId)
                              if (product) {
                                addToCart(product)
                              }
                            }}
                            className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('menu.cart.total')}</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                      {t('menu.cart.placeOrder')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">{t('menu.cart.empty')}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{t('menu.cart.emptyDesc')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  )
}

export default MenuComponent