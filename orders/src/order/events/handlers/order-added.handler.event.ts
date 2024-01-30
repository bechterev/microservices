import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderAddedEvent } from '../order-added.event';

@EventsHandler(OrderAddedEvent)
export class OrderAddedHandlerEvent implements IEventHandler<OrderAddedEvent> {
  async handle(event: OrderAddedEvent) {
    return event;
  }
}
