import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { RedisStoreService } from '../service/redis/redis-store.service';
import { THROTTLE_SKIP_PATHS, ERROR_MESSAGES } from '../constants/index';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    private redisStoreService: RedisStoreService,
  ) {
    super(options, storageService, reflector);
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    // Skip throttling for specific paths
    if (THROTTLE_SKIP_PATHS.includes(request.path)) {
      return true;
    }

    const key = this.generateKey(request);
    const hits = await this.redisStoreService.increment(key, ttl);

    // Set custom response headers
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - hits));
    response.setHeader(
      'X-RateLimit-Reset',
      Math.floor(Date.now() / 1000) + ttl,
    );

    // Check if the request exceeds the limit
    if (hits > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
          retryAfter: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }

  protected generateKey(request: any): string {
    const keyPrefix = 'throttle:';
    const key = `${request.ip}:${request.method}:${request.route.path}`;
    return `${keyPrefix}${key}`;
  }
}
