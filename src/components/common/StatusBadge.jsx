import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
pending: {
  label: 'Pending',
  icon: Clock,
  classes: 'bg-amber-100 text-amber-800 border border-amber-400 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-600',
},
approved: {
  label: 'Approved',
  icon: CheckCircle,
  classes: 'bg-green-100 text-green-800 border border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-600',
},
rejected: {
  label: 'Rejected',
  icon: XCircle,
  classes: 'bg-red-100 text-red-800 border border-red-400 dark:bg-red-900 dark:text-red-200 dark:border-red-600',
},
};

const StatusBadge = ({ status, className }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.classes,
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </span>
  );
};

export { StatusBadge };
export default StatusBadge;
