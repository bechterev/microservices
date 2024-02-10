import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SendOrderStatusCommandHandler } from './commands/handlers/send-order-status.command.handler';
import { MailService } from './services/mail.service';
import { OrderStatusEventHandler } from './events/handlers/order-status.event.handler';
import { ConsumerService } from './services/amqp/consumer.service';
import { ProducerService } from './services/amqp/producer.service';
import { AppConfig } from 'src/config/app.config';

@Module({
  imports: [
    CqrsModule,
    MailerModule.forRootAsync({
      useFactory: (emailConfig: AppConfig) => ({
        transport: {
          host: emailConfig.email_domain,
          port: emailConfig.email_domain_port,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: emailConfig.email_user,
            pass: emailConfig.email_password,
          },
        },
      }),
      inject: [AppConfig],
    }),
  ],
  providers: [
    SendOrderStatusCommandHandler,
    MailService,
    OrderStatusEventHandler,
    ConsumerService,
    ProducerService,
  ],
})
export class MailerSenderModule {}
