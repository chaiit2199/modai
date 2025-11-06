/* eslint-disable */
import axios from 'axios';
import { ENV } from '@/constants/';
import { getToken, clearAuth } from '@/utils/auth';

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
    // Add token to headers if available
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

http.interceptors.response.use(
  (res) => res,
  error => {
    console.error('API error:', error);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearAuth();
      // Redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default http;
