import { mockApi } from '@/mocks/mockApi';

export const approvalService = {
  approve: (contentId) => mockApi.approveContent(contentId),
  reject: (contentId, reason) => mockApi.rejectContent(contentId, reason),
};
