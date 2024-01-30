import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderPaymentEvent } from '../order-payment.event';
import { PaymentService } from 'src/payment/services/payment.service';
import { ProducerService } from 'src/payment/services/amqp/producer.service';

@EventsHandler(OrderPaymentEvent)
export class OrderPaymentEventHandler
  implements IEventHandler<OrderPaymentEvent>
{
  private readonly paymentOrderExcahge: string;
  private readonly orderPayTopic: string;
  constructor(
    private readonly paymentService: PaymentService,
    private producerService: ProducerService,
  ) {}

  async handle(event: OrderPaymentEvent) {
    const { sagaId, orderData } = event;
    const payment = await this.paymentService.createPayment(orderData);

    await this.producerService.paymentSend({
      sagaId,
      payment,
    });
  }
}
