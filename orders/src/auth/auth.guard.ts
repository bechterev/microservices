import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JWTConfig } from 'src/configs/jwt.config';
import { CustomCatch } from 'src/common/exception/custom-catch';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtConfig: JWTConfig,
  ) {}

  @CustomCatch()
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    if (
      request.headers.authorization &&
      (request.headers.authorization as string).split(' ')[0] === 'Bearer'
    ) {
      const token = (request.headers.authorization as string).split(' ')[1];
      const decodedToken: any = this.jwtService.decode(token);
      if (
        !decodedToken ||
        !decodedToken.exp ||
        decodedToken.exp * 1000 < Date.now()
      ) {
        throw new UnauthorizedException('Token expired');
      }

      request.user = await this.jwtStrategy.validate(decodedToken);
      return true;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
