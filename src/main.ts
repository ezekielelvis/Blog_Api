import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rateLimiterConfig } from './config/rate-limit.config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(rateLimiterConfig);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
