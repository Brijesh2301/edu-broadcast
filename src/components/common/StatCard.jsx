import { cn } from '@/lib/utils';

const COLOR_MAP = {
  blue: {
    iconBg:
      'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    accent: 'from-blue-500/10 to-transparent',
  },
  green: {
    iconBg:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    accent: 'from-emerald-500/10 to-transparent',
  },
  amber: {
    iconBg:
      'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    accent: 'from-amber-500/10 to-transparent',
  },
  red: {
    iconBg:
      'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
    accent: 'from-red-500/10 to-transparent',
  },
  purple: {
    iconBg:
      'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
    accent: 'from-purple-500/10 to-transparent',
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  loading = false,
  className,
}) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md',
        'dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
        className
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60',
          colors.accent
        )}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              {value}
            </p>
          )}
          {trend && !loading && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
              colors.iconBg
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export { StatCard };
export default StatCard;
