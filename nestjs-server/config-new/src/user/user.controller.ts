import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// 1. pino 使用
// import { Logger } from 'nestjs-pino';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import * as userDto from './dto/get-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@common.Controller('user')
@common.UseFilters(new TypeormFilter())
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

  @common.Get('/:id')
  getUser() {
    return 'hello user';
  }

  @common.Get()
  getUsers(@common.Query() query: userDto.getUserDto) {
    // page 页码，limit 每页条数, condition - 查询条件
    // (username, role, gender), sort 排序

    // 2. winston 需要显式调用
    this.logger.log(`请求getUsers成功`);

    // 方法二 yaml

    return this.userService.findAll(query);
  }

  @common.Post()
  addUser(@common.Body() dto: any): any {
    const user = dto as User;
    return this.userService.create(user);
  }

  @common.Patch('/:id')
  updateUser(@common.Body() dto: any, @common.Param('id') id: number): any {
    // todo 传递参数 id
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @common.Delete('/:id')
  deleteUser(@common.Param('id') id: number): any {
    return this.userService.remove(id);
  }

  @common.Get('/profile')
  getUserProfile(@common.Query('id') id: number): any {
    return this.userService.findProfile(id);
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
