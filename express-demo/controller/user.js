const Model = require('../model')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const ossUpload = require('../util/oss')
const { promisify } = require('util')
const rename = promisify(fs.rename)

exports.register = async (req, res) => {
   console.log(req.body)
   const userModel = new Model.User(req.body)
   const db = await userModel.save()
   const data = db.toJSON()
   delete data.password

   res.status(200).json({
    code: 200,
    data,
    message:null
   })
}

exports.login = async (req, res) => {
  // 客户端数据验证
  // 链接数据库查询
  console.log(req.body)
  var db = await Model.User.findOne(req.body)
  if(!db) {
    return res.status(401).json({
      code: 401,
      message: '邮箱或密码不正确'
    })
  }
  const data = db.toJSON()
  data.token = await createToken(data)
  
  res.status(200).json({message:'success', data})
}

exports.list = async (req,res) => {
  res.send('/user/list')
}

exports.update = async (req, res) => {
  
  const data = await Model.User.findByIdAndUpdate(req.user._id, req.body)
  res.status(200).json({
    code: 200, 
    data
  })
}

exports.delete = async (req,res) => {
  console.log(res)
  res.send('/user/delete')
}

// 用户头像上传
exports.headerImg = async (req,res) => {

  var fileArr = req.file.originalname.split('.')
  var fileType = fileArr[fileArr.length - 1]
  const localStr = './public/images/' + req.file.filename
  const formatStr = localStr + '.' + fileType
  try {
    await  rename(localStr, formatStr)
    const key = `imgs/${Date.now() + '.' + fileType}`
    const result = await  ossUpload(key, formatStr)
    res.status(200).json({
      code: 200,
      message: '成功',
      data: result.url
    })
    
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    })
  }
}

exports.video = async (req, res) => {
  var fileArr = req.file.originalname.split('.')
  var fileType = fileArr[fileArr.length -1]
  const localStr = './public/videos/' + req.file.filename
  const formatStr = localStr + '.' + fileType

  try {
    await rename(localStr, formatStr)
    const key = `videos/${Date.now() + '.' + fileType}`
    const result = await ossUpload(key, formatStr)
    res.status(200).json({
      code: 200,
      message: '成功',
      data: result.url
    })

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    })
  }
}