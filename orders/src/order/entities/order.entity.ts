import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum OrderState {
  init = 0,
  paid = 1,
  canceled = 2,
  finished = 3,
}

@Entity()
export class Order extends BaseEntity {
  @Column()
  userId: number;

  @Column({ type: 'varchar', array: true, default: null, nullable: true })
  products: string[] | null;

  @Column({ type: 'smallint' })
  state: OrderState;

  get isPaid() {
    return this.state === OrderState.paid;
  }

  get isCanceled() {
    return this.state === OrderState.canceled;
  }

  get isFinal() {
    return this.state === OrderState.finished;
  }

  pay(): void {
    if (this.isPaid) {
      return;
    }

    this.state = OrderState.paid;
  }

  cancel(): void {
    if (this.isCanceled) {
      return;
    }

    this.state = OrderState.canceled;
  }

  finish(): void {
    if (this.finish) {
      return;
    }
    this.finish;
  }
}
