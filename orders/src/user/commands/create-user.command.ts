export class CreateUserCommand {
  constructor(
    readonly username: string,
    readonly password: string,
    readonly email: string,
  ) {}
}
