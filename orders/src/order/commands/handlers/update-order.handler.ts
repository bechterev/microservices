import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderStore } from '../../stores/order.store';
import { UpdateOrderCommand } from '../update-order.command';
import { Order, OrderState } from '../../entities/order.entity';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderStateHandler
  implements ICommandHandler<UpdateOrderCommand>
{
  constructor(private readonly orderStore: OrderStore) {}
  async execute(command: UpdateOrderCommand): Promise<Order> {
    const { id, state } = command;
    return await this.orderStore.updateOrderState({
      id,
      state: OrderState[state],
    });
  }
}
