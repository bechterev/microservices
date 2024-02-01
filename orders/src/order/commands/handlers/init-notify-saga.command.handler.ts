import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InitNotifySagaCommand } from '../init-notify-saga.command';
import { SagaStore } from 'src/order/stores/saga.store';
import { SagaSteps } from 'src/order/entities/saga.entity';
import { OrderStore } from 'src/order/stores/order.store';
import { OrderState } from 'src/order/entities/order.entity';
import { GetUserQuery } from 'src/user/queries/get-user.query';
import { GetOrderQuery } from 'src/order/queries/get-order.query';
import { UserErrorMessages } from 'src/common/exception/user.exception';
import { CustomCatch } from 'src/common/exception/custom-catch';
import { Exchange, RabbitMQConfig } from 'src/configs/rabbit.config';
import { ProducerService } from 'src/order/services/amqp/producer.service';
import { delay } from 'src/common/utlis';
import { StateService } from 'src/order/services/state.service';
import { CircuitBreakerState } from 'src/common/enum/circuit-breaker-state.enum';

@CommandHandler(InitNotifySagaCommand)
export class InitNotifySagaCommandHandler
  implements ICommandHandler<InitNotifySagaCommand>
{
  private exchange: Exchange;
  constructor(
    private readonly sagaStore: SagaStore,
    private readonly orderStore: OrderStore,
    private readonly queryBus: QueryBus,
    private readonly rabbitConfig: RabbitMQConfig,
    private readonly producerService: ProducerService,
    private readonly stateService: StateService,
  ) {
    this.exchange = rabbitConfig.exchanges.sender[2];
  }
  @CustomCatch()
  async execute(command: InitNotifySagaCommand): Promise<any> {
    const { orderId, paymentStatus, userId, sagaId } = command;

    let orderStatus: OrderState;
    if (paymentStatus === 3) {
      orderStatus = OrderState.canceled;
    }
    const user = await this.queryBus.execute(new GetUserQuery(userId));

    if (!user) throw new Error(UserErrorMessages.USER_NOT_FOUND);

    await Promise.all([
      this.sagaStore.updateStepSaga({
        id: sagaId,
        step: SagaSteps.notifyStart,
      }),
      this.orderStore.updateOrderState({
        id: orderId,
        state: orderStatus,
      }),
    ]);
    const serviceStatus = await this.stateService.getStatusServices();
    if (serviceStatus === CircuitBreakerState.IsOpen) {
      throw new Error(`service notify is not available`);
    }
    if (serviceStatus === CircuitBreakerState.HalfOpen) {
      await delay(5000);
    }
    const order = await this.queryBus.execute(new GetOrderQuery(orderId));
    await this.producerService.addToQueue(
      {
        sagaId: sagaId,
        email: user.email,
        order,
      },
      this.exchange,
    );
  }
}
