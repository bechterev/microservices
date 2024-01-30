import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum SagaSteps {
  init = 0,
  paymentStart = 1,
  paymentSuccess = 2,
  notifyStart = 3,
  notifySuccess = 4,
  finish = 5,
}

@Entity()
export class Saga extends BaseEntity {
  @Column()
  orderId: string;

  @Column({ type: 'smallint' })
  step: SagaSteps;

  @Column({ default: false })
  completed: boolean;
}
