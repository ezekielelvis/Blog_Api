// throttler.config.ts
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 60 seconds (in milliseconds)
      limit: 10, // 10 requests per ttl
    },
  ],
};
