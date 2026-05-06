import { cn } from '@/lib/utils';

const PageHeader = ({ title, subtitle, action, className }) => (
  <div
    className={cn(
      'flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-6',
      className
    )}
  >
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
    {action && (
      <div className="flex shrink-0 items-center gap-2">{action}</div>
    )}
  </div>
);

export { PageHeader };
export default PageHeader;
