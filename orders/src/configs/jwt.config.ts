import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class JWTConfig {
  public readonly secret: string;
  public readonly expire_access: string;
  public readonly expire_refresh: string;

  constructor(configService: ConfigService) {
    this.secret = configService.getString('JWT_SECRET');
    this.expire_access = configService.getString('JWT_EXPIRATION_ACCESS');
    this.expire_refresh = configService.getString('JWT_EXPIRATION_REFRESH');
  }
}
