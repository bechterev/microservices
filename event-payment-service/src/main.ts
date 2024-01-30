import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfig } from './configs/app.config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const config = app.get(AppConfig);

  await app.listen(config.port, '0.0.0.0', (_, address) => {
    console.log(`Service available on ${address}`);
  });
}
bootstrap();
