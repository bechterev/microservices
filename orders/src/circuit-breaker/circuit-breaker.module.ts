import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/configs/config.module';
import { CircuitBreakerWorker } from './worker';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({ ttl: 0 }),
    ScheduleModule.forRoot(),
  ],
  providers: [CircuitBreakerWorker],
})
export class CircuitBreakerModule {}
