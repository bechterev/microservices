import { User } from '../entity/user.entity';

export class GetUserSignInQuery {
  constructor(readonly user: Pick<User, 'username' | 'password'>) {}
}
