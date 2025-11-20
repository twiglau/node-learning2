import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/role-permission.decorator';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/role/role.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 拿到自定义的权限，元信息
    const classPermissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getClass(),
    );

    const handlerPermissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    const cls =
      classPermissions instanceof Array
        ? classPermissions.join('')
        : classPermissions;

    const handler =
      handlerPermissions instanceof Array
        ? handlerPermissions.join('')
        : handlerPermissions;

    const personal_right = `${cls}:${handler}`;

    const req = context.switchToHttp().getRequest();
    const { username } = req.user;
    const user = await this.userRepository.findOne(username);

    if (!user) {
      return false;
    }
    const permissions = await this.roleService.findAllByIds(
      user.UserRole.map((ele) => ele.roleId),
    );
    const permissionsArr = permissions
      .map((o) => o.RolePermissions.map((e) => e.permission.name))
      .reduce((acc, cur) => {
        // 需要对结果进行去重
        return [...new Set([...acc, ...cur])];
      }, []);

    console.log(personal_right, permissionsArr);

    return permissionsArr.includes(personal_right);
  }
}
