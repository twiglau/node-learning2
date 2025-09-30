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

- `ormconfig.ts`

## 区别

- 方法的全名

```lua
Controller(控制器)                    Service(服务)                       Repositories
- - -  - -                           - - - - - - -                      - - - - - - - -
getAllUsers                           findAll()                          findAll()
- -  - -  -                          - - - -  - - -                     - - - - - - - -
getUserById                           findOne(id:number)                 findOne(id:number)
- - - -  - -                         - - - - - -  - -                    - - - - - - - -
createUser(dto:User)                  create(dto: User)                   create(dto: User)
```

- 服务与存储库的区别

```lua
|- - - - - - - - |                       | - - -  - -  - |
|  Service(服务) |                       | Repositories   |
- - - - - -  - - -                       | 存储库         |
  是一个Class                             - - - - - - - - -
  存放核心逻辑
  使用一个或多个存储库                      是一个Class
                                          与数据库进行交互
                                          返回实体类，模型等
```

## save() 和 insert(),update() 区别

## remove() 和 delete() 区别

1. remove 可以一次性删除单个或多个实例；并且 remove 可以触发 BeforeRemove,AfterRemove 钩子；

```js
await repository.remove(user);
await repository.remove([user, profile, logs]);
```

2. delete 可以一次性删除单个或者多个 id 实例，或者给定条件：

```js
await repository.delete(1);
await repository.delete([1, 2, 3]);
await repository.delete({ username: "toimc" });
```
