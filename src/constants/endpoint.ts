export const API = {
  PRODUCT: {
    fixtures: '/fixtures',
    LIST: '/products',
    CATEGORY: '/products/category',
  }, 

  USER: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password',
  },
};

// API Response Codes
export const API_SUCCESS = "000";

// Cache keys
export const CACHE_KEYS = {
  FIXTURES_LIVE: (live: string = 'all') => `fixtures-live-${live}`,
  MATCH_DETAIL: (fixtureId: string) => `match-detail-${fixtureId}`,
} as const;
