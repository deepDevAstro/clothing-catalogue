/**
 * Data Cache Management Layer
 *
 * Provides efficient in-memory caching with automatic invalidation
 * to reduce Firestore reads and improve performance.
 *
 * Features:
 * - In-memory cache with TTL
 * - Automatic invalidation on mutations
 * - Singleton pattern for app-wide cache
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get cached data if valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear cache for all items (use when items are created/updated/deleted)
   */
  invalidateItems(): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith("items_")) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
let cacheInstance: DataCache | null = null;

/**
 * Get or create cache instance
 */
export function getCache(): DataCache {
  if (!cacheInstance) {
    cacheInstance = new DataCache();
  }
  return cacheInstance;
}

/**
 * Reset cache (useful for testing)
 */
export function resetCache(): void {
  cacheInstance = null;
}
