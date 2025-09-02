
const fs = require('fs')
const ossUpload = require('../util/oss')
const { promisify } = require('util')
const rename = promisify(fs.rename)
const Model = require('../model')

exports.list = async (req, res) => {
  const { pageNo, pageSize } = req.query
  try {
    var content = await Model.Video.find()
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ createAt: -1 })
      .populate('user')
    var total = await Model.Video.countDocuments()  
    
    res.status(200).json({
      code: 200,
      data: {
        content,
        total
      }
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    })
  }
}

exports.videoDetail = async (req, res) => {
  const { videoId } = req.params
  try {
    const db = await Model.Video
                .findById(videoId)
                .populate('user', '_id username')

    const data = db.toJSON()
    res.status(200).json({
      code: 200,
      data
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    })
  }
}

exports.create = async (req, res) => {
  var id = req.user._id
  var body = req.body
  body.user = id
  const videoModel = new Model.Video(req.body)

  try {
    var db = await videoModel.save()
    var data = db.toJSON()
    res.status(200).json({
      code: 200,
      data,
      message:null
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    })
  }
}