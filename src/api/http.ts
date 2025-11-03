/* eslint-disable */
import axios from 'axios';
import { ENV } from '@/constants/';

const rapidApiHost = ENV.NEXT_PUBLIC_RAPIDAPI_HOST;
const rapidApiKey = ENV.NEXT_PUBLIC_RAPIDAPI_KEY;

console.log(rapidApiHost);
console.log(rapidApiKey);


const http = axios.create({
  baseURL: ENV.API_BASE_URL,

  headers: {
    'x-rapidapi-host': rapidApiHost,
    'x-rapidapi-key': rapidApiKey,
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
