import { SagaOrderDto } from './saga-order.dto';

export type SagaOrderDataDto = SagaOrderDto & {
  orderId: string;
  currency: string;
  price: number;
};
