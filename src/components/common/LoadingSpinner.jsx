import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const LoadingSpinner = ({ size = 'md', label = 'Loading…', className, fullscreen = false }) => {
  const wrapperClass = fullscreen
    ? 'flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'
    : 'flex items-center justify-center py-10';

  return (
    <div className={cn(wrapperClass, className)} role="status" aria-live="polite">
      <Loader2
        className={cn(
          'animate-spin text-blue-600 dark:text-blue-400',
          SIZE_MAP[size] || SIZE_MAP.md
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;
