# 拦截器 (Interceptor)

- 拦截器是使用 @Injectable() 装饰器注解的类，拦截器应该实现 NestInterceptor 接口
- 拦截器具有一系列有用的功能，这些功能受 切面编程(AOP) 技术的启发，它们可以：
  - 在函数执行之前、之后绑定 额外的逻辑
  - 转换从函数返回的结果
  - 转换从函数抛出的异常
  - 扩展基本函数行为
  - 根据所选条件完全重写函数(例如，缓存目的)

```lua
                                                                                             | - > Route Handler - 路由(Interceptor) - - |
                            |- - > 控制器(Interceptor) - Controller - 控制器(Interceptor) - - |                                           |
                            |                                                                | - > Route Handler - 路由(Interceptor) - - |
                            |                                                                                                            | - > 全局后置(Interceptor) - > 响应
请求 ->  全局(Interceptor) - |                                                                                                            |
                            | - - > Controller - - - - - - - - -  - - -     -  > 路由(Interceptor) - Route Handler - 路由(Interceptor) - -|
```
