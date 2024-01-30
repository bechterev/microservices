import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JWTConfig } from 'src/configs/jwt.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtConfig: JWTConfig,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return true;
    }

    if (
      request.headers.authorization &&
      (request.headers.authorization as string).split(' ')[0] === 'Bearer'
    ) {
      try {
        const token = (request.headers.authorization as string).split(' ')[1];

        this.jwtService.verify(token, { secret: this.jwtConfig.secret });

        request.user = await this.jwtStrategy.validate(
          this.jwtService.decode(token),
        );
        return true;
      } catch (err) {
        throw new Error(`Unauthorize`);
      }
    }

    throw new Error(`Unauthorize`);
  }
}
