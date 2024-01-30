import { BaseEntity } from 'src/common/entities/base.entities';
import { Column, Entity } from 'typeorm';

export enum PaymentStatus {
  Created = 0,
  Pending = 1,
  Success = 2,
  Failed = 3,
}

@Entity()
export class Payment extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  orderId: string;

  @Column()
  price: number;

  @Column()
  currency: string;

  @Column({ type: 'smallint' })
  status: PaymentStatus;

  @Column({ nullable: true })
  reason?: string;
}
