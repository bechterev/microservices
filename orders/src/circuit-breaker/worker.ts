import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Interval } from '@nestjs/schedule';
import { CircuitBreakerState } from 'src/common/enum/circuit-breaker-state.enum';
import { CircuitBreakerCounts } from 'src/common/enum/circuit-breaker-counts.enum';

export class CircuitBreakerWorker {
  private readonly logger = new Logger(CircuitBreakerWorker.name);
  private readonly MAX_PROBLEM = 10;
  private readonly MAX_CYCLE = 3;
  private problemCycle = 0;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Interval(60000)
  async handleCircuitBreakerState(): Promise<void> {
    try {
      let failedDeliveryCount: number | undefined = await this.cacheManager.get(
        CircuitBreakerCounts.FailedDeliveryCount,
      );

      let currencyState: CircuitBreakerState | undefined =
        await this.cacheManager.get('circuitBreakerState');

      if (failedDeliveryCount === undefined) {
        failedDeliveryCount = 0;
        await this.cacheManager.set(
          CircuitBreakerCounts.FailedDeliveryCount,
          failedDeliveryCount,
        );
      }

      if (currencyState === undefined) {
        currencyState = CircuitBreakerState.IsClose;
        await this.cacheManager.set('circuitBreakerState', currencyState);
      }

      if (failedDeliveryCount > 0) {
        await this.pessimisticProcess(currencyState);
      } else {
        await this.optimisticProcess(currencyState);
      }

      this.logger.warn(
        `circuitBreakerState ${currencyState} : failedDeliveryCount ${failedDeliveryCount}`,
      );

      await this.cacheManager.set(CircuitBreakerCounts.FailedDeliveryCount, 0);

      this.logger.log('Circuit Breaker State Updated Successfully');
    } catch (error) {
      this.logger.error('Error updating circuit breaker state', error);
    }
  }

  private async pessimisticProcess(state: CircuitBreakerState): Promise<void> {
    if (state === CircuitBreakerState.IsClose && this.problemCycle === 0) {
      await this.cacheManager.set(
        'circuitBreakerState',
        CircuitBreakerState.HalfOpen,
      );
      return;
    }

    if (
      state === CircuitBreakerState.HalfOpen &&
      this.problemCycle > this.MAX_CYCLE
    ) {
      await this.cacheManager.set(
        'circuitBreakerState',
        CircuitBreakerState.IsOpen,
      );
      this.problemCycle = 0;
      return;
    }

    if (
      state === CircuitBreakerState.HalfOpen &&
      this.problemCycle <= this.MAX_CYCLE
    ) {
      this.problemCycle += 1;
    }
  }

  private async optimisticProcess(state: CircuitBreakerState): Promise<void> {
    if (state === CircuitBreakerState.IsOpen) {
      await this.cacheManager.set(
        'circuitBreakerState',
        CircuitBreakerState.HalfOpen,
      );
      this.problemCycle = 0;
      return;
    }

    if (state === CircuitBreakerState.HalfOpen) {
      await this.cacheManager.set(
        'circuitBreakerState',
        CircuitBreakerState.IsClose,
      );
      this.problemCycle = 0;
      return;
    }
  }
}
