import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalService } from '@/services/approval.service';
import { QUERY_KEYS } from '@/utils/constants';

export const useApproveContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contentId) => approvalService.approve(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEACHER_CONTENTS],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIVE_CONTENT] });
    },
  });
};

export const useRejectContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, reason }) =>
      approvalService.reject(contentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEACHER_CONTENTS],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIVE_CONTENT] });
    },
  });
};
