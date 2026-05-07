import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import { useRejectContent } from '@/hooks/useApproval';
import { cn } from '@/lib/utils';

const rejectionSchema = z.object({
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be under 500 characters'),
});

const MAX_REASON = 500;

const RejectionModal = ({ isOpen, contentId, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { reason: '' },
    mode: 'onTouched',
  });

  const { mutateAsync, isPending } = useRejectContent();

  const reasonLen = (watch('reason') || '').length;
  const overWarning = reasonLen > 490;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onValid = async ({ reason }) => {
    // zod check for safety
    const parsed = rejectionSchema.safeParse({ reason });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    if (!contentId) {
      toast.error('No content selected');
      return;
    }
    try {
      await mutateAsync({ contentId, reason: parsed.data.reason });
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Failed to reject content');
      // Keep modal open on error
    }
  };

  const handleOpenChange = (open) => {
    // Don't allow ESC / outside click while submitting
    if (!open && !isPending) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Content</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejection. This will be shown to the
            teacher.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="mt-4" noValidate>
          <Textarea
            label="Rejection Reason *"
            rows={5}
            placeholder="Explain why this content is being rejected..."
            disabled={isPending}
            error={errors.reason?.message}
            maxLength={MAX_REASON + 50}
            {...register('reason', {
              required: 'Rejection reason is required',
              minLength: {
                value: 10,
                message: 'Reason must be at least 10 characters',
              },
              maxLength: {
                value: MAX_REASON,
                message: 'Reason must be under 500 characters',
              },
            })}
          />
          <p
            className={cn(
              'mt-1.5 text-right text-sm',
              overWarning
                ? 'text-red-500'
                : 'text-gray-400 dark:text-gray-500'
            )}
          >
            {reasonLen} / {MAX_REASON}
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Content'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { RejectionModal };
export default RejectionModal;
