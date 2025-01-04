// src/shared/constants/index.ts
export const REDIS_STORE = 'REDIS_STORE';

export const DEFAULT_THROTTLE_CONFIG = {
  ttl: 60000, // 1 minute
  limit: 10, // 10 requests per minute
};

export const THROTTLE_SKIP_PATHS = ['/health', '/metrics'];

export const ERROR_MESSAGES = {
  REDIS_CONNECTION_ERROR: 'Redis connection error',
  REDIS_CONFIGURATION_MISSING: 'Redis configuration is missing',
  REDIS_CLIENT_NOT_INITIALIZED: 'Redis client is not initialized',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
};
