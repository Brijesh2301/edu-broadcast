import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

// Re-export cn from lib/utils so Phase 2 components can import it from
// '@/utils/helpers' (its canonical location stays at '@/lib/utils').
export { cn } from '@/lib/utils';

/**
 * Format an ISO date string into a human-friendly format.
 * Example: "Jan 15, 2024, 2:30 PM"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '—';
  }
};

/**
 * Format date as "X minutes ago" / "2 hours ago" / etc.
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateString);
};

/**
 * Returns Tailwind color classes (bg + text + dark variants) for a subject.
 */
export const getSubjectColor = (subject) => {
  const map = {
    Mathematics:
      'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    Science:
      'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    English:
      'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
    History:
      'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    Geography:
      'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    Art: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
    Music:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    'Physical Education':
      'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
    'Computer Science':
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300',
    Biology:
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  };
  return (
    map[subject] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  );
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file type. Use JPEG, PNG, GIF, or WebP.',
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    const maxMb = Math.round(MAX_FILE_SIZE / (1024 * 1024));
    return {
      valid: false,
      error: `File is too large. Max size is ${maxMb}MB.`,
    };
  }
  return { valid: true, error: null };
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Returns one of: 'scheduled' | 'active' | 'expired'
 * - 'active'    — current time is between startTime and endTime
 * - 'scheduled' — startTime is in the future
 * - 'expired'   — endTime is in the past
 * Phase 2 components (ScheduleBadge, etc.) consume this.
 */
export const getScheduleStatus = (startTime, endTime) => {
  if (!startTime || !endTime) return 'scheduled';
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'scheduled';
  }
  if (now >= start && now <= end) return 'active';
  if (now < start) return 'scheduled';
  return 'expired';
};
