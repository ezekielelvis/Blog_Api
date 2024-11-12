import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request } from 'express';

export const rateLimiterConfig: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later',
  },
  keyGenerator: (req: Request): string => {
    return (req.headers['x-api-key'] as string) || req.ip;
  },
});
