const Topic = require('../models/topics')


class TopicController {
  async find(ctx) {
    ctx.body = await Topic.find()
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => '+' + f);
    const topic = await Topic.findById(ctx.params.id).select(selectFields)

    if(!topic) {
      ctx.throw(404, '主题不存在')
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

    if(!user) { ctx.throw(404, '主题不存在')}

    ctx.body = user
  }
}


module.exports = new TopicController()