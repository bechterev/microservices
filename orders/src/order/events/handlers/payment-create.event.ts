import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentEvent } from '../create-payment.event';
import { GetSagaQuery } from 'src/order/queries/get-saga.query';

@EventsHandler(CreatePaymentEvent)
export class PaymentCreateEventHandler
  implements IEventHandler<CreatePaymentEvent>
{
  constructor(private readonly queryBus: QueryBus) {}
  async handle(event: CreatePaymentEvent) {
    const saga = await this.queryBus.execute(new GetSagaQuery(event.sagaId));
    if (!saga) return;
    return event;
  }
}
