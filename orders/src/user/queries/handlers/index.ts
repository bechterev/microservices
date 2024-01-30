import { GetAllUsersHandler } from './get-all-users.handler';
import { GetUserSignedInHandler } from './get-user-signin.handler';
import { GetUserQueryHandler } from './get-user.handler';

export const UserQueryHandlers = [
  GetAllUsersHandler,
  GetUserQueryHandler,
  GetUserSignedInHandler,
];
