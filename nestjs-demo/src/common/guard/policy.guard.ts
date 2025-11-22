import {
  CaslAbilityService,
  EffectEnum,
  IPolicy,
  PolicyEnum,
} from '@/access-control/policy/casl-ability.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { permittedFieldsOf } from '@casl/ability/extra';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PermissionService } from '@/access-control/permission/permission.service';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/access-control/role/role.service';
import { PERMISSION_KEY } from '../decorators/role-permission.decorator';

class Article {
  title: string;
  description: string;
  authorId: number;
  private: boolean;
}

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private caslAbilityService: CaslAbilityService,
    private reflector: Reflector,
    private configService: ConfigService,
    private permissionService: PermissionService,
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 通过 caslAbilityService 获取用户已有权限的实例
    // 通过 ability 实例上的 can, cannot 来判断用户是否有对应的权限
    // 接口权限 -> Policy 进行关联
    // 读取数据库中的接口关联的Policy与上面的ability之间逻辑判断
    // 从而对数据库实现数据权限控制

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

    // 1. 获取 permission name: 装饰器 handler&class
    const personal_right = `${cls}:${handler}`;
    // 2. 获取 policy: 通过 permission
    const permissionPolicy =
      await this.permissionService.findByName(personal_right);
    console.log('PolicyGuard permissionPolicy:', permissionPolicy);
    // 3. 缩小范围：policy -> subjects -> 缩小PermissionPolicy的查询范围
    const subjects = permissionPolicy?.PermissionPolicy.map(
      (p) => p.policy.subject,
    );
    // 4. username -> User -> policy & subjects 用户已分配接口权限
    const req = context.switchToHttp().getRequest();
    const { username } = req.user;
    const user = await this.userRepository.findOne(username);

    const roleIds = user?.UserRole.map((role) => role.roleId);
    const rolePolicies = await this.roleService.findAllByIds(roleIds);

    console.log('policy gurad user:', rolePolicies);
    const polices: IPolicy[] = [
      // {
      //   type: PolicyEnum.json,
      //   effect: EffectEnum.can,
      //   action: 'read',
      //   subject: 'Article',
      //   fields: ['title', 'description'],
      //   conditions: { private: false },
      // },
      // {
      //   type: PolicyEnum.mongo,
      //   effect: EffectEnum.can,
      //   action: 'read',
      //   subject: 'Article',
      //   conditions: {
      //     $nor: [{ authorId: 1 }, { private: true }],
      //   },
      // },
      {
        type: PolicyEnum.func,
        effect: EffectEnum.can,
        action: 'read',
        subject: 'Article',
        conditions: '({authorId}) => authorId === user.id',
        args: 'user',
      },
    ];
    const abilities = this.caslAbilityService.buildAbility(polices, [
      { id: 1 },
    ]);
    const ARTICLE_FIELDS = [
      'title',
      'description',
      'authorId',
      'published',
      'private',
    ];
    const options = {
      fieldsFrom: (rule) => rule.fields || ARTICLE_FIELDS,
    };
    const article = new Article();
    article.authorId = 1;
    article.private = false;

    for (const ability of abilities) {
      const fields = permittedFieldsOf(ability, 'read', article, options);
      const flag = ability.can('read', article, 'title');
      console.log('PolicyGuard ~flag~', flag, fields);
    }

    return true;
  }
}
