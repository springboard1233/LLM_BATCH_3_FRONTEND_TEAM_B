import { ChevronLeft, ChevronRight } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { isMobile } = useResponsive();
  
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = isMobile ? 3 : 7;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (isMobile) {
      // Mobile: Show current page and adjacent pages only
      if (currentPage === 1) {
        pages.push(1, 2, -1, totalPages);
      } else if (currentPage === totalPages) {
        pages.push(1, -1, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, currentPage, -1, totalPages);
      }
    } else {
      // Desktop: Show more pages
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-slate-800 border-t border-slate-700 ${
      isMobile ? 'flex-col gap-4' : 'flex-row'
    }`}>
      <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : ''}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center gap-1 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg transition-all text-sm min-h-[44px] ${
            isMobile ? 'flex-1 px-3' : 'px-4'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          {!isMobile && <span>Previous</span>}
        </button>

        <div className="flex items-center gap-2">
          {pages.map((page, index) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${index}`} className={`px-2 py-2 text-slate-500 ${isMobile ? 'text-xs' : ''}`}>
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isMobile ? 'px-3 py-2 min-w-[44px]' : 'px-4 py-2'
                } ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 active:bg-slate-500'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center gap-1 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg transition-all text-sm min-h-[44px] ${
            isMobile ? 'flex-1 px-3' : 'px-4'
          }`}
          aria-label="Next page"
        >
          {!isMobile && <span>Next</span>}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className={`text-sm text-slate-400 ${isMobile ? 'w-full text-center' : ''}`}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
