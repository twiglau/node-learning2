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
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const db = this.configService.get(ConfigEnum.DB);
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const url = this.configService.get('DB_URL');
    // console.log('db:', db, url);

    // 方法二 yaml
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const db = this.configService.get('db');
    console.log('db', db);
    return this.userService.getUsers();
  }
}
