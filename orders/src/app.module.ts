import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    OrderModule,
    DatabaseModule,
    CircuitBreakerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
