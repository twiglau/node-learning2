# 管道 Pipe

## 什么是管道

管道 Pipe 是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口
有两个典型的应用场景：

- 转换： 管道将输入数据转换为所需的数据输出（例如，将字符串转换为整数)
- 验证： 对输入数据进行验证，如果验证成功继续传递，验证失败则抛出异常

在这两种情况下，管道 参数(arguments) 会由 控制器(controllers)的路由处理程序 进行处理。
Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数， 进行转换或是验证处理，
然后用转换好或是验证好的参数调用原方法。

- 当在 Pipe 中发生异常， controller 不会继续执行任何方法。

## 验证

```lua
    请求
  - - - - -                   |   DateTransferObject |           |  Controller     |
    POST            - - - - > |       DTO            |  - - - >  |  Route Handler  |
  /auth/signin                |                      |           |                 |
  - - - - - -                            |
  {                                      |
    "username": "toimc",                 |
    "password": "123456"                 |
  }                                      |
  - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                Validation  Pipe
  - - - - - -  - - - - - - -  - - - - - - - -  - - - - - - - - -  - - - - - -  - - - -
  | class-transformer     |        |  class-validator      |      |    return 结果      |
  |   转化请求数据为       |        |   使用正则等逻辑进行    |      |  如果校验失败，立即  |
  |    DTO类的实例         |        |      校验             |      |     响应前端         |
```

## 管道类型

1. 控制器级别

```ts
@Controller()
@UsePipes(MyPipe)
export class UsersController {}
```

2. 变量

- 创建 class 类，即 Entity,DTO

```ts
// signin-user.dto.ts
import {
  IsNotEmpty,
  IsString,
  Length,
  ValidationArguments,
} from "class-validator";

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // message?: string | (validationArguments: ValidationArguments) -> string
    message: (validationArguments: ValidationArguments) => {
      const { value, property, targetName, constraints } = validationArguments;
      /**
       * value: 当前用户传入的值
       * property: 当前属性名
       * targetName: 当前类
       * constraints: 校验长度范围
       */
      return `用户名长度必须在${constraints}`;
    },
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
```

```ts
@Controller("auth")
export class AuthController {
  @Post("signup")
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}
```

3. 全局

```ts
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  // 配置全局 拦截器
  app.useGlobalPipes({
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true
    })
  });
  await app.listen(3000);
}

bootstrap();
```

## 校验类管道(DTO 参数校验)

- 创建基于 装饰器的校验的类管道，校验参数
  > dto 使用 PartialType, 跟 ts 中的 Partial 一样，变为可选参数

```ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
```

- 类验证器
  > `class-transformer`: 转化请求数据为 DTO 类的实例
  > `class-validator`: 使用正则等逻辑进行校验

```sh
npm i --save class-validator class-transformer
```

## 内置管道

- `ValidationPipe`,`ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseArrayPipe`
- `ParseUUIDPipe`, `ParseEnumPipe`, `DefaultValuePipe`, `ParseFilePipe`

```ts
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

@Controller("user")
export class UserController {
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return { id };
  }
}
```

## 自定义 pipe (多参数转换)

```lua
# nest g pi user/pipes/create-user -d
src
 |- user
     | - pipes
           |- create-user.pipe.ts
```

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log(value); // { username: 'xxxx', password: '123456' }
    console.log(metadata); // { metatype: [class CreateUserDto], type: 'body', data: undefined }

    // 对数据进行判断操作

    return value;
  }
}

// user.controller.ts 中使用
import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateUserPipe } from "./pipes/create-user.pipe";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("create")
  // 在Body装饰器中 传递pipe
  createUser(@Body(CreateUserPipe) dto: CreateUserDto) {
    return "ok";
  }
}
```

## Nestjs 中创建的管道的过程

1. 全局配置管道
2. 创建 class 类，即 Entity,DTO
3. 设置校验规则
4. 使用该实体类或者 DTO
