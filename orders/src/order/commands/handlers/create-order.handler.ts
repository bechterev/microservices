import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Order } from '../../entities/order.entity';
import { OrderStore } from '../../stores/order.store';
import { CreateOrderCommand } from '../create-order.command';
import { OrderAggregate } from 'src/order/aggregates/order.aggregate';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly store: OrderStore,
    private readonly orderPublisher: EventPublisher,
  ) {}
  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, products } = command;
    const newOrder = await this.store.createOrder({ userId, products });
    const saga = this.orderPublisher.mergeObjectContext(
      new OrderAggregate(newOrder.id),
    );
    saga.registerSaga(newOrder.products.length, 'USD', userId);
    saga.commit();
    return newOrder;
  }
}
