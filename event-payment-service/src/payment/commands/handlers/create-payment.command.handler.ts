import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../impl/create-payment.command';
import { PaymentStore } from 'src/payment/stores/payment.store';
import { Payment } from 'src/payment/entities/payment.entity';
import { CustomCatch } from 'src/payment/exception/custom-catch';
import { PaymentsErrorMessages } from 'src/payment/exception/payment-error';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(private readonly paymentStore: PaymentStore) {}
  @CustomCatch()
  async execute(command: CreatePaymentCommand): Promise<Payment | Error> {
    const { orderData } = command;

    if (!orderData) {
      throw new Error(PaymentsErrorMessages.ORDER_DATA_NOT_VALID);
    }

    const newPayment = await this.paymentStore.createPayment(orderData);

    return newPayment;
  }
}
