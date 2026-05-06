import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
        success:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        warning:
          'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        error:
          'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
        info:
          'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const Badge = ({ className, variant, children, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props}>
    {children}
  </span>
);

export { Badge, badgeVariants };
export default Badge;
