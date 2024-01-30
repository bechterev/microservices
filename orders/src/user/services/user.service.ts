import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { User } from '../entity/user.entity';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { CreateUserCommand } from '../commands/create-user.command';
import { UpdateUserCommand } from '../commands/update-user.command';

@Injectable()
export class UserService {
  constructor(
    private readonly commadBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  public getUser(id: number): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  public getAllUsers(): Promise<User[]> {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  public createUser(user: User): Promise<User> {
    const { username, password, email } = user;
    return this.commadBus.execute(
      new CreateUserCommand(username, password, email),
    );
  }

  public updateUser(user: User): Promise<User> {
    const { username, password, email } = user;
    return this.commadBus.execute(
      new UpdateUserCommand(username, password, email),
    );
  }
}
