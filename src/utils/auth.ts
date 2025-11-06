// Auth utility functions for token management

import { cache } from './cache';

const COOKIE_NAME = 'rerefresh_token';
const ACCOUNT_INFO_CACHE_KEY = 'account_info';

export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AccountInfo {
  user: User;
  is_login: boolean;
  loginTime: number;
}

/**
 * Set cookie with token
 */
const setCookie = (name: string, value: string, hours: number = 1): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * Get cookie value by name
 */
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

/**
 * Delete cookie by name
 */
const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Save token to cookie and account info to cache
 */
export const saveAuth = (token: string, user?: User): void => {
  setCookie(COOKIE_NAME, token, 1); // Cookie expires in 1 hour
  
  // Save account info to cache
  const accountInfo: AccountInfo = {
    user: user || getUser() || { id: 0, username: '', role: '', email: '' },
    is_login: true,
    loginTime: Date.now(),
  };
  
  // Cache for 1 hour (same as token expiry)
  cache.set(ACCOUNT_INFO_CACHE_KEY, accountInfo, 60 * 60 * 1000);
};

/**
 * Get token from cookie
 */
export const getToken = (): string | null => {
  return getCookie(COOKIE_NAME);
};

/**
 * Get user info from JWT token (decoded from token payload)
 */
export const getUser = (): User | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode JWT token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Extract user info from token payload
    return {
      id: parseInt(payload.sub) || payload.id,
      username: payload.username,
      role: payload.role,
      email: payload.email,
    };
  } catch (e) {
    return null;
  }
};

/**
 * Get account info from cache
 */
export const getAccountInfo = (): AccountInfo | null => {
  return cache.get<AccountInfo>(ACCOUNT_INFO_CACHE_KEY);
};

/**
 * Check if user is authenticated (check both token and account_info)
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    // Clear account_info cache if no token
    cache.clear(ACCOUNT_INFO_CACHE_KEY);
    return false;
  }
  
  // Check if token is expired by decoding JWT
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const isTokenValid = Date.now() < exp;
    
    if (!isTokenValid) {
      // Token expired, clear auth (will clear account_info)
      clearAuth();
      return false;
    }
    
    // Check account_info in cache
    const accountInfo = getAccountInfo();
    if (!accountInfo || !accountInfo.is_login) {
      // If account_info doesn't exist or is_login is false, clear auth (will clear account_info)
      clearAuth();
      return false;
    }
    
    return true;
  } catch (e) {
    // If token is invalid, remove it and clear account_info
    clearAuth();
    return false;
  }
};

/**
 * Clear authentication data (delete cookie and clear account_info cache)
 */
export const clearAuth = (): void => {
  deleteCookie(COOKIE_NAME);
  // Clear only account_info cache when logout or token expired
  cache.clear(ACCOUNT_INFO_CACHE_KEY);
};

