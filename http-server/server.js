// 1. 导入 http 模块
var http = require('http')
// 2. 创建服务器
// 获取服务器的实例对象
var server = http.createServer()

server.listen(8080, function() {
  console.log('http://127.0.0.1:8080')
})

server.on('request', function(req, res) {
  res.setHeader('Content-type', 'text/plain;charset=utf-8')
  res.write('测试')
  res.end()
})
