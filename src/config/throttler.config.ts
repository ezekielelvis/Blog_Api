// src/config/throttler.config.ts
import { registerAs } from '@nestjs/config';
import { ThrottlerConfig } from '../interface/config.interface';
import { DEFAULT_THROTTLE_CONFIG } from '../constants/index';

export default registerAs(
  'throttler',
  (): ThrottlerConfig => ({
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || DEFAULT_THROTTLE_CONFIG.ttl,
    limit:
      parseInt(process.env.THROTTLE_LIMIT, 10) || DEFAULT_THROTTLE_CONFIG.limit,
  }),
);
