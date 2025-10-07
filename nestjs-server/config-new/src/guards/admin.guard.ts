import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  // 常见的错误：在使用 AdminGuard 未导入 UserModule
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    // 2. 获取请求中的用户信息进行
    // 逻辑上的判断 -> 角色判断
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const user = (await this.userService.find(req.user.username)) as User;

    // 普通用户
    // 后面加入更多的逻辑
    if (user && user.roles.filter((o) => o.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
