import { Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-6',
      className
    )}
  >
    <Icon
      className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
      aria-hidden="true"
    />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <Button onClick={onAction} className="mt-4">
        {actionLabel}
      </Button>
    )}
  </div>
);

export { EmptyState };
export default EmptyState;
