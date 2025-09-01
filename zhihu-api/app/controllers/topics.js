const Topic = require('../models/topics')
const Question = require('../models/questions');
const User = require('../models/users')
const { formatResultData } = require('../utils');

class TopicController {
  async find(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.query
    const page_size = Math.max(pageSize * 1, 1);
    const page_num = Math.max(pageNum * 1,1) - 1
    
    ctx.body = await Topic
      .find({
        name: new RegExp(ctx.query.like)
      })
      .limit(page_size).skip(page_num * page_size);
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => '+' + f);
    const topic = await Topic.findById(ctx.params.id).select(selectFields)

    if(!topic) {
      ctx.throw(404, '话题不存在')
    }
    ctx.body = topic
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    });
    const topic = await new Topic(ctx.request.body).save();

    ctx.body = topic;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)

    if(!topic) { ctx.throw(404, '话题不存在')}

    ctx.body = topic
  }
  async checkTopicExit(ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if(!topic) {ctx.throw(404, '话题不存在')}
    await next()
  }
  async listFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id })
    ctx.body = formatResultData(200, users, '成功')
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id })
    ctx.body = formatResultData(200, questions, '成功')
  }
}


module.exports = new TopicController()