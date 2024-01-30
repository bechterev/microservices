import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentUpdateEvent } from '../payment-update.event';
import { PaymentService } from 'src/payment/services/payment.service';
import { PaymentStatus } from 'src/payment/entities/payment.entity';
import { RabbitMQConfig } from 'src/configs/rabbit.config';
import { ProducerService } from 'src/payment/services/amqp/producer.service';

@EventsHandler(PaymentUpdateEvent)
export class PaymentUpdateEventHandler
  implements IEventHandler<PaymentUpdateEvent>
{
  private readonly orderPaymentExcahge: string;
  private readonly payOrderTopic: string;
  constructor(
    private readonly paymentService: PaymentService,
    private readonly rabbitConfig: RabbitMQConfig,
    private producerService: ProducerService,
  ) {
    this.orderPaymentExcahge = rabbitConfig.exchanges.sender[0].name;
    this.payOrderTopic = rabbitConfig.exchanges.sender[0].topic + '.stop';
  }

  async handle(event: PaymentUpdateEvent) {
    let statusPayment: PaymentStatus = PaymentStatus.Success;
    const { walletInfo } = event;
    if (walletInfo.reason) {
      statusPayment = PaymentStatus.Failed;
    }
    await this.paymentService.updatePaymentState(
      walletInfo.paymentId,
      statusPayment,
      walletInfo.reason,
    );
    await this.producerService.paymentComplete({
      sagaId: walletInfo.sagaId,
      orderId: walletInfo.orderId,
      userId: walletInfo.userId,
      paymentStatus: statusPayment,
    });
  }
}
