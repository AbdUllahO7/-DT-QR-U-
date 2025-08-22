import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, QrCode, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth, useScrollSpy } from '../../hooks';
import { useLanguage } from '../../contexts/LanguageContext';
import { NavItem } from '../../types';
import LanguageSelector from '../LanguageSelector';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isDark, toggleTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, checkAuth, clearAuth } = useAuth();
  
  const navItems: NavItem[] = [
    { id: 'home', label: t('nav.home'), href: '#hero' },
    { id: 'features', label: t('nav.features'), href: '#features' },
    { id: 'pricing', label: t('nav.pricing'), href: '#pricing' },
    { id: 'testimonials', label: t('nav.testimonials'), href: '#testimonials' },
    { id: 'faq', label: t('nav.faq'), href: '#faq' },
    { id: 'contact', label: t('nav.contact'), href: '#contact' },
  ];
  
  const activeSection = useScrollSpy(navItems.map(item => item.id), 100);

  // Component mount olduğunda auth durumunu kontrol et
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogin = (): void => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry) {
      // Token'ın geçerlilik süresini kontrol et
      const expiryDate = new Date(tokenExpiry);
      if (!isNaN(expiryDate.getTime()) && expiryDate > new Date()) {
        // Token geçerliyse doğrudan selection screen'e yönlendir
        navigate('/selection');
        return;
      } else {
        // Token süresi dolmuşsa token'ı temizle
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userId');
      }
    }
    
    // Token yoksa veya geçersizse login sayfasına yönlendir
    navigate('/login');
  };

  const handleRegister = (): void => {
    navigate('/register');
  };

  const handleGoToPanel = (): void => {
    navigate('/selection');
  };

  const handleLogout = (): void => {
    clearAuth();
    navigate('/', { replace: true });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-max w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <QrCode className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('brand.name')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {(isRTL ? [...navItems].reverse() : navItems).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                  activeSection === item.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons, Language Selector, Theme Toggle & Mobile Menu */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            {/* Desktop Auth Buttons */}
            <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleGoToPanel}
                    className={`flex items-center px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    aria-label={t('nav.goToPanel')}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('nav.goToPanel')}</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    aria-label={t('auth.logout')}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    aria-label={t('auth.login')}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{t('nav.login')}</span>
                  </button>
                  
                  <button
                    onClick={handleRegister}
                    className={`flex items-center px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    aria-label={t('auth.register')}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{t('nav.register')}</span>
                  </button>
                </>
              )}
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={t('accessibility.theme')}
              title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={t('accessibility.menu')}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`px-4 py-2 ${isRTL ? 'space-y-1' : 'space-y-1'}`}>
              {(isRTL ? [...navItems].reverse() : navItems).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    activeSection === item.id
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleGoToPanel}
                      className={`flex items-center w-full px-3 py-2 mt-1 rounded-md text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{t('nav.goToPanel')}</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t('auth.login')}</span>
                    </button>
                    
                    <button
                      onClick={handleRegister}
                      className={`flex items-center w-full px-3 py-2 mt-1 rounded-md text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{t('auth.register')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 