import { Inbox } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImagePreview } from '@/components/common/ImagePreview';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/utils/helpers';
import { getSubjectColorClasses } from './ContentCard';
import { cn } from '@/lib/utils';

const MyContentTable = ({ contents = [], isLoading = false }) => {
  if (isLoading) {
    return <SkeletonTable rows={5} cols={5} />;
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <EmptyState
          icon={Inbox}
          title="No uploads yet"
          description="Your latest uploads will appear here once you submit content."
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((item) => (
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
                  className="font-medium text-gray-900 dark:text-gray-100 max-w-[200px] truncate"
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
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(item.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { MyContentTable };
export default MyContentTable;
