import { Injectable } from '@nestjs/common';
import { IAppConfig } from './models/app.model';
import { ConfigService } from './config.service';

@Injectable()
export class AppConfig implements IAppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly email_to: string;
  public readonly transport: string;

  constructor(configService: ConfigService) {
    this.name = configService.getString('APP_NAME');
    this.port = configService.getNumber('APP_PORT');
    this.email_to = configService.getString('EMAIL_TO');
    this.transport = configService.getString('TRANSPORT');
  }
}
