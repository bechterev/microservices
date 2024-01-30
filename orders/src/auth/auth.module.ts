import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthorizationController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from 'src/configs/config.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/configs/jwt.config';

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      useFactory: (jwtConfig: JWTConfig) => ({
        secret: jwtConfig.secret,
      }),
      inject: [JWTConfig],
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthorizationController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
