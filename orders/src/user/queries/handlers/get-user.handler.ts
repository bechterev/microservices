import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { UserStore } from 'src/user/store/user.store';
import { User } from 'src/user/entity/user.entity';
import { CustomCatch } from 'src/common/exception/custom-catch';
import { UserErrorMessages } from 'src/common/exception/user.exception';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler {
  constructor(private readonly store: UserStore) {}

  @CustomCatch()
  async execute(query: GetUserQuery): Promise<User | Error> {
    const { id } = query;
    const user = await this.store.getUser(+id);
    if (!user) {
      throw new Error(UserErrorMessages.USER_NOT_FOUND);
    }

    return user;
  }
}
