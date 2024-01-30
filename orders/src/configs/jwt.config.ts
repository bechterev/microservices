import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class JWTConfig {
  public readonly secret: string;

  constructor(configService: ConfigService) {
    this.secret = configService.getString('JWT_SECRET');
  }
}
