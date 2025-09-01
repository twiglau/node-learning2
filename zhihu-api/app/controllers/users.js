const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const jwtSecret = require('../config').jwt_secret
const currentMockUser = require('../models/mock/user')
const { formatResultData } = require('../utils')

class UserController {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const { fields='' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter(f => f).map(f => ' +' + f)
      .join('');
    
    const populateStr = fields
      .split(';')
      .filter(f => f)
      .map(f => {
        if(f === 'employments') {
          return 'employments.company employments.job'
        }
        if(f === 'educations') {
          return 'educations.school educations.major'
        }
        return f
      })
      .join(' ');

    const user = await User
       .findById(ctx.params.id)
       .select(selectFields)
       .populate(populateStr)

    if(!user){
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  async create(ctx) {
    ctx.status = 200
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })

    const { name } = ctx.request.body
    const repeatUser = await User.findOne({name})

    if(repeatUser) {
      ctx.throw(409, '用户已被占用')
    }

    const user = await User(ctx.request.body).save()
    ctx.body = formatResultData(ctx.status, user)
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employments: {type: 'array', itemType: 'object', required: false},
      educations: {type: 'array', itemType: 'object', required: false},
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user
  }
  
  async del(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user
    ctx.status = 204
  }
  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user) {
      ctx.throw(401, '用户名或者密码不正确')
    } else {
      const {_id, name} = user
      const token = await jsonwebtoken.sign({_id, name}, jwtSecret, {expiresIn: '1d'})
      ctx.status = 200
      ctx.body = formatResultData(ctx.status, {
        token
      }, '登录成功')
    }
  }
  async checkOwer(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '用户没有权限')
    }
    await next()
  }
  async checkUserExit(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if(!user) {ctx.throw(404, '用户不存在')}
    await next()
  }
  async follow (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.body = formatResultData(200, null, '成功')
  }
  async unfollow (ctx) {
    let user = await User.findById(ctx.state.user._id).select('+following')
    let index = user.following.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      user.following.splice(index)
      user.save()
    }
    ctx.body = formatResultData(200, null, '成功')
  }
  async followTopics (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    }
    ctx.body = formatResultData(200, null, '成功')
  }
  async unfollowTopics (ctx) {
    let user = await User.findById(ctx.state.user._id).select('+followingTopics')
    let index = user.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      user.followingTopics.splice(index)
      user.save()
    }
    ctx.body = formatResultData(200, null, '成功')
  }
  async listFollowing (ctx) {
    let user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.following
  }
  async listFollowingTopic (ctx) {
    let user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.following
  }
  async listFollower(ctx) {
    const users = await User.find({following: ctx.params.id})
    ctx.body = users
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id })

    ctx.body = questions
  }
  async currentUser (ctx) {
    ctx.body = currentMockUser
  }

}


module.exports = new UserController()