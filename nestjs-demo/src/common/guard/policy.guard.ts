import {
  CaslAbilityService,
  EffectEnum,
  IPolicy,
  PolicyEnum,
} from '@/policy/casl-ability.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { permittedFieldsOf } from '@casl/ability/extra';

class Article {
  title: string;
  description: string;
  authorId: number;
  private: boolean;
}

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private caslAbilityService: CaslAbilityService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 通过 caslAbilityService 获取用户已有权限的实例
    // 通过 ability 实例上的 can, cannot 来判断用户是否有对应的权限
    // 接口权限 -> Policy 进行关联
    // 读取数据库中的接口关联的Policy与上面的ability之间逻辑判断
    // 从而对数据库实现数据权限控制
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
