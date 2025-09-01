const OSS = require('ali-oss')
const fs = require('fs')
const { ali_oss } = require('../config/config.default')

const client = new OSS({
   region: ali_oss.region,
   accessKeyId: ali_oss.accessKeyId,
   accessKeySecret: ali_oss.accessKeySecret
})


module.exports = async function (key, localFile) {
  
  try {
    client.useBucket(ali_oss.bucket);
    const result = await client.put(key, localFile)
    
    fs.unlinkSync(localFile)
    return result
  } catch (error) {
    fs.unlinkSync(localFile)
    return Promise.reject(error)
  }
}