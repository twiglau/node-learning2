const Redis = require('ioredis')
const redis = new Redis(6379, '192.168.0.7', { password: 'root'})

redis.set('my-key', 'value')
redis.keys('*').then(res => {
  console.log('res:', res)
})
