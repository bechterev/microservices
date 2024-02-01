import { Injectable, Logger } from '@nestjs/common';
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
  private logger = new Logger(OrderSaga.name);
  constructor(
    private sagaStore: SagaStore,
    private readonly commandBus: CommandBus,
  ) {}
  @Saga()
  orderAdded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderAddedEvent),
      switchMap(async (event) => {
        try {
          return await this.commandBus.execute(new InitSagaCommand(event));
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );
  };

  @Saga()
  updatePayment = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreatePaymentEvent),
      switchMap(async (event) => {
        try {
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
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );
  };

  @Saga()
  notifyProcess = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentCompletEvent),
      switchMap(async (event) => {
        try {
          const { paymentComplete } = event;
          return this.commandBus.execute(
            new InitNotifySagaCommand(
              paymentComplete.sagaId,
              paymentComplete.orderId,
              paymentComplete.userId,
              paymentComplete.paymentStatus,
            ),
          );
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );
  };

  @Saga()
  notifyProcessComplete = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(NotifyCompleteEvent),
      switchMap(async (event) => {
        try {
          const { sagaId } = event;
          return this.commandBus.execute(new CompleteNotifySagaCommand(sagaId));
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );
  };
}
