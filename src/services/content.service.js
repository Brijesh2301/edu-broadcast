import { mockApi } from '@/mocks/mockApi';

export const contentService = {
  getAll: async () => mockApi.getContents(),

  getByTeacher: async (teacherId) =>
    mockApi.getContentsByTeacher(teacherId),

  getLive: async (teacherId) =>
    mockApi.getLiveContent(teacherId),

  upload: async (payload) =>
    mockApi.uploadContent(payload),
};