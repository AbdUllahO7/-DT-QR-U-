import React, { useState, useEffect, useRef } from 'react';
// Import useLocation here
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
// Reverting imports to not use .jsx extension, as in your original file
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth, useScrollSpy } from '../../hooks';
import { useLanguage } from '../../contexts/LanguageContext';
import { NavItem } from '../../types';
import LanguageSelector from '../LanguageSelector';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const isHomePage = location.pathname === '/'; // Check if we are on the home page

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { isDark, toggleTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, checkAuth, clearAuth } = useAuth();

  // Ref for the header element to detect clicks outside
  const headerRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    { id: 'home', label: t('nav.home'), href: '#hero' },
    { id: 'features', label: t('nav.features'), href: '#features' },
    { id: 'pricing', label: t('nav.pricing'), href: '#pricing' },
    { id: 'testimonials', label: t('nav.testimonials'), href: '#testimonials' },
    { id: 'faq', label: t('nav.faq'), href: '#faq' },
    { id: 'contact', label: t('nav.contact'), href: '#contact' },
  ];

  // Only activate scroll spy if on the home page
  const activeSection = useScrollSpy(
    isHomePage ? navItems.map(item => item.id) : [],
    100
  );


  useEffect(() => {
    if (location.hash && isHomePage) {
      const id = location.hash.substring(1);

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isHomePage, location.hash]);


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

  // Close mobile menu when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNavClick = (href: string): void => {
    setIsOpen(false); // Close mobile menu regardless

    navigate(`/${href}`);
  };

  const handleLogin = (): void => {
    setIsOpen(false); // Close mobile menu

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
    setIsOpen(false); // Close mobile menu
    navigate('/register');
  };

  const handleGoToPanel = (): void => {
    setIsOpen(false); // Close mobile menu
    navigate('/dashboard');
  };

  const handleLogout = (): void => {
    setIsOpen(false); // Close mobile menu
    clearAuth();
    navigate('/', { replace: true });
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <nav className="container-max w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <img
              src="/assets/logos/iDiGiTeK-Logo-iDT-.png"
              alt="iDiGiTeK Logo"
              className="h-8 w-auto"
            />
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
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-800 dark:hover:text-primary-800 ${
                  // Only show active section highlighting on the home page
                  activeSection === item.id && isHomePage
                    ? 'text-primary-800 dark:text-primary-800'
                    : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons, Language Selector, Theme Toggle & Mobile Menu */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'}`}>
            {/* Auth Buttons - Always visible (compact on mobile, full on desktop) */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'}`}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleGoToPanel}
                    className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-800 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'}`}
                    aria-label={t('nav.goToPanel')}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('nav.goToPanel')}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'}`}
                    aria-label={t('auth.logout')}
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className={`flex items-center text-white px-2 bg-primary-800 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'}`}
                    aria-label={t('auth.login')}
                  >
                    <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('nav.login')}</span>
                  </button>

                  <button
                    onClick={handleRegister}
                    className={`flex dark:text-white items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary-700 hover:text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'}`}
                    aria-label={t('auth.register')}
                  >
                    <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('nav.register')}</span>
                  </button>
                </>
              )}
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={t('accessibility.theme')}
              title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
            >
              {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={t('accessibility.menu')}
            >
              {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Shows nav links and auth buttons */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`px-4 py-2 ${isRTL ? 'space-y-1' : 'space-y-1'}`}>
              {(isRTL ? [...navItems].reverse() : navItems).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    // Only show active section highlighting on the home page
                    activeSection === item.id && isHomePage
                      ? 'text-primary-800 dark:text-primary-800 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleGoToPanel}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-primary-800 hover:bg-primary-700 text-white transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{t('nav.goToPanel')}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-3 py-2 mt-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className={`flex items-center text-white w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t('nav.login')}</span>
                    </button>

                    <button
                      onClick={handleRegister}
                      className={`flex items-center w-full px-3 py-2 mt-1 rounded-md text-sm font-medium text-primary-800 hover:bg-primary-700 text-primary transition-colors duration-200 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{t('nav.register')}</span>
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