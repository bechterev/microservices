import { Order } from './order.type';

export type OrderNotify = {
  sagaId: string;
  email: string;
  order: Order;
};
