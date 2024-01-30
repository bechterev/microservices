import { PaymentUpdateInfoDto } from './payment-update-info.dto';
import { SagaOrderDto } from './saga-order.dto';

export type SagaPaymentUpdateInfoDto = SagaOrderDto & PaymentUpdateInfoDto;
