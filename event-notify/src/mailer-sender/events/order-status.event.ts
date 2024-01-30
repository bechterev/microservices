import { Order } from '../types/order.type';

export class OrderStatusEvent {
  constructor(
    readonly to: string,
    readonly sagaId: string,
    readonly order: Order,
  ) {}
}
