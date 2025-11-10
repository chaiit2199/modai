/* eslint-disable */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/constants/';
import { getToken, clearAuth } from '@/utils/auth';
import { refreshAccessToken } from './handle_login';

const rapidApiHost = ENV.NEXT_PUBLIC_RAPIDAPI_HOST;
const rapidApiKey = ENV.NEXT_PUBLIC_RAPIDAPI_KEY;

const http = axios.create({
  baseURL: ENV.API_BASE_URL,

  headers: {
    'x-rapidapi-host': rapidApiHost,
    'x-rapidapi-key': rapidApiKey,
  },
});

http.interceptors.request.use(
  (config) => {
    // Only add token when on /auth routes (excluding public auth pages)
    let isAuthPage = false;
    let isPublicAuthPage = false;
    
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      isAuthPage = pathname.startsWith('/auth');
      // Public auth pages that don't need token
      isPublicAuthPage = pathname === '/auth/login' || 
                        pathname === '/auth/register' || 
                        pathname === '/auth/forgot-password' || 
                        pathname === '/auth/reset-password';
    }
    
    // Only add access_token for /auth routes (but not public auth pages)
    if (isAuthPage && !isPublicAuthPage) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    console.error('API error:', error);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return http(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh access token using refresh_token from HTTPOnly cookie
        // access_token expires in 30 minutes, refresh_token expires in 1 day
        const refreshResult = await refreshAccessToken();
        
        if (refreshResult.success && refreshResult.access_token) {
          // Update token in original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResult.access_token}`;
          }
          
          // Process queued requests
          processQueue(null, refreshResult.access_token);
          isRefreshing = false;
          
          // Retry original request with new token
          return http(originalRequest);
        } else {
          // Refresh failed, clear auth and redirect
          processQueue(error);
          isRefreshing = false;
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect
        processQueue(error);
        isRefreshing = false;
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default http;
