import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentStore } from 'src/payment/stores/payment.store';
import { UpdatePaymentStatusCommand } from '../impl/update-payment-status.command';
import { CustomCatch } from 'src/payment/exception/custom-catch';
import { PaymentsErrorMessages } from 'src/payment/exception/payment-error';

@CommandHandler(UpdatePaymentStatusCommand)
export class UpdatePaymentStatusCommandHandler
  implements ICommandHandler<UpdatePaymentStatusCommand>
{
  constructor(private readonly paymentStore: PaymentStore) {}
  @CustomCatch()
  async execute(command: UpdatePaymentStatusCommand): Promise<void | Error> {
    const { paymentId, status, reason } = command;
    const payment = await this.paymentStore.getPayment(paymentId);
    if (!payment) {
      throw new Error(PaymentsErrorMessages.PAYMENT_NOT_FOUND);
    }
    await this.paymentStore.UpdatePaymentStatus(paymentId, status, reason);
  }
}
