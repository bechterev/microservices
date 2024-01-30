import { PaymentCompleteStopStep } from '../dto/payment.dto';

export class PaymentCompletEvent {
  constructor(readonly paymentComplete: PaymentCompleteStopStep) {}
}
