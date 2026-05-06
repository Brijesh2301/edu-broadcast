import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  FileText,
  Upload as UploadIcon,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ErrorState } from '@/components/common/ErrorState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { Card } from '@/components/ui/card';

import { useTeacherContents, useContentStats } from '@/hooks/useContent';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

import MyContentTable from '@/components/teacher/MyContentTable';

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

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId || user?.id;

  const {
    data: contents = [],
    isLoading,
    isError,
    refetch,
  } = useTeacherContents(teacherId);

  const stats = useContentStats(contents);

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title={`Welcome, ${user?.name?.split(' ')[1] || user?.name || 'Teacher'}`}
          subtitle="Track your broadcasts and uploads"
          action={
            <Link
              to="/teacher/upload"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              <UploadIcon className="h-4 w-4" />
              Upload Content
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-32" />
          ))}
        </div>
        <PageHeader title="Recent Uploads" />
        <SkeletonTable rows={5} cols={5} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <PageHeader
          title={`Welcome, ${user?.name || 'Teacher'}`}
          subtitle="Track your broadcasts and uploads"
        />
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Recent uploads = last 5, newest first
  const recent = [...contents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[1] || user?.name || 'Teacher'}`}
        subtitle="Track your broadcasts and uploads"
        action={
          <Link
            to="/teacher/upload"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <UploadIcon className="h-4 w-4" />
            Upload Content
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Uploaded"
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

      {/* Recent Uploads */}
      <PageHeader title="Recent Uploads" />
      <MyContentTable contents={recent} isLoading={false} />
    </div>
  );
};

export default TeacherDashboard;
