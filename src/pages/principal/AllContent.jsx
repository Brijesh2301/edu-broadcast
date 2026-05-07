import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { ImagePreview } from '@/components/common/ImagePreview';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScheduleBadge } from '@/components/common/ScheduleBadge';
import { Pagination } from '@/components/common/Pagination';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ContentFilters from '@/components/principal/ContentFilters';
import RejectionModal from '@/components/principal/RejectionModal';
import PendingRowActions from '@/components/principal/PendingRowActions';
import { getSubjectColorClasses } from '@/components/teacher/ContentCard';

import { useAllContents } from '@/hooks/useContent';
import { useApproveContent } from '@/hooks/useApproval';
import { useDebounce } from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const AllContent = () => {
  const {
    data: allContents = [],
    isLoading,
    isError,
    refetch,
  } = useAllContents();

  const { mutateAsync: approve } = useApproveContent();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    contentId: null,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  const filteredContents = useMemo(() => {
    return allContents
      .filter((item) => {
        if (statusFilter === 'all') return true;
        return item.status === statusFilter;
      })
      .filter((item) => {
        if (!debouncedSearch) return true;
        const q = debouncedSearch.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.teacherName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allContents, statusFilter, debouncedSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContents.length / ITEMS_PER_PAGE)
  );

  const paginatedContents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContents, currentPage]);

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

  const handleReset = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  // Loading
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="All Content"
          subtitle="Manage all uploaded content"
        />
        <SkeletonTable rows={10} cols={8} />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div>
        <PageHeader
          title="All Content"
          subtitle="Manage all uploaded content"
        />
        <ErrorState
          message="Failed to load content"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="All Content" subtitle="Manage all uploaded content" />

      <ContentFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={allContents.length}
        filteredCount={filteredContents.length}
        onReset={handleReset}
      />

      {filteredContents.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search or filter criteria"
          actionLabel="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                  <TableHead className="w-16">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-16">
                      <ImagePreview
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <p
                        className="font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate line-clamp-1"
                        title={item.title}
                      >
                        {item.title}
                      </p>
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
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {item.teacherName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <ScheduleBadge
                        startTime={item.startTime}
                        endTime={item.endTime}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(item.startTime)}
                    </TableCell>
                    <TableCell>
                      {item.status === 'pending' ? (
                        <div className="flex justify-end">
                          <PendingRowActions
                            onApprove={() => handleApprove(item)}
                            onReject={() =>
                              setRejectionModal({
                                isOpen: true,
                                contentId: item.id,
                              })
                            }
                            isApproving={approvingId === item.id}
                          />
                        </div>
                      ) : (
                        <span className="block text-right text-xs text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages} •{' '}
            {filteredContents.length} total{' '}
            {filteredContents.length === 1 ? 'result' : 'results'}
          </p>
        </>
      )}

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        contentId={rejectionModal.contentId}
        onClose={() =>
          setRejectionModal({ isOpen: false, contentId: null })
        }
        onSuccess={() => toast.success('Content rejected successfully!')}
      />
    </div>
  );
};

export default AllContent;


