"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Sparkles,
  UtensilsCrossed,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Phone,
  Mail,
  MapPin,
  Utensils,
  Zap,
  ArrowUp,
  Flame,
  Leaf,
  Truck,
  Shield,
  Users
} from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"

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
                <a  href="#" className="w-8 h-8 bg-slate-800/50 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-700 hover:border-blue-500 group">
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
                    <a href="#" className="text-slate-400 hover:text-white  duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform">
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
                    <a href="#" className="text-slate-400 hover:text-white  duration-200 text-sm hover:translate-x-1 inline-block transform transition-transform">
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

export default Footer