// src/interfaces/redis-config.interface.ts
import { RedisClientOptions } from 'redis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  enableTls?: boolean;
  additionalOptions?: RedisClientOptions;
}
