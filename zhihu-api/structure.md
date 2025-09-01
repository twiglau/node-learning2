# 项目结构

```lua
|-- rest_node_api
     |-- .gitignore
     |-- README.d
     |-- package-lock.json
     |-- package.json # 项目依赖
     |-- app
         |-- config.js       # 数据库（mongodb) 配置信息
         |-- index.js        # 入口
         |-- controllers     # 控制器： 用于解析用户输入，处理后返回相应的结果
         |-- modals          # 模型（schema): 用于定义数据模型
         |-- public          # 静态资源
         |-- routes          # 路由
```

## Controller (控制器)

### 什么是控制器？

- 拿到路由分配的任务并执行
- 在 Koa 中是一个中间件

### 为什么要用控制器

- 获取 HTTP 请求参数
  - Query String, 如：?q=keyword
  - Router Params, 如： /users/:id
  - Body, 如：{name: 'jack'}
  - Header, 如: Accept, Cookie
- 处理业务逻辑
- 发送 HTTP 响应
  - 发送 Status, 如 200/400
  - 发送 Body, 如 {name: 'jack'}
  - 发送 Header, 如 Allow, Content-Type

### 缩写控制器的最佳实践

- 每个资源的控制器放在不同的文件里
- 尽量使用类 + 类方法的形式编写控制器
- 严谨的错误处理

```js
// app/controller/users.js
const user = require("../models/users");
class UserController {
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户名已存在");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
}

module.exports = new UserController();
```

### 错误处理机制

- koa 自带错误处理
  > 要执行自定义错误处理逻辑，如 集中式 日志记录，您可以添加一个 "error" 事件侦听器。

```js
app.on("error", (err) => {
  log.error("server error", err);
});
```
