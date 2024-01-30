import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandHandlers } from './commands/handlers';
import { UserStore } from './store/user.store';
import { UserService } from './services/user.service';
import { UserQueryHandlers } from './queries/handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  controllers: [UserController],
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  providers: [
    ...UserCommandHandlers,
    UserService,
    UserStore,
    ...UserQueryHandlers,
  ],
})
export class UserModule {}
