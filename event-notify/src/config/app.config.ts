import { Injectable } from '@nestjs/common';
import { IAppConfig } from './models/app.model';
import { ConfigService } from './config.service';

@Injectable()
export class AppConfig implements IAppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly email_to: string;
  public readonly sentry_dsn: string;
  public readonly email_domain: string;
  public readonly email_user: string;
  public readonly email_password: string;
  public readonly email_domain_port: string;

  constructor(configService: ConfigService) {
    this.name = configService.getString('APP_NAME');
    this.port = configService.getNumber('APP_PORT');
    this.email_to = configService.getString('EMAIL_TO');
    this.sentry_dsn = configService.getString('SENTRY_DSN');
    this.email_domain = configService.getString('MAIL_DOMAIN');
    this.email_user = configService.getString('USER_MAIL');
    this.email_password = configService.getString('USER_PASSWORD');
    this.email_domain_port = configService.getString('MAIL_DOMAIN_PORT');
  }
}
