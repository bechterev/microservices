import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitSagaCommand } from '../init-saga.command';
import { SagaStore } from 'src/order/stores/saga.store';
import { ProducerService } from 'src/order/services/amqp/producer.service';
import { StateService } from 'src/order/services/state.service';
import { delay } from 'src/common/utlis';
import { CircuitBreakerState } from 'src/common/enum/circuit-breaker-state.enum';

@CommandHandler(InitSagaCommand)
export class InitSagaCommandHandler
  implements ICommandHandler<InitSagaCommand>
{
  constructor(
    private sagaStore: SagaStore,
    private producerService: ProducerService,
    private readonly stateService: StateService,
  ) {}

  async execute(command: InitSagaCommand): Promise<any> {
    const { orderEvent } = command;
    const { orderId, currency, price, userId } = orderEvent;
    const newSaga = await this.sagaStore.initSaga({ orderId });

    const serviceStatus = await this.stateService.getStatusServices();
    if (serviceStatus === CircuitBreakerState.IsOpen) {
      throw new Error(`service payment is not available`);
    }
    if (serviceStatus === CircuitBreakerState.HalfOpen) {
      await delay(5000);
    }
    await this.producerService.addToQueue({
      sagaId: newSaga.id,
      orderId,
      currency,
      price,
      userId,
    });
  }
}
