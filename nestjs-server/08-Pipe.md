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

## 管道类型

1. 控制器级别

```ts
@Controller()
@UsePipes(MyPipe)
export class UsersController {}
```

2. 变量

```ts
@Controller()
export class UsersController {
  @Get('/users')
  findAllUsers(@Query('username', somePipe))
}
```

3. 全局

```ts
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(MyPipe);
  await app.listen(3000);
}

bootstrap();
```
