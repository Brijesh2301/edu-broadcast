import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { contentService } from '@/services/content.service';
import { QUERY_KEYS } from '@/utils/constants';

export const useAllContents = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ALL_CONTENTS],
    queryFn: () => contentService.getAll(),
  });

export const useTeacherContents = (teacherId) =>
  useQuery({
    queryKey: [QUERY_KEYS.TEACHER_CONTENTS, teacherId],
    queryFn: () => contentService.getByTeacher(teacherId),
    enabled: !!teacherId,
  });

export const useLiveContent = (teacherId) =>
  useQuery({
    queryKey: [QUERY_KEYS.LIVE_CONTENT, teacherId],
    queryFn: () => contentService.getLive(teacherId),
    enabled: !!teacherId,
    refetchInterval: 30000,
  });

export const useUploadContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => contentService.upload(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_CONTENTS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEACHER_CONTENTS],
      });
    },
  });
};

export const useContentStats = (contents = []) =>
  useMemo(() => {
    const list = Array.isArray(contents) ? contents : [];
    return {
      total: list.length,
      pending: list.filter((c) => c.status === 'pending').length,
      approved: list.filter((c) => c.status === 'approved').length,
      rejected: list.filter((c) => c.status === 'rejected').length,
    };
  }, [contents]);
