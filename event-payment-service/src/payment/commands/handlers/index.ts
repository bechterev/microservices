import { CreatePaymentCommandHandler } from './create-payment.command.handler';
import { UpdatePaymentStatusCommandHandler } from './update-payment-status.command.handler';

export const PaymentCommandHandlers = [
  CreatePaymentCommandHandler,
  UpdatePaymentStatusCommandHandler,
];
