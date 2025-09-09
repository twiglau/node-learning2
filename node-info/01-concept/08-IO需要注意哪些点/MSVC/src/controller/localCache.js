

const NodeCache = require("node-cache");
const cacheHandle = new NodeCache();

const Controller = require("../core/controller");

class LocalCache extends Controller {

  yes() {
    let result = cacheHandle.get('result');
    if(!result || result === 0) {
      // result 为函数 本地内存缓存
      result = 0;
      for(let i=0; i< 1_000_000_000; i++) {
        result += i;
      }
      cacheHandle.set('result', result);
    }
    return this.resApi(true, 'success', `cache sum 0 - 1_000_000_000 is ${result}`)
  }

  no() {
    let sum = 0;
    for(let i=0; i < 1_000_000_000; i++) {
      sum += i;
    }
    return this.resApi(true, 'success', `no cache sum 0 - 1_000_000_000 is ${sum}`);
  }
}

module.exports = LocalCache;