import { IEventHandler, EventsHandler, CommandBus } from '@nestjs/cqrs';
import { OrderStatusEvent } from '../order-status.event';
import { SendOrderStatusCommand } from 'src/mailer-sender/commands/send-order-status.command';

@EventsHandler(OrderStatusEvent)
export class OrderStatusEventHandler
  implements IEventHandler<OrderStatusEvent>
{
  constructor(private readonly commandBus: CommandBus) {}
  async handle(event: OrderStatusEvent) {
    this.commandBus.execute(
      new SendOrderStatusCommand(event.sagaId, event.to, event.order),
    );
    return event;
  }
}
