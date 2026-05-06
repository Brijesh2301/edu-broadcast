import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { ImagePreview } from '@/components/common/ImagePreview';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getSubjectColorClasses } from '@/components/teacher/ContentCard';
import RejectionModal from '@/components/principal/RejectionModal';
import PendingRowActions from '@/components/principal/PendingRowActions';

import { useAllContents, useContentStats } from '@/hooks/useContent';
import { useApproveContent } from '@/hooks/useApproval';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const COLOR_SCHEMES = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
  },
};

const StatCard = ({ title, value, icon: Icon, colorScheme = 'blue' }) => {
  const scheme = COLOR_SCHEMES[colorScheme];
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {value}
          </p>
        </div>
        <div className={cn('p-3 rounded-full', scheme.bg)}>
          <Icon className={cn('h-5 w-5', scheme.text)} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
};

const PrincipalDashboard = () => {
  const {
    data: allContents = [],
    isLoading,
    isError,
    refetch,
  } = useAllContents();

  const stats = useContentStats(allContents);
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
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
    [allContents]
  );

  const handleApprove = async (item) => {
    setApprovingId(item.id);
    try {
      await approve(item.id);
      toast.success('Content approved successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to approve content');
    } finally {
      setApprovingId(null);
    }
  };

  const openRejectModal = (item) => {
    setRejectionModal({ isOpen: true, contentId: item.id });
  };

  const closeRejectModal = () =>
    setRejectionModal({ isOpen: false, contentId: null });

  // Loading
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Principal Dashboard"
          subtitle="Monitor school-wide broadcast activity"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-32" />
          ))}
        </div>
        <PageHeader title="Pending Approvals" />
        <SkeletonTable rows={10} cols={7} />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div>
        <PageHeader
          title="Principal Dashboard"
          subtitle="Monitor school-wide broadcast activity"
        />
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Principal Dashboard"
        subtitle="Monitor school-wide broadcast activity"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Content"
          value={stats.total}
          icon={FileText}
          colorScheme="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          colorScheme="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          colorScheme="red"
        />
      </div>

      {/* Pending approvals table */}
      <PageHeader
        title="Pending Approvals"
        subtitle={
          pendingContents.length > 0
            ? `Showing ${pendingContents.length} of ${stats.pending}`
            : null
        }
        action={
          stats.pending > 0 && (
            <Link
              to="/principal/pending"
              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              View All
            </Link>
          )
        }
      />

      {pendingContents.length === 0 ? (
        <Card className="overflow-hidden">
          <EmptyState
            icon={CheckCircle}
            title="All caught up!"
            description="No content pending approval"
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingContents.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-20">
                    <ImagePreview
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <p
                      className="font-medium text-gray-900 dark:text-gray-100 max-w-[180px] truncate"
                      title={item.title}
                    >
                      {item.title}
                    </p>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {item.teacherName}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getSubjectColorClasses(item.subject)
                      )}
                    >
                      {item.subject}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <PendingRowActions
                        onApprove={() => handleApprove(item)}
                        onReject={() => openRejectModal(item)}
                        isApproving={approvingId === item.id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        contentId={rejectionModal.contentId}
        onClose={closeRejectModal}
        onSuccess={() => toast.success('Content rejected')}
      />
    </div>
  );
};

export default PrincipalDashboard;
