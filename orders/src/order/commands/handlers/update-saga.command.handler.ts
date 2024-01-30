import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSagaCommand } from '../update-saga.command';
import { SagaStore } from 'src/order/stores/saga.store';
import { SagaSteps } from 'src/order/entities/saga.entity';
import { Exchange, RabbitMQConfig } from 'src/configs/rabbit.config';
import { ProducerService } from 'src/order/services/amqp/producer.service';

const REASON_WALLET = 'lack of funds';

@CommandHandler(UpdateSagaCommand)
export class UpdateSagaCommandHandle
  implements ICommandHandler<UpdateSagaCommand>
{
  private exchange: Exchange;
  constructor(
    private sagaStore: SagaStore,
    private rabbitConfig: RabbitMQConfig,
    private producerService: ProducerService,
  ) {
    this.exchange = rabbitConfig.exchanges.sender[1];
  }
  async execute(command: UpdateSagaCommand): Promise<any> {
    const { balanceIsSufficient, paymentId, userId, sagaId, orderId } = command;
    if (balanceIsSufficient) {
      await this.sagaStore.updateStepSaga({
        id: sagaId,
        step: SagaSteps.paymentStart,
      });
      await this.producerService.addToQueue(
        {
          sagaId,
          userId,
          paymentId,
          orderId,
        },
        this.exchange,
      );
    } else {
      await this.producerService.addToQueue(
        {
          sagaId,
          userId,
          paymentId,
          reason: REASON_WALLET,
          orderId,
        },
        this.exchange,
      );
    }
  }
}
