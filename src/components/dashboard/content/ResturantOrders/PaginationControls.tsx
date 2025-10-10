import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationState } from '../../../../types/Orders/type';

interface PaginationControlsProps {
  pagination: PaginationState;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  t: (key: string) => string;
}
const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  t
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t("ordersManager.showing")} {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} {t("ordersManager.to")} {' '}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} {t("ordersManager.of")} {' '}
          {pagination.totalItems} {t("ordersManager.orders")} 
        </div>
        
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400"> {t("ordersManager.showing")}:</span>
          <select
            title='pagination'
            value={pagination.itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("ordersManager.perpage")}</span>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
          className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {(() => {
            const totalPages = pagination.totalPages;
            const currentPage = pagination.currentPage;
            const pages = [];
            
            // Always show first page
            if (totalPages > 0) {
              pages.push(1);
            }

            // Add ellipsis and current page area
            if (currentPage > 3) {
              pages.push('...');
            }

            // Show current page and surrounding pages
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
              if (!pages.includes(i)) {
                pages.push(i);
              }
            }

            // Add ellipsis and last page
            if (currentPage < totalPages - 2) {
              if (!pages.includes('...')) {
                pages.push('...');
              }
            }

            if (totalPages > 1 && !pages.includes(totalPages)) {
              pages.push(totalPages);
            }

            return pages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={typeof page !== 'number'}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : typeof page === 'number'
                    ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    : 'text-gray-400 dark:text-gray-500 cursor-default'
                }`}
              >
                {page}
              </button>
            ));
          })()}
        </div>

        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
          className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;