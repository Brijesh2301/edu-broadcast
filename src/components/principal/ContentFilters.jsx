import { Search, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Select, SelectItem } from '@/components/ui/select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const ContentFilters = ({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const hasActiveFilters = statusFilter !== 'all' || searchQuery !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Search */}
        <div className="w-full sm:w-80">
          <Input
            type="search"
            placeholder="Search by title, subject, or teacher..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search content"
          />
        </div>

        {/* Status select */}
        <div className="w-full sm:w-40">
          <Select
            value={statusFilter}
            onValueChange={onStatusChange}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {filteredCount}
          </span>{' '}
          of {totalCount} items
        </p>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            aria-label="Reset filters"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export { ContentFilters };
export default ContentFilters;
