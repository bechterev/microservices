import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CircuitBreakerCounts } from 'src/common/enum/circuit-breaker-counts.enum';

@Injectable()
export class StateService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getStatusServices() {
    return await this.cacheManager.get('circuitBreakerState');
  }

  async addCountSending() {
    const successfulDeliveryCount: number = await this.cacheManager.get(
      CircuitBreakerCounts.SendingCount,
    );
    await this.cacheManager.set(
      CircuitBreakerCounts.SendingCount,
      successfulDeliveryCount + 1,
    );
  }

  async addCountOverdue() {
    const failedDeliveryCount: number = await this.cacheManager.get(
      CircuitBreakerCounts.FailedDeliveryCount,
    );
    await this.cacheManager.set(
      CircuitBreakerCounts.FailedDeliveryCount,
      failedDeliveryCount + 1,
    );
  }
}
