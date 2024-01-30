import { OrderDataDto } from '../dto/order-data.dto';

export class OrderPaymentEvent {
  constructor(
    readonly sagaId: string,
    readonly orderData: OrderDataDto,
  ) {}
}
