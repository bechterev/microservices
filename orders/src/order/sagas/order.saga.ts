import { Injectable } from '@nestjs/common';
import { CommandBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrderAddedEvent } from '../events/order-added.event';

import { SagaStore } from '../stores/saga.store';
import { CreatePaymentEvent } from '../events/create-payment.event';
import { CheckWalletCommand } from '../commands/check-wallet.commad';
import { UpdateSagaCommand } from '../commands/update-saga.command';
import { InitSagaCommand } from '../commands/init-saga.command';
import { PaymentCompletEvent } from '../events/payment-complete.event';
import { InitNotifySagaCommand } from '../commands/init-notify-saga.command';
import { NotifyCompleteEvent } from '../events/notify-complete.event';
import { CompleteNotifySagaCommand } from '../commands/comlete-notify-saga.command';

@Injectable()
export class OrderSaga {
  constructor(
    private sagaStore: SagaStore,
    private readonly commandBus: CommandBus,
  ) {}
  @Saga()
  orderAdded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderAddedEvent),
      switchMap(async (event) => {
        return await this.commandBus.execute(new InitSagaCommand(event));
      }),
    );
  };

  @Saga()
  updatePayment = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreatePaymentEvent),
      switchMap(async (event) => {
        const { sagaId, payment } = event;
        const balanceIsSufficient = await this.commandBus.execute(
          new CheckWalletCommand(
            payment.userId,
            payment.price,
            payment.currency,
          ),
        );
        return await this.commandBus.execute(
          new UpdateSagaCommand(
            sagaId,
            payment.userId,
            payment.id,
            balanceIsSufficient,
            payment.orderId,
          ),
        );
      }),
    );
  };

  @Saga()
  notifyProcess = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentCompletEvent),
      switchMap(async (event) => {
        const { paymentComplete } = event;
        return this.commandBus.execute(
          new InitNotifySagaCommand(
            paymentComplete.sagaId,
            paymentComplete.orderId,
            paymentComplete.userId,
            paymentComplete.paymentStatus,
          ),
        );
      }),
    );
  };

  @Saga()
  notifyProcessComplete = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(NotifyCompleteEvent),
      switchMap(async (event) => {
        const { sagaId } = event;
        return this.commandBus.execute(new CompleteNotifySagaCommand(sagaId));
      }),
    );
  };
}
