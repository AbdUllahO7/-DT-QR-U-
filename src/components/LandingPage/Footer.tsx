import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [showPhoneMenu, setShowPhoneMenu] = useState(false);
  const phoneMenuRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  const rawPhoneNumber = t('footer.contact.phone');
  const cleanPhoneNumber = rawPhoneNumber.replace(/[^\d+]/g, '');
  
  const address = t('footer.contact.address');
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneMenuRef.current && !phoneMenuRef.current.contains(event.target as Node)) {
        setShowPhoneMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const footerLinks = {
    product: [
      { label: t('footer.sections.product.links.features'), href: '#features' },
      { label: t('footer.sections.product.links.pricing'), href: '#pricing' },
      { label: t('footer.sections.product.links.demo'), href: '#contact' },
    ],
    company: [
      { label: t('footer.sections.company.links.about'), href: '#testimonials' },
      { label: t('footer.sections.company.links.pricing'), href: '#pricing' },
      { label: t('footer.sections.company.links.contact'), href: '#contact' }
    ],
    support: [
      { label: t('footer.sections.support.links.faq'), href: '#faq' },

    ],
  
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const handleLinkClick = (href: string): void => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} mb-6`}>
              <QrCode className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">{t('brand.name')}</span>
            </div>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {/* Phone Interaction */}
              <div className="relative" ref={phoneMenuRef}>
                <button 
                  onClick={() => setShowPhoneMenu(!showPhoneMenu)}
                  className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} group hover:text-primary-400 transition-colors duration-200`}
                >
                  <Phone className="h-4 w-4 text-primary-400 group-hover:text-primary-300" />
                  <span dir='ltr' className="text-gray-400 group-hover:text-primary-400">{rawPhoneNumber}</span>
                </button>

                {/* Phone Options Dropdown (Opens Upwards) */}
                {showPhoneMenu && (
                  <div className={`absolute bottom-full mb-2 ${isRTL ? 'right-0' : 'left-0'} w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50`}>
                    <a 
                      href={`tel:${cleanPhoneNumber}`}
                      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors space-x-3 rtl:space-x-reverse"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Call</span>
                    </a>
                    <a 
                      href={`https://wa.me/${cleanPhoneNumber}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors space-x-3 rtl:space-x-reverse"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Email Link */}
              <div>
                <a 
                  href={`mailto:${t('footer.contact.email')}`}
                  className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} group hover:text-primary-400 transition-colors duration-200`}
                >
                  <Mail className="h-4 w-4 text-primary-400 group-hover:text-primary-300" />
                  <span className="text-gray-400 group-hover:text-primary-400">{t('footer.contact.email')}</span>
                </a>
              </div>

              {/* Address Link (Click to Map) */}
              <div>
                <a 
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} group hover:text-primary-400 transition-colors duration-200`}
                >
                  <MapPin className="h-4 w-4 text-primary-400 group-hover:text-primary-300" />
                  <span className="text-gray-400 group-hover:text-primary-400">{address}</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''} mt-6`}>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.product.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.company.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.support.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Legal Links */}
            <h3 className="text-lg font-semibold mb-6 mt-8">{t('footer.sections.legal.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('footer.sections.legal.links.terms')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('footer.sections.legal.links.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container-max py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} {t('brand.name')}. {t('footer.bottom.copyright')}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{t('footer.bottom.madeWith')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;