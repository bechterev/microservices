import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthorizationController {
  private readonly authorizationService: AuthService;

  constructor(authService: AuthService) {
    this.authorizationService = authService;
  }

  @Post('/login')
  async login(@Body() body: Partial<User>): Promise<any> {
    const { username, password } = body;
    const response = await this.authorizationService.signIn(username, password);
    return response;
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshToken: string): Promise<any> {
    const response = await this.authorizationService.refreshToken(refreshToken);
    return response;
  }
}
