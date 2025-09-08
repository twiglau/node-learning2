const http = require('http');
const URL = require('url').URL;

const baseMongo = require('./baseMongodb')()

// 创建服务
const server = http.createServer(async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  
  const pathname = myUrl.pathname;
  

  if('/v1/userinfos' !== pathname) {
    return setResInfo(res, false, 'path not found', null, 404);
  }

  const user_ids = myUrl.searchParams.get('user_ids')
  if(!user_ids) {
    return setResInfo(res, false, 'params error');
  }

  const userInfo = await queryData({ 'id': { $in: user_ids.split(',')}});

  return setResInfo(res, true, 'success', userInfo);
  
})

// 启动服务
server.listen(5000, () => {
  console.log('server start http://127.0.0.1:5000')
})

async function queryData(queryOption) {
  const client = await baseMongo.getClient()
  const collection = client.db("nodejs_cloumn").collection("user");
  const queryArr = await collection.find(queryOption).toArray()

  return queryArr
}

function setResInfo(res, ret, message, dataInfo, httpStatus=200) {
  let retInfo = {}
  if(!ret) {
    retInfo = {
      'ret': -1,
      'message': message ? message : 'error',
      'data': {}
    }
  } else {
    retInfo = {
      'ret': 0,
      'message': message ? message : 'success',
      'data': dataInfo ? dataInfo : {}
    }
  }

  res.writeHead(httpStatus, { 'Content-Type': 'text/plain' })
  res.write(JSON.stringify(retInfo))
  res.end()
  return
}