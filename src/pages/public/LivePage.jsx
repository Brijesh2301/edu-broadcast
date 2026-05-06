import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  MonitorOff,
  RadioTower,
  RefreshCw,
  Timer,
  User,
} from 'lucide-react';

import { ErrorState } from '@/components/common/ErrorState';
import { ImagePreview } from '@/components/common/ImagePreview';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { getSubjectColorClasses } from '@/components/teacher/ContentCard';

import { useLiveContent } from '@/hooks/useContent';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const PollingStatus = ({ secondsAgo }) => (
  <div className="flex flex-col items-end text-right">
    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <RefreshCw className="h-3 w-3" aria-hidden="true" />
      <span>Last updated: {secondsAgo}s ago</span>
    </div>
    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
      Auto-refreshes every 30 seconds
    </p>
  </div>
);

const LiveBadge = () => (
  <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
    <span className="relative flex h-2 w-2 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
    </span>
    LIVE
  </span>
);

const LoadingSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto px-4 py-8">
    <Skeleton className="h-[400px] w-full rounded-xl" />
    <Skeleton className="h-8 w-64 mt-6" />
    <Skeleton className="h-5 w-24 mt-3" />
    <Skeleton className="h-4 w-96 mt-3" />
  </div>
);

const EmptyBroadcast = ({ teacherId }) => (
  <div className="max-w-md mx-auto text-center py-24 px-4">
    <MonitorOff
      className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6"
      aria-hidden="true"
    />
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      No Content Broadcasting
    </h2>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      No content is currently live for this channel.
    </p>
    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
      Check back later or contact your teacher.
    </p>

    <div className="my-8 h-px bg-gray-200 dark:bg-gray-700" />

    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
      Channel ID: {teacherId}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1 justify-center">
      <RefreshCw className="h-3 w-3" aria-hidden="true" />
      This page checks for new content every 30 seconds
    </p>
  </div>
);

const ActiveBroadcast = ({ item, secondsAgo }) => (
  <div className="max-w-4xl w-full mx-auto px-4 py-8">
    {/* LIVE strip */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span
          className="animate-pulse w-3 h-3 rounded-full bg-red-500"
          aria-hidden="true"
        />
        <span className="font-bold text-red-600 dark:text-red-400 tracking-wider">
          LIVE
        </span>
      </div>
      <PollingStatus secondsAgo={secondsAgo} />
    </div>

    {/* Content card */}
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ImagePreview
          src={item.fileUrl}
          alt={item.title}
          className="w-full max-h-[500px] object-contain"
        />
      </div>

      <div className="p-6 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
              getSubjectColorClasses(item.subject)
            )}
          >
            {item.subject}
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">
            Active
          </span>
        </div>

        {item.description && (
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start gap-2">
          <Calendar
            className="h-4 w-4 mt-0.5 text-gray-500 dark:text-gray-400 shrink-0"
            aria-hidden="true"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Broadcasting:
            </p>
            <p className="mt-0.5">
              {formatDate(item.startTime)} → {formatDate(item.endTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <User className="h-4 w-4" aria-hidden="true" />
          <span>Presented by {item.teacherName}</span>
        </div>

        {item.rotationDuration && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Content rotates every {item.rotationDuration} seconds
            </span>
          </div>
        )}
      </div>
    </article>

    <p className="text-center mt-6 text-xs text-gray-300 dark:text-gray-600">
      Powered by EduBroadcast
    </p>
  </div>
);

const LivePage = () => {
  const { teacherId } = useParams();

  const {
    data: liveContents = [],
    isLoading,
    isError,
    refetch,
    dataUpdatedAt,
  } = useLiveContent(teacherId);

  const activeContent = liveContents[0] || null;

  // Polling countdown — counts up each second since last successful fetch
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!dataUpdatedAt) return undefined;
    // Reset immediately when a new fetch lands
    setSecondsAgo(Math.floor((Date.now() - dataUpdatedAt) / 1000));
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - dataUpdatedAt) / 1000);
      setSecondsAgo(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/30">
              <RadioTower className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50">
              EduBroadcast
            </span>
            <LiveBadge />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <PollingStatus secondsAgo={secondsAgo} />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <div className="w-full max-w-md mx-auto">
            <ErrorState
              message="Unable to load broadcast content"
              onRetry={() => refetch()}
            />
          </div>
        ) : !activeContent ? (
          <EmptyBroadcast teacherId={teacherId} />
        ) : (
          <ActiveBroadcast
            item={activeContent}
            secondsAgo={secondsAgo}
          />
        )}
      </main>
    </div>
  );
};

export default LivePage;
