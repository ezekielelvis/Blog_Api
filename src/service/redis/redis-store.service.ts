import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';
import { RedisConfig } from '../../interface/redis-config.interface'; // Ensure you have this interface defined
import { ERROR_MESSAGES } from '../../constants/index';

@Injectable()
export class RedisStoreService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisStoreService.name);
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = this.configService.get<RedisConfig>('redis');

    if (!redisConfig) {
      this.logger.error(ERROR_MESSAGES.REDIS_CONFIGURATION_MISSING);
      throw new Error(ERROR_MESSAGES.REDIS_CONFIGURATION_MISSING);
    }

    const redisOptions: RedisClientOptions = {
      socket: {
        host: redisConfig.host || 'localhost',
        port: redisConfig.port || 6379,
        tls: redisConfig.enableTls ? true : undefined, // Configure TLS if enabled
      },
      password: redisConfig.password || undefined,
      ...redisConfig.additionalOptions, // Spread any additional Redis options if provided
    };

    this.client = createClient(redisOptions) as unknown as RedisClientType;

    // Handle Redis client events
    this.client.on('error', (err) => {
      this.logger.error(ERROR_MESSAGES.REDIS_CONNECTION_ERROR, err.stack);
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
      this.logger.log('Disconnected from Redis');
    }
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error(ERROR_MESSAGES.REDIS_CLIENT_NOT_INITIALIZED);
    }
    return this.client;
  }

  async increment(key: string, ttl: number): Promise<number> {
    if (!this.client) {
      throw new Error(ERROR_MESSAGES.REDIS_CLIENT_NOT_INITIALIZED);
    }

    const hits = await this.client.incr(key);
    if (hits === 1) {
      await this.client.expire(key, ttl);
    }
    return hits;
  }

  async delete(key: string): Promise<void> {
    if (!this.client) {
      throw new Error(ERROR_MESSAGES.REDIS_CLIENT_NOT_INITIALIZED);
    }
    await this.client.del(key);
  }
}
