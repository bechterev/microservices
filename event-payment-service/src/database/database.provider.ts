import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfig } from '../configs/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly databaseConfig: DatabaseConfig;
  constructor(databaseConfig: DatabaseConfig) {
    this.databaseConfig = databaseConfig;
  }
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.databaseConfig.dbType,
      host: this.databaseConfig.dbHost,
      port: this.databaseConfig.dbPort,
      username: this.databaseConfig.dbUser,
      password: this.databaseConfig.dbPassword,
      database: this.databaseConfig.dbName,
      entities: ['dist/**/**.entity.js'],
      synchronize: true,
    };
  }
}
