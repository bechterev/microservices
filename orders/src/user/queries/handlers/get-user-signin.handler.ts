import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/user/entity/user.entity';
import { UserStore } from 'src/user/store/user.store';
import { GetUserSignInQuery } from '../get-user-signin.query';

@QueryHandler(GetUserSignInQuery)
export class GetUserSignedInHandler implements IQueryHandler {
  constructor(private readonly store: UserStore) {}

  execute(query: Pick<User, 'username' | 'password'>): Promise<User> {
    return this.store.getUserSignIn(query);
  }
}
