import { useEffect, useState } from 'react';
import { CalendarClock, CalendarX, Radio } from 'lucide-react';
import { getScheduleStatus } from '@/utils/helpers';
import { cn } from '@/lib/utils';



const SCHEDULE_CONFIG = {
  scheduled: {
    label: 'Scheduled',
    icon: CalendarClock,
    classes: [
      'bg-orange-50 text-orange-900 border border-orange-200',
      'dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    ].join(' '),
    dot: 'bg-orange-500 dark:bg-orange-400',
    pulse: true,    // ← pulsing dot so it draws the eye
  },
  active: {
    label: 'Active',
    icon: Radio,
    classes: [
      'bg-green-50 text-green-900 border border-green-200',
      'dark:bg-green-950/60 dark:text-green-300 dark:border-green-800',
    ].join(' '),
    dot: 'bg-green-500 dark:bg-green-400',
    pulse: true,
  },
  expired: {
    label: 'Expired',
    icon: CalendarX,
    classes: [
      'bg-zinc-100 text-zinc-600 border border-zinc-300',
      'dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-700',
    ].join(' '),
    dot: 'bg-zinc-400 dark:bg-zinc-600',
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
