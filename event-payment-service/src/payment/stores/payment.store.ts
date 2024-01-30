import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDataDto } from '../dto/order-data.dto';

@Injectable()
export class PaymentStore {
  constructor(
    @InjectRepository(Payment)
    private paymentStore: Repository<Payment>,
  ) {}

  async createPayment(payment: OrderDataDto) {
    const data = {
      userId: payment.userId,
      orderId: payment.orderId,
      price: payment.price,
      currency: payment.currency,
      status: PaymentStatus.Created,
    };
    const newPayment = await this.paymentStore.create(data);
    const savedPayment = await this.paymentStore.save(newPayment);

    return savedPayment;
  }

  async UpdatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    reason?: string,
  ) {
    const updatedPayment = await this.paymentStore.update(
      { id: paymentId },
      { status, reason },
    );
    return updatedPayment;
  }

  async getPayment(paymentId: string): Promise<Payment> {
    return await this.paymentStore.findOne({
      where: { id: paymentId },
    });
  }
}
