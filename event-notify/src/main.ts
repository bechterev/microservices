import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);
  Sentry.init({
    dsn: config.sentry_dsn,
    tracesSampleRate: 1.0,
  });
  await app.listen(config.port);
}
bootstrap();
