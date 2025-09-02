
const Model = require('../model')

exports.likelist = async (req, res) => {
  const { pageNo = 1, pageSize = 10 }= req.query

  var content = await Model.Videolike
    .find({ like: 1,user: req.user._id })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1 })
    .populate('video', "_id title videoUrl")

  var total = await Model.Videolike.countDocuments({
    like: 1,
    user: req.user._id
  })
  res.status(200).json({
    code: 200,
    data: {
      content,
      total
    }
  })
}

exports.dislikeVideo = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.user._id

  const video = await Model.Video.findById(videoId)
  if(!video) {
    return res.status(404).json({
      code: 404,
      message: '视频不存在'
    })
  }

  var doc = await Model.Videolike.findOne({
    user: userId,
    video: videoId
  })

  let isDisLike = true

  if(doc && doc.like === -1) {
    await doc.remove()
  } else if(doc && doc.like === 1) {
    doc.like = -1
    await doc.save()
    isDisLike = false
  } else {
    await new Model.Videolike({
      user: userId,
      video: videoId,
      like: -1
    })
    isDisLike = true
  }

  video.likeCount = await Model.Videolike.countDocuments({
    video: videoId,
    like: 1
  })
  video.dislikeCount = await Model.Videolike.countDocuments({
    video: videoId,
    like: -1
  })
  await video.save()

  res.status(200).json({
    code: 200,
    message: '成功'
  })


}

exports.likeVideo = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.user._id

  const video = await Model.Video.findById(videoId)
  if(!video) {
    return res.status(404).json({
      code: 404,
      message: '视频不存在'
    })
  }

  var doc = await Model.Videolike.findOne({
    user: userId,
    video: videoId
  })
  var isLike = true 

  if(doc && doc.like === 1) {
    await doc.remove()
    isLike = false
  } else if(doc && doc.like === -1) {
    doc.like = 1
    await doc.save()
    isLike = true
  } else {
    await Model.Videolike({
      user: userId,
      video: videoId,
      like: 1
    })
    isLike = true
  }

  video.likeCount = await Model.Videolike.countDocuments({
    video: videoId,
    like: 1
  })
  video.dislikeCount = await Model.Videolike.countDocuments({
    video: videoId,
    like: -1
  })
  await video.save()

  res.status(200).json({
    code: 200,
    message: '成功'
  })
}

exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params

  const videoInfo = await Model.Video.findById(videoId)
  if(!videoInfo) {
    return res.status(404).json({
      code: 404,
      message: '视频不存在'
    })
  }

  const comment = await Model.Videocomment.findById(commentId)
  if(!comment) {
    return res.status(404).json({
      code: 404,
      message: '评论不存在'
    })
  }

  if(!comment.user.equal(req.user._id)) {
    return res.status(403).json({
      code: 403,
      message: '评论不可删除'
    })
  }
  await comment.remove()
  videoInfo.commentCount--;
  await videoInfo.save();

  res.status(200).json({
    code: 200,
    message: '删除成功'
  })
}

exports.commentList = async (req, res) => {
  const videoId = req.params.videoId
  const { pageNo = 1, pageSize = 10 } = req.query
  const content = await Model.Videocomment
    .find({ video: videoId })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1})
    .populate('user', '_id username image')

  const total = await Model.Videocomment.countDocuments()
  res.status(200).json({
    code: 200,
    data: {
      content,
      total
    }
  })
}

exports.comment = async (req, res) => {
  const { videoId }= req.params
  try {
    const videoInfo = await Model.Video.findById(videoId)
    const comment = await new Model.Videocomment({
      content: req.body.content,
      user: req.user._id,
      video: videoId
    }).save()

    videoInfo.commentCount++;
    await videoInfo.save();
    const data = comment.toJSON();
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