import { Global, Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import { AppConfig } from './app.config';
import { ConfigService } from './config.service';
import { DatabaseConfig } from './database.config';
import { JWTConfig } from './jwt.config';
import { RabbitMQConfig } from './rabbit.config';

@Global()
@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [
    NestConfig.ConfigService,
    ConfigService,
    AppConfig,
    DatabaseConfig,
    JWTConfig,
    {
      provide: 'JWT_CONFIG',
      useValue: JWTConfig,
    },
    RabbitMQConfig,
  ],
  exports: [AppConfig, DatabaseConfig, JWTConfig, RabbitMQConfig],
})
export class ConfigModule {}
