

const Koa = require('koa');
const app = new Koa();

const routerMiddleware = require('./src/middleware/newRouter');
const logCenter = require("./src/middleware/logCenter");
const session = require('./src/middleware/session');

// const dumpFun = require('./src/lib/heapdump'); 

// 在 app.js 或入口文件中
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('全局错误:', err);
        ctx.status = err.status || 500;
        ctx.body = {
            success: false,
            message: err.message || '内部服务器错误'
        };
    }
});

app.use(logCenter());
app.use(session());
app.use(routerMiddleware());


app.listen(3000, () => console.log(`Example app listening on port 3000!`));


/// 为了方便，可以打开如下代码自动获取
// const currentDate = new Date();
// dumpFun('nodejs-cloumn', `${currentDate.getHours()}:${currentDate.getMinutes()+1}`, 60);