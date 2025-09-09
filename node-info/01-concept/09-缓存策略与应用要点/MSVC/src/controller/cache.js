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
    let result = await redisCache.get(cacheKey);
    
    if(!result) {
      // result 为函数本地内存缓存
      result = 0;
      for(let i=0; i<1_000_000_000; i++) {
        result += i;
      }
       redisCache.set(cacheKey, result, 10).then();
    }

    let res = this.resApi(true, 'success', `sum 0 - 1_000_000_000 is ${result}`);
    console.log('res:', res);
    return res;
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