

const http = require('http');
const URL = require('url').URL
const CpuOverload = require('./util/cpuOverload')


const cpuOverload = new CpuOverload(10, 80, 0.8);

const baseFun = require('./util/baseFun');

// 路由映射
const routerMapping = {
  '/v1/contents': {
    'controller': 'content',
    'method': 'list'
  },
  'v1/test': {
    'controller': 'content',
    'method': 'test'
  },
  'v1/normal': {
    'controller': 'test-cpu',
    'method': 'normal'
  },
  'v1/cpu': {
    'controller': 'test-cpu',
    'method': 'bad'
  },
  'v1/io': {
    'controller': 'test-io',
    'method': 'bad'
  },
  'v1/normal-io': {
    'controller': 'test-io',
    'method': 'normal'
  },
}


const server = http.createServer(async (req, res) => {
  // 获取 get 参数
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  console.log(myUri, 'myUrl')
  const pathname = myUrl.pathname;

  if(!routerMapping[pathname]) {
    return baseFun.setResInfo(res, false, 'path not found', null, 404);
  }
  
  // 请求拦截，避免 cpu 过载
  if (!cpuOverload.isAvailable(pathname)) {
      res.write('server error')
      res.end();
      return
  }

  const ControllerClass = require(`./controller/${routerMapping[pathname]['controller']}`);

  try {
    const controllerObj = new ControllerClass(res, req);
    if(controllerObj[
      routerMapping[pathname]['method']
    ][
      Symbol.toStringTag
    ] === 'AsyncFunction') {
      return await controllerObj[routerMapping[pathname]['method']]()
    } else { // 普通方法直接调用
      return controllerObj[routerMapping[pathname]['method']]()
    }
  } catch (error) {
    // 异常时，需要返回 500 错误码 给前端
    console.log(error)
    return baseFun.setResInfo(res, false, 'server error', null, 500)
  }
})

server.listen(3000, () => {
  console.log('server start http://127.0.0.1:3000')
})

/**
 * 处理 cpu 信息采集
 */
cpuOverload.check().then().catch(err => {
    console.log(err)
});