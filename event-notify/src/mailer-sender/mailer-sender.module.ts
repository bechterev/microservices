import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQConfig } from 'src/config/rabbit.config';
import { SendOrderStatusCommandHandler } from './commands/handlers/send-order-status.command.handler';
import { MailService } from './services/mail.service';
import { MessageService } from './services/message.service';
import { OrderStatusEventHandler } from './events/handlers/order-status.event.handler';
import { ConsumerService } from './services/amqp/consumer.service';
import { ProducerService } from './services/amqp/producer.service';

@Module({
  imports: [
    CqrsModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (rabbitmqConfig: RabbitMQConfig) => ({
        uri: rabbitmqConfig.uri,
        exchanges: [
          ...rabbitmqConfig.exchanges.recipient,
          ...rabbitmqConfig.exchanges.sender,
        ],
      }),
      inject: [RabbitMQConfig],
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport:
          'smtps://someuser@some.domain:password@somedomain:465/?secure=true',
      }),
    }),
  ],
  providers: [
    SendOrderStatusCommandHandler,
    MailService,
    MessageService,
    OrderStatusEventHandler,
    ConsumerService,
    ProducerService,
  ],
})
export class MailerSenderModule {}
