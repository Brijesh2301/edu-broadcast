import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

const ErrorState = ({
  message = 'Something went wrong while loading.',
  onRetry,
  className,
}) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-6',
      className
    )}
  >
    <AlertCircle
      className="w-12 h-12 text-red-400 mb-4"
      aria-hidden="true"
    />
    <p className="text-gray-700 dark:text-gray-300 max-w-md">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    )}
  </div>
);

export { ErrorState };
export default ErrorState;
