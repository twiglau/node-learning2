# 整合开发框架

## 示意图

```lua
                                    - - - - - -  -
                                      AppModule
                                    - - - - - - - -
                                    ConfigService
                                         |
                                         V
                                    {type: 'mysql', username: 'xx'....}
                                    - - - - - - -  -

      App Dev                                App Test                           App Prod

.env.development       |             .env.test                |         .env.production             |
      |                |                 |                    |                 |                   |         TypeORM CLI
      V                |                 V                    |                 V                   |
    dotEnv - > TypeORM |                dotEnv - >  TypeORM   |                dotEnv  ->   TypeORM |           ^
- - - - - - - -  - - - -             - - - - - - - - - - - - -          - - - - - - -  - - - - - - -            |
      ^                                    ^                                       ^                            |
      |- - - - - - -   - - -  - - - -  - - | - - - - - - - - -  - - - - - - - -  - | - -  - - - - - - - - -  - -
           |              |                       |                    |               |                |
        环境变量          .env                  ormconfig.json       ormconfig.js    ormconfig.js     ormconfig.yaml
```

## 数据库重构 使用 TypeORM-CLI 重构
