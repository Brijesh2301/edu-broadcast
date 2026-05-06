import { mockApi } from '@/mocks/mockApi';

export const authService = {
  login: (credentials) => mockApi.login(credentials),
  logout: () => Promise.resolve(),
};
