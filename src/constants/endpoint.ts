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
    REFRESH_TOKEN: '/api/refresh-token',
  },

  NEWS: {
    LATEST: '/api/posts/latest',
    ALL: '/api/posts',
    DETAIL: '/api/posts', // GET /api/posts/:id
    CREATE: '/api/posts/create',
    UPDATE: '/api/posts/update',
    DELETE: '/api/posts/delete',
  },
};

// API Response Codes
export const API_SUCCESS = "000";

// Cache keys
export const CACHE_KEYS = {
  FIXTURES_LIVE: (live: string = 'all') => `fixtures-live-${live}`,
  MATCH_DETAIL: (fixtureId: string) => `match-detail-${fixtureId}`,
  NEWS_LATEST: () => 'news_latest',
  POSTS_ALL: () => 'posts_all',
  POST_DETAIL: (postId: string) => `post-detail-${postId}`,
} as const;
