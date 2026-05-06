import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
          {Array.from({ length: cols }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {Array.from({ length: cols }).map((_, colIdx) =>
              colIdx === 0 ? (
                <TableCell key={colIdx}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
              ) : (
                <TableCell key={colIdx}>
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export { SkeletonTable };
export default SkeletonTable;
