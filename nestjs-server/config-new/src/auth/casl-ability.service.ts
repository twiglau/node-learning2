import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  Subject,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Menus } from 'src/menus/menus.entity';
import { UserService } from 'src/user/user.service';
import { getEntities } from 'src/utils/common';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  async forRoot(username: string) {
    // 针对于整个系统的 -> createUser XX system
    const { can, build } = new AbilityBuilder(createMongoAbility);

    // can('manage', 'all')
    // menu 名称，路径，acl -> actions -> 名称，路径 -> 实体对应
    // path -> prefix -> 写死在项目代码里

    // 其他思路： acl -> 表来进行存储 -> LogController + Action
    // log -> sys:log -> sys:log:read, sys:log:write ...
    const user = await this.userService.find(username);
    // user -> 1:n roles -> 1:n menus -> 去重 {}
    const obj = {} as Record<string, unknown>;
    user?.roles.forEach((o) => {
      o.menus.forEach((menu) => {
        // path -> acl -> actions
        // 通过Id去重
        obj[menu.id] = menu;
      });
    });

    const menus = Object.values(obj) as Menus[];
    menus.forEach((menu) => {
      const actions = menu.acl.split(',');
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        can(action, getEntities(menu.path));
      }
    });

    const ability = build({
      detectSubjectType: (obj) =>
        obj.constructor as ExtractSubjectType<Subject>,
    });

    return ability;
  }
}
