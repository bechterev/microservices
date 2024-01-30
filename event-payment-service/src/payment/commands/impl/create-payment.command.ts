import { OrderDataDto } from 'src/payment/dto/order-data.dto';

export class CreatePaymentCommand {
  constructor(public readonly orderData: OrderDataDto) {}
}
