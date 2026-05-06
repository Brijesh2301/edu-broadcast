import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { SkeletonCard } from '@/components/common/SkeletonCard';

import ContentCard from '@/components/teacher/ContentCard';
import { useTeacherContents } from '@/hooks/useContent';
import { useAuth } from '@/hooks/useAuth';

const MyContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const teacherId = user?.teacherId || user?.id;

  const {
    data: contents = [],
    isLoading,
    isError,
    refetch,
  } = useTeacherContents(teacherId);

  // Loading
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="My Content"
          subtitle="All content you've submitted"
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
          title="My Content"
          subtitle="All content you've submitted"
        />
        <ErrorState
          message="Failed to load content"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty
  if (contents.length === 0) {
    return (
      <div>
        <PageHeader
          title="My Content"
          subtitle="All content you've submitted"
        />
        <EmptyState
          icon={FolderOpen}
          title="No content yet"
          description="Start sharing educational content with your students"
          actionLabel="Upload Content"
          onAction={() => navigate('/teacher/upload')}
        />
      </div>
    );
  }

  // Grid — newest first
  const sorted = [...contents].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <PageHeader
        title="My Content"
        subtitle={`${contents.length} ${
          contents.length === 1 ? 'item' : 'items'
        } total`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MyContent;
