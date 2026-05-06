import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

/**
 * Compact approve/reject action buttons for table rows.
 * Approve has its own per-row loading via `isApproving`.
 * Reject opens an external modal — caller passes onReject.
 */
const PendingRowActions = ({
  onApprove,
  onReject,
  isApproving = false,
  disabled = false,
  size = 'sm',
}) => (
  <div className="flex items-center gap-2">
    <Button
      type="button"
      size={size}
      onClick={onApprove}
      disabled={isApproving || disabled}
      className={cn(
        'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm shadow-green-600/20',
        'dark:bg-green-600 dark:hover:bg-green-700'
      )}
    >
      {isApproving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Approving...
        </>
      ) : (
        <>
          <CheckCircle className="h-3.5 w-3.5" />
          Approve
        </>
      )}
    </Button>
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={onReject}
      disabled={isApproving || disabled}
      className={cn(
        'border-red-300 text-red-600 hover:bg-red-50',
        'dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20'
      )}
    >
      <XCircle className="h-3.5 w-3.5" />
      Reject
    </Button>
  </div>
);

export { PendingRowActions };
export default PendingRowActions;
