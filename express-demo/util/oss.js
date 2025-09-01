const OSS = require('ali-oss')
const fs = require('fs')
const config = require('../config/config.default')

const client = new OSS({
   region: config.OSS_REGION,
   accessKeyId: config.OSS_ACCESS_KEY_ID,
   accessKeySecret: config.OSS_SECRET_ACCESS_KEY
})


module.exports = async function (key, localFile) {
  
  try {
    client.useBucket(config.OSS_BUCKET);
    const result = await client.put(key, localFile)
    
    fs.unlinkSync(localFile)
    return result
  } catch (error) {
    fs.unlinkSync(localFile)
    return Promise.reject(error)
  }
}