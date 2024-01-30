import { PaymentStatus } from 'src/payment/entities/payment.entity';

export class UpdatePaymentStatusCommand {
  constructor(
    readonly paymentId: string,
    readonly status: PaymentStatus,
    readonly reason?: string,
  ) {}
}
