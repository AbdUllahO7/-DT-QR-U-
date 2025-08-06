import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useClickOutside } from '../../../hooks';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SearchResult {
  id: string;
  type: 'product' | 'order' | 'branch' | 'customer';
  title: string;
  description: string;
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onResultClick: (result: SearchResult) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onResultClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();

  useClickOutside(searchRef, () => setIsSearchOpen(false));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);

    if (query.trim()) {
      setIsSearching(true);
      // Simüle edilmiş arama gecikmesi
      setTimeout(() => {
        onSearch(query);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="relative" ref={searchRef} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={handleSearchChange}
          className={`w-64 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
        <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
          isRTL ? 'right-3' : 'left-3'
        }`} />
      </div>

      {/* Search Results Dropdown */}
      {isSearchOpen && (
        <div className={`absolute top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${
          isRTL ? 'right-0 left-0' : 'left-0 right-0'
        }`}>
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 dark:border-gray-600 border-t-primary-600"></div>
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-500 dark:text-gray-400`}>
                {t('search.searching')}
              </span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onResultClick(result);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className={`w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className="flex-shrink-0">
                      {result.type === 'product' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      {result.type === 'order' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      {result.type === 'branch' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                      {result.type === 'customer' && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                    </div>
                    <div className={`flex-1 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {result.description}
                      </p>
                    </div>
                    <div className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        result.type === 'product' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        result.type === 'order' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        result.type === 'branch' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                      }`}>
                        {result.type === 'product' ? t('search.types.product') :
                         result.type === 'order' ? t('search.types.order') :
                         result.type === 'branch' ? t('search.types.branch') : t('search.types.customer')}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('search.noResults')}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBox; 