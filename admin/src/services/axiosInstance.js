import axios from 'axios';
import { validateClientEnv } from '@configs/envValidation';

validateClientEnv()

const getCookieValue = (name) => {
  if (typeof document === 'undefined') return '';
  const cookie = document.cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${name}=`));
  if (!cookie) return '';
  return decodeURIComponent(cookie.substring(name.length + 1));
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

let refreshPromise = null;

axiosInstance.interceptors.request.use(
  (config) => {
    const requestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    config.headers['x-request-id'] = requestId;
    const csrfToken = getCookieValue('csrf_token');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const isUnauthorized = error?.response?.status === 401;
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint = requestUrl.includes('/public/api/v1/auth/refresh') || requestUrl.includes('/public/api/v1/auth/logout');
    const isLoginEndpoint = requestUrl.includes('/public/api/v1/admin/login');

    if (!isUnauthorized || originalRequest._retry || isAuthEndpoint || isLoginEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axiosInstance.post('/public/api/v1/auth/refresh');
      }
      await refreshPromise;
      refreshPromise = null;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      if (typeof window !== 'undefined') {
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
