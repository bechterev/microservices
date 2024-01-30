import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SagaStore } from 'src/order/stores/saga.store';
import { GetSagaQuery } from '../get-saga.query';
import { Saga } from 'src/order/entities/saga.entity';

@QueryHandler(GetSagaQuery)
export class getSagaQueryHandler implements IQueryHandler<GetSagaQuery> {
  constructor(private readonly sagaStore: SagaStore) {}
  async execute(query: GetSagaQuery): Promise<Saga> {
    const { sagaId } = query;
    return await this.sagaStore.getSaga(sagaId);
  }
}
