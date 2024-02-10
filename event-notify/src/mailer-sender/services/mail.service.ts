import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailObject } from '../types/mail.type';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class MailService {
  private readonly appConfig: AppConfig;
  constructor(
    private readonly mailerService: MailerService,
    appConfig: AppConfig,
  ) {
    this.appConfig = appConfig;
  }

  async sendMessage(messageObj: MailObject) {
    const message = await this.mailerService.sendMail({
      ...messageObj,
      from: this.appConfig.email_to,
    });
    return message;
  }
}
