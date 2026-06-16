import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: any) {
    const user = await this.usersService.create(body.email, body.password);
    // Don't return password
    const { password, ...result } = user;
    return result;
  }
}
