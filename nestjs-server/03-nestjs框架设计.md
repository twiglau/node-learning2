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
