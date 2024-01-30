import { OrderPaymentEventHandler } from './order-payment.event.handler';
import { PaymentUpdateEventHandler } from './payment-update.event.handler';

export const PaymentEventsHandlers = [
  OrderPaymentEventHandler,
  PaymentUpdateEventHandler,
];
