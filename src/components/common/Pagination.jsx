import { useMemo } from 'react';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

const buildPages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const pages = useMemo(
    () => buildPages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  if (!totalPages || totalPages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 mt-6 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(1)}
          disabled={isFirst}
          aria-label="First page"
          className={cn('px-2', isFirst && 'opacity-50 cursor-not-allowed')}
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(currentPage - 1)}
          disabled={isFirst}
          aria-label="Previous page"
          className={cn('px-2', isFirst && 'opacity-50 cursor-not-allowed')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-8 min-w-[2rem] items-center justify-center text-sm text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => goTo(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={cn(
                'min-w-[2rem] px-2',
                p === currentPage &&
                  'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              )}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(currentPage + 1)}
          disabled={isLast}
          aria-label="Next page"
          className={cn('px-2', isLast && 'opacity-50 cursor-not-allowed')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goTo(totalPages)}
          disabled={isLast}
          aria-label="Last page"
          className={cn('px-2', isLast && 'opacity-50 cursor-not-allowed')}
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export { Pagination };
export default Pagination;
