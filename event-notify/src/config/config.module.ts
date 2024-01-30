import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { AppConfig } from './app.config';
import { RabbitMQConfig } from './rabbit.config';
import * as NestConfig from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [ConfigService, AppConfig, RabbitMQConfig],
  exports: [ConfigService, AppConfig, RabbitMQConfig],
})
export class ConfigModule {}
