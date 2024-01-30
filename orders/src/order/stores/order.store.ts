import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderState } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderStore {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  public async createOrder(order: Partial<Order>): Promise<Order> {
    order.state = OrderState.init;
    const newOrder = await this.orderRepository.create(order);
    return await this.orderRepository.save(newOrder);
  }

  public async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    return order;
  }

  public async addProduct(order: Partial<Order>): Promise<Order> {
    const orderStore = await this.getOrder(order.id);
    await this.orderRepository.update(
      { id: order.id },
      {
        products: orderStore?.products.length
          ? [...orderStore?.products, ...order.products]
          : [...order.products],
      },
    );
    return await this.getOrder(order.id);
  }

  public async updateOrderState(order: Partial<Order>): Promise<Order> {
    const orderStore = await this.getOrder(order.id);
    if (!orderStore || !order.state) {
      return;
    }
    await this.orderRepository.update(
      { id: order.id },
      {
        state: order.state,
      },
    );
    return await this.getOrder(order.id);
  }
}
