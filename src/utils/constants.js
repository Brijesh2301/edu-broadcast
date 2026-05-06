import { SUBJECTS } from '@/mocks/mockData';

export const AUTH_KEY = 'edubroadcast_auth';
export const THEME_KEY = 'edubroadcast_theme';

export const QUERY_KEYS = {
  ALL_CONTENTS: 'allContents',
  TEACHER_CONTENTS: 'teacherContents',
  LIVE_CONTENT: 'liveContent',
};

export const ITEMS_PER_PAGE = 10;

export { SUBJECTS };

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];
