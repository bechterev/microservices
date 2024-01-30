import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { UserStore } from 'src/user/store/user.store';
import { User } from 'src/user/entity/user.entity';
import { UserErrorMessages } from 'src/common/exception/user.exception';

export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly store: UserStore) {}

  async execute(command: UpdateUserCommand): Promise<User | Error> {
    const user = await this.store.checkEmail(command.email);
    if (!user) {
      throw new Error(UserErrorMessages.USER_NOT_FOUND);
    }
    return await this.store.updateUser(command);
  }
}
