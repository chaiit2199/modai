// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 60000): void {
    // Default TTL is 60 seconds (1 minute)
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      ttl,
    });
    console.log(`[CACHE] SET - Key: ${key}, TTL: ${ttl}ms, Timestamp: ${new Date(timestamp).toISOString()}`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`[CACHE] MISS - Key: ${key} (not found)`);
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const remainingTTL = entry.ttl - age;

    // Check if entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      console.log(`[CACHE] EXPIRED - Key: ${key}, Age: ${age}ms (exceeded TTL: ${entry.ttl}ms)`);
      return null;
    }

    console.log(`[CACHE] HIT - Key: ${key}, Age: ${Math.round(age / 1000)}s, Remaining: ${Math.round(remainingTTL / 1000)}s`);
    return entry.data as T;
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
}

// Export singleton instance
export const cache = new Cache();

