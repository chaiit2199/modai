export const API = {
  PRODUCT: {
    fixtures: '/fixtures',
    LIST: '/products',
    CATEGORY: '/products/category',
  }, 
};

// Cache keys
export const CACHE_KEYS = {
  FIXTURES_LIVE: (live: string = 'all') => `fixtures-live-${live}`,
} as const;
