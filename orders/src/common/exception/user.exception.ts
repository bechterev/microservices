export enum UserErrorMessages {
  USER_EXIST = 'user exists',
  USER_NOT_FOUND = 'user not found',
}
export const userMessagesRecord: Record<UserErrorMessages, string> = {
  [UserErrorMessages.USER_EXIST]: 'sorry, user email is already exists',
  [UserErrorMessages.USER_NOT_FOUND]: 'user not found',
};

export class UsersError extends Error {
  constructor(type: UserErrorMessages, message: string) {
    super(message);
    this.name = 'UsersError';
    this.type = type;
  }

  type: UserErrorMessages;
}
