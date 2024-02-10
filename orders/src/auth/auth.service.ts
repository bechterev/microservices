import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { GetUserSignInQuery } from '../user/queries/get-user-signin.query';
import { JWTConfig } from 'src/configs/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private queryBus: QueryBus,
    private jwtService: JwtService,
    private readonly jwtConfig: JWTConfig,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.queryBus.execute(
      new GetUserSignInQuery({ username, password }),
    );
    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.generateAccessToken({ userId: user.id });
    const refreshToken = await this.generateRefreshToken({ userId: user.id });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.expire_access,
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.expire_refresh,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const accessToken = await this.generateAccessToken({
        userId: decoded.userId,
      });
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
