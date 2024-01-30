import { Module } from '@nestjs/common';
import { PaymentStore } from './stores/payment.store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { RabbitMQConfig } from 'src/configs/rabbit.config';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PaymentEventsHandlers } from './events/handlers';
import { PaymentCommandHandlers } from './commands/handlers';
import { PaymentService } from './services/payment.service';
import { ConsumerService } from './services/amqp/consumer.service';
import { ProducerService } from './services/amqp/producer.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Payment]),
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
  ],
  providers: [
    PaymentStore,
    PaymentService,
    ...PaymentEventsHandlers,
    ...PaymentCommandHandlers,
    ConsumerService,
    ProducerService,
  ],
})
export class PaymentModule {}
