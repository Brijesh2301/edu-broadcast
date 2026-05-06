import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';

import ApprovalCard from '@/components/principal/ApprovalCard';
import RejectionModal from '@/components/principal/RejectionModal';

import { useAllContents } from '@/hooks/useContent';
import { useApproveContent } from '@/hooks/useApproval';

const PendingApprovals = () => {
  const {
    data: allContents = [],
    isLoading,
    isError,
    refetch,
  } = useAllContents();

  const { mutateAsync: approve } = useApproveContent();

  const [approvingId, setApprovingId] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    contentId: null,
  });

  const pendingContents = useMemo(
    () =>
      [...allContents]
        .filter((item) => item.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [allContents]
  );

  const handleApprove = async (item) => {
    setApprovingId(item.id);
    try {
      await approve(item.id);
      toast.success('Content approved!');
    } catch (err) {
      toast.error(err?.message || 'Failed to approve content');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (item) =>
    setRejectionModal({ isOpen: true, contentId: item.id });

  const closeRejectModal = () =>
    setRejectionModal({ isOpen: false, contentId: null });

  // Loading
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Pending Approvals"
          subtitle="Loading..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div>
        <PageHeader
          title="Pending Approvals"
          subtitle="Review submitted content"
        />
        <ErrorState
          message="Failed to load pending approvals"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty
  if (pendingContents.length === 0) {
    return (
      <div>
        <PageHeader
          title="Pending Approvals"
          subtitle="Review submitted content"
        />
        <EmptyState
          icon={CheckCircle2}
          title="All caught up!"
          description="There are no pending approvals at this time. All submissions have been reviewed."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        subtitle={`${pendingContents.length} item${
          pendingContents.length !== 1 ? 's' : ''
        } awaiting review`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingContents.map((item) => (
          <ApprovalCard
            key={item.id}
            item={item}
            onApprove={() => handleApprove(item)}
            onReject={() => handleReject(item)}
            isApproving={approvingId === item.id}
          />
        ))}
      </div>

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        contentId={rejectionModal.contentId}
        onClose={closeRejectModal}
        onSuccess={() => toast.success('Content rejected successfully!')}
      />
    </div>
  );
};

export default PendingApprovals;
