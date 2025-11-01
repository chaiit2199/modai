/* eslint-disable */
import axios from 'axios';
import { ENV } from '@/constants/';

const http = axios.create({
  baseURL: ENV.API_BASE_URL,

  headers: {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
  },
});

http.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error);
  }
);

export default http;
