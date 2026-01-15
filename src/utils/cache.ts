// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  // Track ongoing fetches to prevent duplicate API calls
  private pendingFetches: Map<string, Promise<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 120000): void {
    // Default TTL is 60 seconds (1 minute)
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const remainingTTL = entry.ttl - age;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Get cache entry with metadata
  getWithInfo<T>(key: string): { data: T; age: number; timestamp: number } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.data as T,
      age,
      timestamp: entry.timestamp,
    };
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Check if a key exists and is valid (not expired)
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Get cache entry info (timestamp and age) without returning data
  getInfo(key: string): { timestamp: number; age: number; ttl: number } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return {
      timestamp: entry.timestamp,
      age,
      ttl: entry.ttl,
    };
  }

  /**
   * Execute a fetch function with deduplication
   * If multiple requests try to fetch the same key simultaneously,
   * only one fetch will execute and others will wait for the result
   */
  async fetchWithDeduplication<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 120000
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Check if there's already a pending fetch for this key
    const pendingFetch = this.pendingFetches.get(key);
    if (pendingFetch) {
      // Wait for the existing fetch to complete
      return pendingFetch as Promise<T>;
    }

    // Start new fetch
    const fetchPromise = fetchFn()
      .then((data) => {
        // Cache the result
        this.set(key, data, ttl);
        // Remove from pending fetches
        this.pendingFetches.delete(key);
        return data;
      })
      .catch((error) => {
        // Remove from pending fetches on error
        this.pendingFetches.delete(key);
        throw error;
      });

    // Store the pending fetch
    this.pendingFetches.set(key, fetchPromise);

    return fetchPromise;
  }
}

// Export singleton instance
export const cache = new Cache();

