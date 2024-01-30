import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserStore } from 'src/user/store/user.store';
import { GetAllUsersQuery } from '../get-all-users.query';
import { User } from 'src/user/entity/user.entity';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler {
  constructor(private readonly store: UserStore) {}

  async execute(query: GetAllUsersQuery): Promise<User[]> {
    return await this.store.getAllUsers();
  }
}
