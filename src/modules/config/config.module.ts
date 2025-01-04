// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_DB: Joi.number().default(0),
        REDIS_USERNAME: Joi.string().default('default'),
        REDIS_TLS: Joi.boolean().default(true),
        REDIS_KEY_PREFIX: Joi.string().default('myapp_throttler_'),
        REDIS_MAX_RETRIES: Joi.number().default(3),
        REDIS_RETRY_INTERVAL: Joi.number().default(1000),
      }),
    }),
  ],
})
export class AppConfigModule {}
