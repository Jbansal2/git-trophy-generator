import { connect } from "https://deno.land/x/redis@v0.31.0/mod.ts";

let redis: any = null;

/**
 * Initialize Redis connection
 */
export async function initRedis() {
  const redisUrl = Deno.env.get("REDIS_URL") || "redis://localhost:6379";
  const redisEnabled = Deno.env.get("CACHE_ENABLED") === "true";

  if (!redisEnabled) {
    console.log("📦 Cache: Disabled (in-memory fallback)");
    return null;
  }

  try {
    redis = await connect({
      hostname: new URL(redisUrl).hostname,
      port: parseInt(new URL(redisUrl).port) || 6379,
    });
    console.log("✅ Redis connected:", redisUrl);
    return redis;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("⚠️  Redis connection failed:", errorMessage);
    console.log("📦 Falling back to in-memory cache");
    return null;
  }
}

/**
 * In-memory cache fallback
 */
const memoryCache = new Map<string, { value: string; expiry: number }>();

/**
 * Get value from cache
 */
export async function getCached(key: string): Promise<string | null> {
  // Try Redis first
  if (redis) {
    try {
      const value = await redis.get(key);
      if (value) {
        console.log(`✓ Cache HIT: ${key}`);
        return value;
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.warn("Redis GET error:", errorMessage);
    }
  }

  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    console.log(`✓ Memory cache HIT: ${key}`);
    return cached.value;
  }

  console.log(`✗ Cache MISS: ${key}`);
  return null;
}

/**
 * Set value in cache with TTL
 */
export async function setCached(
  key: string,
  value: string,
  ttlSeconds = 3600,
): Promise<void> {
  // Try Redis first
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, value);
      console.log(`✓ Cached to Redis: ${key} (TTL: ${ttlSeconds}s)`);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.warn("Redis SET error:", errorMessage);
    }
  }

  // Fallback to memory cache
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
  console.log(`✓ Cached to memory: ${key} (TTL: ${ttlSeconds}s)`);
}

/**
 * Delete key from cache
 */
export async function deleteCached(key: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(key);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.warn("Redis DEL error:", errorMessage);
    }
  }
  memoryCache.delete(key);
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  if (redis) {
    try {
      await redis.flushdb();
      console.log("✓ Redis cache cleared");
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.warn("Redis FLUSH error:", errorMessage);
    }
  }
  memoryCache.clear();
  console.log("✓ Memory cache cleared");
}

/**
 * Get cache stats
 */
export async function getCacheStats() {
  const stats: any = {
    type: redis ? "redis" : "memory",
    enabled: Deno.env.get("CACHE_ENABLED") === "true",
  };

  if (redis) {
    try {
      const info = await redis.info("stats");
      stats.redis = {
        connected: true,
        info: info,
      };
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      stats.redis = { connected: false, error: errorMessage };
    }
  } else {
    stats.memory = {
      size: memoryCache.size,
      keys: Array.from(memoryCache.keys()),
    };
  }

  return stats;
}

/**
 * Generate cache key for trophy
 */
export function generateCacheKey(
  username: string,
  params: Record<string, any>,
): string {
  const { theme, column, no_bg, no_frame, rank, title } = params;
  return `trophy:${username}:${theme}:${column}:${no_bg}:${no_frame}:${
    rank || "all"
  }:${title || "all"}`;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      console.log("Redis connection closed");
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.warn("Error closing Redis:", errorMessage);
    }
  }
}
