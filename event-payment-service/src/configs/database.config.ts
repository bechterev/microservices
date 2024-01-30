import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { IDatabaseConfig } from './models/database.model';

type DatabaseType = 'mysql' | 'mariadb' | 'postgres';

@Injectable()
export class DatabaseConfig implements IDatabaseConfig {
  public dbHost: string;
  public dbPort: number;
  public dbUser: string;
  public dbPassword: string;
  public dbName: string;
  public dbType: DatabaseType;

  constructor(private configService: ConfigService) {
    this.dbHost = configService.getString('DB_HOST');
    this.dbName = configService.getString('DB_NAME');
    this.dbPassword = configService.getString('DB_PASSWORD');
    this.dbPort = configService.getNumber('DB_PORT');
    this.dbUser = configService.getString('DB_USER');
    this.dbType = configService.getString('DB_TYPE') as DatabaseType;
  }
}
