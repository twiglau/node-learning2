const Model = require('../model')


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

exports.list = async (req,res) => {
  res.send('/user/list')
}

exports.delete = async (req,res) => {
  res.send('/user/delete')
}