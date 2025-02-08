// rate-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const THROTTLE_LIMIT_KEY = 'throttle_limit';
export const THROTTLE_TTL_KEY = 'throttle_ttl';

export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_LIMIT_KEY, { limit, ttl });
