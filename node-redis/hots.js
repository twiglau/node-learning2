const Redis = require('ioredis')
const redis = new Redis(6379, '192.168.0.4', { password: 'root'})

var num = Math.round(Math.random() * 30 + 1);
var str = 'abcdefghkjlwer'
var strtap = Math.round(Math.random() * 11 + 0);

async function jihe() {
  console.log('jihe -1:', num, strtap)
  var data = await redis.zscore('hots', str[strtap])

  if(data) {
    await redis.zincrby('hots', 1, str[strtap])
    console.log(str[strtap] + '+1');
  } else {
    var write = await redis.zadd('hots', num, str[strtap])
    console.log('写入' + str[strtap] + write);
  }

  var paixun = await redis.zrevrange('hots', 0, -1, 'withscores')
  
  var obj = {}
  for(let i = 0; i < paixun.length; i++) {
    if(i%2 === 0) {
      obj[paixun[i]] = paixun[i+1]
    }
  }
  console.log(obj);
}

jihe()