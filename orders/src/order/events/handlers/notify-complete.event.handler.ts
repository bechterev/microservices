import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotifyCompleteEvent } from '../notify-complete.event';

@EventsHandler(NotifyCompleteEvent)
export class NotifyCompleteEventHandler
  implements IEventHandler<NotifyCompleteEvent>
{
  async handle(event: NotifyCompleteEvent) {
    return event;
  }
}
