import { CommandBus } from '@nestjs/cqrs';
import { Order } from '../entities/order.entity';
import { CreateOrderCommand } from '../commands/create-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly commadBus: CommandBus) {}

  public createOrder(userId: number, products: string[]): Promise<Order> {
    return this.commadBus.execute(new CreateOrderCommand(userId, products));
  }

  public updateOrderState(id: string, state: string): Promise<Order> {
    return this.commadBus.execute(new UpdateOrderCommand(id, undefined, state));
  }
}
