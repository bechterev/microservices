import { SagaPaymentUpdateInfoDto } from '../dto/saga-payment-update-info.dto';

export class PaymentUpdateEvent {
  constructor(readonly walletInfo: SagaPaymentUpdateInfoDto) {}
}
