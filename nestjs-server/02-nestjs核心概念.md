# nestjs 架构： 控制器，服务，数据访问

## Nestjs 核心概念

```lua
          请求              使用服务              数据库
客户端 <- - - - > 控制器 <- -  - - - - > 服务 <- - - - - - - > 数据接入
          响应              依赖注入              持久化
```

- Controller 层负责处理请求，返回响应；
- Service 层负责提供方法和操作，只包含业务逻辑；
- Data Access 层负责访问数据库中的数据；

```lua
|    Nestjs 概念   |
- - - - - - - - - -
|     控制器       |  - - > 处理请求
|    Controllers  |
- - - - - - - - - -
|     服务        |  - - >  数据访问与核心逻辑
|    Services    |
- - - - - -  - - -
|     模块       |   - - 》 组合所有的逻辑代码
|    Modules    |
- - -  - - -  - -
|    管道        |   - - > 核验请求的数据
|    Pipes      |
- - - -  - - -  -
|   过滤器       |   - - > 处理请求时的错误
|   Filters     |
- - - -  - - -  -
|    守卫       |   - - >  鉴权与认证相关
|    Guards    |
- - - -  - -  - -
|    拦截器      |   - - > 给请求与响应加入额外的逻辑
|   Interceptors |
- - - - - -  - - -
|    存储库     |    - - >  处理在数据库中数据
|  Repositories |
- - - - -  - -  -
```

## Nestjs 生命周期

- 钩子方法： 定一个空的函数，用户可以自定义该方法来改变原有的逻辑

```lua
客户端   - - - > 中间件 - - - > 守卫 - - - - > 拦截器 - - - - > 管道
 |                                                             |
响应 < - - - - - - 过滤器 < - - 拦截器 <- - -  服务 <- - - -   控制器
```

- 中间件： 全局中间件，模块中间件
- 守卫：全局守卫，控制器守卫，路由守卫
- 拦截器： 全局拦截器 pre, 控制器拦截器 pre, 路由拦截器 pre

  - 【对数据脱敏处理， 在 -服务- 之后， -响应- 之前处理，如不把用户密码等字段返回给用户】

- 管道： 全局管道，控制器管道，路由管道，路由参数管道
- 拦截器： 路由拦截器 post, 控制器拦截器 post, 全局拦截器 post
- 过滤器： 路由过滤器，控制器过滤器，全局过滤器

## Nestjs 用模块来组织代码

```lua
                Application Module

Users Module         Orders Module             Chat Module

              Feature Module 1 | Module 2    Feature Module 3
```

- 使用 Module 来组织应用程序
- @Module 装饰器来描述模块
- 模块中有 4 大属性：imports, providers, controllers, exports

```lua
功能模块  - 功能模块与共享模块是一回事，只是叫法不一样
共享模块
全局模块  - 全局模块通常应用在配置，数据库连接，日志上
动态模块  - 动态模块是在使用到模块的时候才初始化
```

## MVC 是什么？DTO ? DAO?

- Data Transfer Object 数据传输对象
- Data Access Object 数据访问对象

```lua

请求 - -> DTO  <- - - > 逻辑 < - - - - > DAO  - - - > 数据库
        接受部分数据，                 对接数据库接口
        对数据进行筛选                 不暴露数据库的内部信息
        不对应实体                     对应实体
        属性是小于等于实体
```

```lua
# Nestjs中的DTO
src
| - cats
|    | - dto
|    |    |- create-cat.dto.ts
|    | - interfaces
|    |    |- cat.interface.ts
|    |- cats.service.ts
|    |- cats.controller.ts
|    |- - cats.module.ts
|- app.module.ts
|- main.ts
```

```ts
# 约定了数据字段，属性
# 方便数据校验 (类型)
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

```ts
// Nestjs 中实体类
@@filename(user.entity)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
```

- DAO 是一层逻辑：包含实体类，数据库操作(CURD),数据校验，错误处理等。
- Nestjs 做了一层更高级的封装，通过 ORM 库与种类数据库对接，而这些 ORM 库就是 DAO 层。
