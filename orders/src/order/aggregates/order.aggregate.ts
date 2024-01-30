import { AggregateRoot } from '@nestjs/cqrs';

import { OrderAddedEvent } from '../events/order-added.event';

export class OrderAggregate extends AggregateRoot {
  public constructor(private readonly orderId: string) {
    super();
  }

  public registerSaga(
    price: number,
    currency: string,
    userId: number,
  ): void | boolean {
    this.apply(new OrderAddedEvent(userId, this.orderId, price, currency));
  }
}
