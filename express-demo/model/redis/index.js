const Redis = require('ioredis')
const Config = require('../../config/config.default')

const redis = new Redis(Config.REDIS_PORT, Config.REDIS_HOST, { 
    password: Config.REDIS_PASS
  });

redis.on('error', err => {
  if(err) {
    console.log('Redis 链式错误');
    console.log(err);
    redis.quit();
  }
})

redis.on('ready', () => {
  console.log('Redis链接成功');
})

exports.redis = redis;