# 相关中间件和插件依赖

## koa-body

之前使用 koa2 的时候， 处理 post 请求使用的是 koa-bodyparser, 同时如果是图片上传使用的是 koa-multer. 这两者的组合没有问题， 不过 koa-multer 和 koa-route (注意不是 koa-router) 存在不兼容的问题。

koa-body 结合了二者， 所以 koa-body 可以对其进行代替。

## koa-json-error

在写接口时， 返回 json 格式且易读的错误提示是有必要的， koa-json-error 中间件帮助我们做到了这一点。

```js
// app/index.js
const error = require("koa-json-error");
const app = new Koa();

app.use(
  error({
    postFormat: (e, { stack, ...rest }) => {},
  })
);
```

错误会默认抛出堆栈信息 stack, 在生产环境中， 没必要返回给用户，在开发环境显示即可。

## koa-parameter

采用 koa-parameter 用于参数校验，它是基于参数验证框架 parameter,给 koa 框架做的适配。

```js
// app/index.js
const parameter = require('koa-parameter');
app.use(parameter(app));

// app/controller/users.js
async create(ctx) {
  ctx.verifyParams({
    name: { type: 'string', required: true },
    password: { type: 'string', required: true }
  })
}
```

## koa-static

如果网站提供静态资源 （图片，字体，样式，脚本...), 为它们一个个写路由就很麻烦，也没必要。 koa-static 模块封装了这部分的请求。

```js
// app/index.js
const Koa = require("koa");
const koaStatic = require("koa-static");
const app = new Koa();

app.use(koaStatic(path.join(__dirname, "public"));)
```
