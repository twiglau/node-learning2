const Model = require('../model')
const { createToken } = require('../util/jwt')

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
  var db = await Model.User.findOne(req.body)
  if(!db) {
    res.status(401).json({
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

exports.delete = async (req,res) => {
  res.send('/user/delete')
}