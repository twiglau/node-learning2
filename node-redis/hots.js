const Redis = require('ioredis')
const redis = new Redis(6379, '192.168.0.7', { password: 'root'})

var num = Math.round(Math.random() * 30 + 1);
var str = 'abcdefghkjlwer'
var strtap = Math.round(Math.random() * 11 + 0);

