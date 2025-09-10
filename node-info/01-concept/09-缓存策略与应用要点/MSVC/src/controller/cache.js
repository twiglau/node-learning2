const Controller = require("../core/controller");

const cache = require("../lib/cache")(true, false);
const redisCache = require("../lib/cache")(false, true);
const bothCache = require("../lib/cache")(true, true);

class Cache extends Controller {

  async local() {
    const cacheKey = "sum_result";
    let result = await cache.get(cacheKey);
    if(!result) {
      result = 0;
      for(let i=0; i<1_000_000_000; i++) {
        result += i;
      }
      cache.get(cacheKey, result, 10, true).then();
    }
    return this.resApi(true, 'success', `sum 0 - 1_000_000_000 is ${result}`);
  }

  async redis() {
    const cacheKey = "sum_result";

    try {
      let result =  await redisCache.get(cacheKey).catch(err => console.log(err));
    
      if(!result) {
        // result 为函数本地内存缓存
        result = 0;
        for(let i=0; i<1_000_000_000; i++) {
          result += i;
        }
        // 1 .then() 没有错误处理，如果 Redis 操作失败，会产生未处理的 Promise 拒绝，导致后续代码无法正常执行。
        redisCache.set(cacheKey, result, 10).then().catch(err => console.log('set error:', err));
      }
      // 2. Koa 中间件中如果发生未捕获的异常，框架会自动返回 "Not Found" 或 500 错误。

      let res = this.resApi(true, 'success', `sum 0 - 1_000_000_000 is ${result}`);
      
      return res;
      // return res;
    } catch (error) {
      console.log('error:', error)
    }
  }

  async both() {
    const cacheKey = "sum_result";
    let result = await bothCache.get(cacheKey);
    if(!result) {
      // result 为函数本地内存缓存
      result = 0;
      for(let i=0; i<1_000_000_000; i++) {
        result += i;
      }
      bothCache.set(cacheKey, result, 600, true).then()
    }

    return this.resApi(true, 'success', `sum 0 - 1_000_000_000 is ${result}`);
  }
}

module.exports = Cache;