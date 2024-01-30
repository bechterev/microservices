import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentCompletEvent } from '../payment-complete.event';

@EventsHandler(PaymentCompletEvent)
export class PaymentCompleteEventHandler
  implements IEventHandler<PaymentCompletEvent>
{
  handle(event: PaymentCompletEvent) {
    return event;
  }
}
