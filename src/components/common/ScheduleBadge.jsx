import { useEffect, useState } from 'react';
import { CalendarClock, CalendarX, Radio } from 'lucide-react';
import { getScheduleStatus } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const SCHEDULE_CONFIG = {
  scheduled: {
    label: 'Scheduled',
    icon: CalendarClock,
    classes:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    pulse: false,
  },
  active: {
    label: 'Active',
    icon: Radio,
    classes:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pulse: true,
  },
  expired: {
    label: 'Expired',
    icon: CalendarX,
    classes:
      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    pulse: false,
  },
};

const ScheduleBadge = ({ startTime, endTime, className }) => {
  const [status, setStatus] = useState(() =>
    getScheduleStatus(startTime, endTime)
  );

  // Re-evaluate periodically so 'scheduled' rolls into 'active' and 'active'
  // rolls into 'expired' without a page refresh.
  useEffect(() => {
    setStatus(getScheduleStatus(startTime, endTime));
    const interval = setInterval(() => {
      setStatus(getScheduleStatus(startTime, endTime));
    }, 30_000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const config = SCHEDULE_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.classes,
        className
      )}
    >
      {config.pulse ? (
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
      ) : (
        <Icon className="h-3 w-3" aria-hidden="true" />
      )}
      {config.label}
    </span>
  );
};

export { ScheduleBadge };
export default ScheduleBadge;
