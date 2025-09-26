import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// 1. pino 使用
// import { Logger } from 'nestjs-pino';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
import { UserService } from './user.service';

@common.Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // 1. pino 使用
    // private logger: Logger,

    // 2. winston 使用
    // 缺点：需要打印日志的时候，需要手动导入 logger
    // 2.1 写法
    // @Inject(Logger) private readonly logger: LoggerService
    // 2.2 写法
    // private readonly logger: Logger,

    // 3. winston 封装
    @common.Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: common.LoggerService,
  ) {}

  @common.Get()
  getUsers() {
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const db = this.configService.get(ConfigEnum.DB);
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const url = this.configService.get('DB_URL');
    // console.log('db:', db, url);

    // 2. winston 需要显式调用
    this.logger.log(`请求getUsers成功`);

    // 方法二 yaml

    return this.userService.findAll();
  }

  @common.Post()
  addUser(): any {
    const user = { username: 'toimc', password: '123456' } as User;

    return this.userService.create(user);
  }

  @common.Patch()
  updateUser(): any {
    // todo 传递参数 id
    const user = { username: 'newname' } as User;
    return this.userService.update(1, user);
  }

  @common.Delete()
  deleteUser(): any {
    // todo 传递参数id
    return this.userService.remove(1);
  }

  @common.Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(2);
  }

  @common.Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @common.Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    return res;
  }
}
