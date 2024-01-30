import { Order } from '../types/order.type';

export class SendOrderStatusCommand {
  constructor(
    readonly sagaId: string,
    readonly to: string,
    readonly order: Order,
  ) {}
}
