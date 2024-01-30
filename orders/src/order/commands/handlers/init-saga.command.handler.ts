import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitSagaCommand } from '../init-saga.command';
import { SagaStore } from 'src/order/stores/saga.store';
import { ProducerService } from 'src/order/services/amqp/producer.service';

@CommandHandler(InitSagaCommand)
export class InitSagaCommandHandler
  implements ICommandHandler<InitSagaCommand>
{
  constructor(
    private sagaStore: SagaStore,
    private producerService: ProducerService,
  ) {}

  async execute(command: InitSagaCommand): Promise<any> {
    const { orderEvent } = command;
    const { orderId, currency, price, userId } = orderEvent;
    const newSaga = await this.sagaStore.initSaga({ orderId });

    await this.producerService.addToQueue({
      sagaId: newSaga.id,
      orderId,
      currency,
      price,
      userId,
    });
  }
}
