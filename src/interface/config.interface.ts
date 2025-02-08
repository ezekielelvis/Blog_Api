export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  tls?: boolean;
  keyPrefix?: string;
}

export interface ThrottlerConfig {
  ttl: number;
  limit: number;
}

export interface RateLimitInfo {
  totalHits: number;
  remainingHits: number;
  resetTime: number;
}
