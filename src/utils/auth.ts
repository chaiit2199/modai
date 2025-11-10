// Auth utility functions for token management

import { cache } from './cache';

const ACCESS_TOKEN_CACHE_KEY = 'access_token';
const ACCOUNT_INFO_CACHE_KEY = 'account_info';
const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
}

export interface AuthResponse {
  code: string;
  message: string;
  user: User;
  access_token: string;
}

export interface AccountInfo {
  user: User;
  is_login: boolean;
  loginTime: number;
}

/**
 * Get token expiry time from JWT payload (in milliseconds)
 */
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (e) {
    return null;
  }
};

/**
 * Set cookie with token
 */
const setCookie = (name: string, value: string, maxAge: number): void => {
  if (typeof document === 'undefined') return;
  
  // Calculate expiry date from maxAge (in milliseconds)
  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge);
  
  // Set cookie with SameSite=Lax for security (allows cross-site requests)
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
 * Save access_token to cookie and memory (cache), and account info to cache
 * Note: 
 * - access_token expires in 30 minutes
 * - refresh_token is stored in HTTPOnly cookie by server (expires in 1 day), client cannot access it
 */
export const saveAuth = (accessToken: string, user?: User): void => {
  // Calculate TTL from token expiry
  // access_token expires in 30 minutes, refresh_token expires in 1 day
  const tokenExpiry = getTokenExpiry(accessToken);
  const ttl = tokenExpiry ? Math.max(tokenExpiry - Date.now(), 0) : 30 * 60 * 1000; // Default 30 minutes if can't parse
  
  // Save access_token to cookie (persistent storage)
  setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ttl);
  
  // Also save to memory cache for fast access
  cache.set(ACCESS_TOKEN_CACHE_KEY, accessToken, ttl);
  
  // Save account info to cache
  const accountInfo: AccountInfo = {
    user: user || getUser() || { id: 0, username: '', role: '', email: '' },
    is_login: true,
    loginTime: Date.now(),
  };
  
  // Cache account info for same duration as token
  cache.set(ACCOUNT_INFO_CACHE_KEY, accountInfo, ttl);
};

/**
 * Get access_token from memory (cache) or cookie
 * Priority: memory cache > cookie
 */
export const getToken = (): string | null => {
  // First try memory cache (faster)
  const memoryToken = cache.get<string>(ACCESS_TOKEN_CACHE_KEY);
  if (memoryToken) {
    return memoryToken;
  }
  
  // If not in memory, try cookie (persistent storage)
  const cookieToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);
  if (cookieToken) {
    // Check if token is still valid
    const tokenExpiry = getTokenExpiry(cookieToken);
    if (tokenExpiry && Date.now() < tokenExpiry) {
      // Token is valid, restore to memory cache
      const ttl = tokenExpiry - Date.now();
      cache.set(ACCESS_TOKEN_CACHE_KEY, cookieToken, ttl);
      return cookieToken;
    } else {
      // Token expired, remove from cookie
      deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      return null;
    }
  }
  
  return null;
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
 * If account_info is missing but token is valid, restore account_info from token
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
    let accountInfo = getAccountInfo();
    
    // If account_info doesn't exist but token is valid, restore it from token
    // Only restore if account_info is completely missing (not just expired)
    if (!accountInfo) {
      try {
        const user: User = {
          id: parseInt(payload.sub) || payload.id,
          username: payload.username,
          role: payload.role,
          email: payload.email,
        };
        
        const ttl = exp - Date.now();
        accountInfo = {
          user,
          is_login: true,
          loginTime: Date.now(),
        };
        
        // Restore account_info to cache only if it doesn't exist
        cache.set(ACCOUNT_INFO_CACHE_KEY, accountInfo, ttl);
      } catch (e) {
        // If can't restore account_info, clear auth
        clearAuth();
        return false;
      }
    }
    
    return true;
  } catch (e) {
    // If token is invalid, remove it and clear account_info
    clearAuth();
    return false;
  }
};

/**
 * Clear authentication data (clear access_token and account_info from memory and cookie)
 * Note: refresh_token in HTTPOnly cookie will be cleared by server on logout
 */
export const clearAuth = (): void => {
  // Clear from memory cache
  cache.clear(ACCESS_TOKEN_CACHE_KEY);
  cache.clear(ACCOUNT_INFO_CACHE_KEY);
  
  // Clear from cookie
  deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
};

/**
 * Initialize auth on app load - try to refresh token if expired
 * This should be called once when the app starts
 */
export const initializeAuth = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // Check cookie directly (don't use getToken() as it removes expired tokens)
  const token = getCookie(ACCESS_TOKEN_COOKIE_NAME);
  
  // If no token, nothing to do
  if (!token) {
    return;
  }
  
  // Check if token is expired
  const tokenExpiry = getTokenExpiry(token);
  if (tokenExpiry && Date.now() >= tokenExpiry) {
    // Token expired, try to refresh
    try {
      // Dynamic import to avoid circular dependency
      const { refreshAccessToken } = await import('@/api/handle_login');
      const result = await refreshAccessToken();
      
      if (!result.success) {
        // Refresh failed, clear auth
        clearAuth();
      }
      // If refresh succeeded, token is already saved by refreshAccessToken
    } catch (error) {
      // Refresh failed, clear auth
      console.error('Failed to refresh token on init:', error);
      clearAuth();
    }
  } else if (tokenExpiry && Date.now() < tokenExpiry) {
    // Token is still valid, restore to memory cache first
    const ttl = tokenExpiry - Date.now();
    cache.set(ACCESS_TOKEN_CACHE_KEY, token, ttl);
    
    // Then restore account_info from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: parseInt(payload.sub) || payload.id,
        username: payload.username,
        role: payload.role,
        email: payload.email,
      };
      
      const accountInfo: AccountInfo = {
        user,
        is_login: true,
        loginTime: Date.now(),
      };
      cache.set(ACCOUNT_INFO_CACHE_KEY, accountInfo, ttl);
    } catch (e) {
      // If can't decode token, just skip account_info restoration
      console.error('Failed to decode token for account_info:', e);
    }
  }
};

