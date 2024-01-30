import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from '../get-order.query';
import { OrderStore } from 'src/order/stores/order.store';

@QueryHandler(GetOrderQuery)
export class GetOrderQueryHandler implements IQueryHandler<GetOrderQuery> {
  constructor(private readonly orderStore: OrderStore) {}

  async execute(query: GetOrderQuery) {
    const { id } = query;
    return await this.orderStore.getOrder(id);
  }
}
