
const mongoose = require('mongoose');
const { MONGOPATH } = require('../config/config.default')

async function main() {
  await mongoose.connect(MONGOPATH)
}

main().then(res => {
  console.log('mongo连接成功')
}).catch(err => {
  console.log('mongo连接失败',err)
})

module.exports = {
  User: mongoose.model('User', require('./user')),
  Video: mongoose.model('Video', require('./video')),
  Subscribe: mongoose.model('Subscribe', require('./subscribe')),
  Videocomment: mongoose.model('Videocomment', require('./videocomment')),
  Videolike: mongoose.model('Videolike', require('./videolike')),
  Collect: mongoose.model('Collect', require('./collect'))
}