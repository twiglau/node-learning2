import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('/list')
  getUsers() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const db = this.configService.get('DB');
    console.log('db:', db);
    return this.userService.getUsers();
  }
}
