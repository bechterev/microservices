import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteNotifySagaCommand } from '../comlete-notify-saga.command';
import { SagaStore } from 'src/order/stores/saga.store';
import { SagaSteps } from 'src/order/entities/saga.entity';
import { OrderErrorMessages } from 'src/common/exception/order.exception';
import { CustomCatch } from 'src/common/exception/custom-catch';

@CommandHandler(CompleteNotifySagaCommand)
export class CompleteNotifySagaCommandHandler
  implements ICommandHandler<CompleteNotifySagaCommand>
{
  constructor(private readonly sagaStore: SagaStore) {}
  @CustomCatch()
  async execute(command: CompleteNotifySagaCommand): Promise<any> {
    const saga = await this.sagaStore.getSaga(command.sagaId);
    if (!saga || saga.completed) {
      throw new Error(OrderErrorMessages.ORDER_SAGA_NOT_FOUND);
    }
    saga.completed = true;
    saga.step = SagaSteps.notifySuccess;
    await this.sagaStore.completeSaga(saga);
  }
}
