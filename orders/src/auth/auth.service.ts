import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { GetUserSignInQuery } from '../user/queries/get-user-signin.query';

@Injectable()
export class AuthService {
  constructor(private queryBus: QueryBus, private jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    const user = await this.queryBus.execute(
      new GetUserSignInQuery({ username, password }),
    );
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
