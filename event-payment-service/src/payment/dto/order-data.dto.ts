import { SagaOrderDataDto } from './saga-order-data.dto';

export type OrderDataDto = Omit<SagaOrderDataDto, 'sagaId'>;
