import { AlertCircle, Calendar, Timer } from 'lucide-react';

import { ImagePreview } from '@/components/common/ImagePreview';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScheduleBadge } from '@/components/common/ScheduleBadge';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

// Phase 2 spec — Math=blue, Science=green, English=purple, History=amber,
// Geography=teal, Art=pink, Other=gray
const getSubjectColorClasses = (subject) => {
  const map = {
    Mathematics:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Science:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    English:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    History:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Geography:
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    Art: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    Music:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Physical Education':
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Computer Science':
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    Biology:
      'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400',
  };
  return (
    map[subject] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  );
};

const ContentCard = ({ item }) => (
  <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    {/* Image with overlay badges */}
    <div className="relative">
      <ImagePreview
        src={item.fileUrl}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 left-2">
        <ScheduleBadge
          startTime={item.startTime}
          endTime={item.endTime}
        />
      </div>
      <div className="absolute top-2 right-2">
        <StatusBadge status={item.status} />
      </div>
    </div>

    {/* Body */}
    <div className="p-4 space-y-3">
      <h3
        className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1"
        title={item.title}
      >
        {item.title}
      </h3>

      <span
        className={cn(
          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
          getSubjectColorClasses(item.subject)
        )}
      >
        {item.subject}
      </span>

      <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {formatDate(item.startTime)} → {formatDate(item.endTime)}
        </span>
      </div>

      {item.rotationDuration && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Rotates every {item.rotationDuration}s</span>
        </div>
      )}

      {item.status === 'rejected' && item.rejectionReason && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-2">
          <AlertCircle
            className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">Reason:</span>{' '}
            {item.rejectionReason}
          </p>
        </div>
      )}
    </div>
  </article>
);

export { ContentCard, getSubjectColorClasses };
export default ContentCard;
