import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UserStore } from 'src/user/store/user.store';
import { User } from 'src/user/entity/user.entity';
import { CustomCatch } from 'src/common/exception/custom-catch';
import { UserErrorMessages } from 'src/common/exception/user.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly store: UserStore) {}

  @CustomCatch()
  async execute(command: CreateUserCommand): Promise<User | Error> {
    const { username, password, email } = command;

    const userExist = await this.store.checkEmail(email);
    if (userExist) {
      throw new Error(UserErrorMessages.USER_EXIST);
    }
    const user = new User();
    user.password = password;
    user.username = username;
    user.email = email;
    return await this.store.createUser(user);
  }
}
