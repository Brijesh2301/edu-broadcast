import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Loader2,
  Timer,
  User,
  XCircle,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImagePreview } from '@/components/common/ImagePreview';
import { ScheduleBadge } from '@/components/common/ScheduleBadge';
import { Button } from '@/components/common/Button';

import { getSubjectColorClasses } from '@/components/teacher/ContentCard';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const ApprovalCard = ({ item, onApprove, onReject, isApproving = false }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        {/* Image */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Preview ${item.title}`}
          >
            <ImagePreview
              src={item.fileUrl}
              alt={item.title}
              className="w-full h-52 object-cover cursor-pointer"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-sm font-medium">
                Click to preview
              </span>
            </div>
          </button>

          {/* Subject badge bottom-left */}
          <span
            className={cn(
              'absolute bottom-2 left-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm',
              getSubjectColorClasses(item.subject)
            )}
          >
            {item.subject}
          </span>

          {/* Schedule badge top-right */}
          <div className="absolute top-2 right-2">
            <ScheduleBadge
              startTime={item.startTime}
              endTime={item.endTime}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-1">
          <h3
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2"
            title={item.title}
          >
            {item.title}
          </h3>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.teacherName}</span>
            </div>
            <div className="flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Calendar
                className="h-4 w-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
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
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-green-600/20"
          >
            {isApproving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Approve
              </>
            )}
          </button>
          <Button
            type="button"
            variant="outline"
            onClick={onReject}
            disabled={isApproving}
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </article>

      {/* Full-size preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-gray-800">
          <DialogTitle className="sr-only">{item.title}</DialogTitle>
          <div className="bg-black flex items-center justify-center">
            <img
              src={item.fileUrl}
              alt={item.title}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {item.subject} • {item.teacherName}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ApprovalCard };
export default ApprovalCard;
