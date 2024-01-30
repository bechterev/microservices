import { InjectRepository } from '@nestjs/typeorm';
import { Saga, SagaSteps } from '../entities/saga.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SagaStore {
  constructor(
    @InjectRepository(Saga)
    private sagaRepository: Repository<Saga>,
  ) {}

  public async initSaga(saga: Partial<Saga>): Promise<Saga> {
    saga.step = SagaSteps.init;
    const newSaga = await this.sagaRepository.create(saga);
    return await this.sagaRepository.save(newSaga);
  }

  public async updateStepSaga(saga: Partial<Saga>): Promise<void> {
    await this.sagaRepository.update(
      {
        id: saga.id,
      },
      {
        step: saga.step,
      },
    );
  }

  public async completeSaga(saga: Partial<Saga>): Promise<void> {
    await this.sagaRepository.update(
      {
        id: saga.id,
      },
      {
        completed: saga.completed,
        step: saga.step,
      },
    );
  }

  public async getSaga(sagaId: string): Promise<Saga> {
    return await this.sagaRepository.findOne({
      where: {
        id: sagaId,
      },
    });
  }
}
