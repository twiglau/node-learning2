# 框架设计: 考虑 4 大块内容

```lua
控制器          - - - >   处理请求
Controllers
服务            - - - >   数据访问与核心逻辑
Services
模块            - - - >   组合所有的逻辑代码
Modules
管道            - - - >   核验请求的数据
Pipes
过滤器          - - - >   处理请求时的错误
Filters
守卫            - - - >   鉴权与认证相关
Guards
拦截器          - - - >   给请求与响应加入额外的逻辑
Interceptors
存储库          - - - >   处理在数据库中数据
Repositories
```

## 多环境配置方案比较： dotenv vs config

## Nestjs 配置模块： 多环境配置读取，配置校验 joi

```lua
# GET获取所有用户
                               接口服务
---------------------------------------------------------------------------
请求数据校验  - - > 请求认证（鉴权设计） - - >  路由  - - > 功能逻辑  - - > 数据库操作
  Pipe                  Guard               Controller    Service       Repository
```

## 通用后端框架思考

- 从开发层面的思考
- 从功能层面的思考
- 从接口安全层面的思考

```lua
# 关于接口服务
# 多环境配置 -> 生产，测试 -> 数据库
# 通用模块: 用户，权限，菜单，日志
# 最后：接口文档，接口请求安全&性能

- - - - - - - -
    接口服务
- - - - - - - -
|  配置 | 数据库 |
|- - - -| 操作   |
| 日志  |        |
|- - - - - - - - |
```

## DI 容器，工作原理, 按顺序调用

- 所有 @Injectable 与 Providers 里面的类

1. 注册所有 有@Injectable() 注解的类
2. 通过 Constructor 了解 类与类之间的 依赖关系

- Nestjs 自动完成

3. Nestjs 自动创建 @Injectable() 注解的类实例
4. Nestjs 自动创建 依赖关系 的实例
5. 按需进行调用

## TypeORM 容器 工作原理

```lua
                        Nestjs DI 容器
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  -
 User   - - >    User            TypeORM    - - >  TypeORM
Module          Service           Module          Repository

                                  TypeORM
                                   Entity
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                         所有实例
- - - -  - - - - -  - - - - - - - - - - - - - - - - - - - -  - -
userService                    typeORMRepo
- - - - - -      - - - - - - - - - - - - - - - - - - - - - - - -
  getAll()         create()  |     save()  |    find()
                 - - - - - -  - -  - - - - - - - - - - -  - - -
   . . .           findOne() |   remove()  |
- - - - - -
```
