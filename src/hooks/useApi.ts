import { useAuth } from './useAuth';
import { apiRequest } from '../utils/api';

export const useApi = () => {
  const { token } = useAuth();

  return {
    get: <T>(path: string) => apiRequest<T>(path, { token }),
    post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', token, body }),
    put: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PUT', token, body }),
    del: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE', token }),
  };
};
