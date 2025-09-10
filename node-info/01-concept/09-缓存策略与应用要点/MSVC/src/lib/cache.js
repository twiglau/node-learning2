

const { promisify } = require("util")
const redis = require('redis');
const NodeCache = require("node-cache");

class Cache {
  constructor(localCacheEnable=true,redisEnable=true) {
    this.localCacheEnable = localCacheEnable;
    this.redisEnable = redisEnable;

    if(localCacheEnable) {
      this.myCache = new NodeCache();
    }
    if(redisEnable) {
      this.client = redis.createClient({
        host: 'localhost',
        port: 6379,
        password: 'root'
      })
    }
  }

  /**
   * @description 获取缓存信息
   * @param {*} key 
   * @returns 
   */
  async get(key) {
    let value;
    if(this.localCacheEnable) {
      value = this.myCache.get(key);
      console.log(`local value is ${value}`);
    }
    if(!value && this.redisEnable) {
      try {
        await this.testRedis()
        value = await promisify(this.client.get).bind(this.client)(key);
        console.log(`redis value is ${value}`);
      } catch (error) {
        console.log( 'redist get error:', error);
      }
    }

    return value;
  }

  /**
   * @description 保存缓存信息
   * @param {*} key 缓存key
   * @param {*} value 缓存值
   * @param {*} expire 过期时间/秒
   * @param {*} cacheLocal 是否本地缓存
   * @returns 
   */
  async set(key, value, expire=10, cacheLocal=false) {
    let localCacheRet, redisRet;
    if(this.localCacheEnable && cacheLocal) {
      localCacheRet = this.myCache.set(key,value, expire);
    }
    if(this.redisEnable) {
      try {
        
        redisRet = await promisify(this.client.set).bind(this.client)(key, value, 'EX', expire);
        
      } catch (error) {
        console.log('redis set method error:', error);
      }
    }
    return localCacheRet || redisRet;
  }

  async getRedis() {
    if(!this.redisEnable) {
      return null;
    }
    return this.client;
  }
  // 测试 Redis 连接是否正常
  async testRedis() {
      try {
          await this.client.ping();
          console.log('Redis 连接正常');
      } catch (error) {
          console.error('Redis 连接失败:', error);
      }
  }
}

module.exports = function(localCacheEnable=true,redisEnable=true) {
  return new Cache(localCacheEnable, redisEnable);
}