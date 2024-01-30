import { OrderAddedEvent } from '../events/order-added.event';

export class InitSagaCommand {
  constructor(readonly orderEvent: OrderAddedEvent) {}
}
