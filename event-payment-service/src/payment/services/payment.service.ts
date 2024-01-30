import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreatePaymentCommand } from '../commands/impl/create-payment.command';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { UpdatePaymentStatusCommand } from '../commands/impl/update-payment-status.command';
import { OrderDataDto } from '../dto/order-data.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly commadBus: CommandBus) {}

  public createPayment(orderData: OrderDataDto): Promise<Payment> {
    return this.commadBus.execute(new CreatePaymentCommand(orderData));
  }

  public updatePaymentState(
    paymentId: string,
    status: PaymentStatus,
    reason?: string,
  ): Promise<Payment> {
    return this.commadBus.execute(
      new UpdatePaymentStatusCommand(paymentId, status, reason),
    );
  }
}
