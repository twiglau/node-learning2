
exports.register = async (req, res) => {
   console.log(req.body)
   res.send('/user/register')
}

exports.list = async (req,res) => {
  res.send('/user/list')
}

exports.delete = async (req,res) => {
  res.send('/user/delete')
}