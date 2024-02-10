import { Module } from '@nestjs/common';
import { PaymentStore } from './stores/payment.store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentEventsHandlers } from './events/handlers';
import { PaymentCommandHandlers } from './commands/handlers';
import { PaymentService } from './services/payment.service';
import { ConsumerService } from './services/amqp/consumer.service';
import { ProducerService } from './services/amqp/producer.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Payment])],
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
