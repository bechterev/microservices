import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { MailerSenderModule } from './mailer-sender/mailer-sender.module';

@Module({
  imports: [ConfigModule, MailerSenderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
