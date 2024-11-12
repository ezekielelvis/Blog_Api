import { CacheModuleOptions, CacheStoreFactory } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

// Define your Redis configuration options
const redisOptions: RedisClientOptions = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB) || 0,
};

// CacheModule configuration using CacheStoreFactory
const cacheConfig: CacheModuleOptions = {
  store: redisStore as unknown as CacheStoreFactory,
  options: {
    ...redisOptions,
    ttl: 3600, // Default TTL: 1 hour
  },
  isGlobal: true, // Optional: Set the cache module as global
};

export default cacheConfig;
