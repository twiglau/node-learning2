const Question = require('../models/questions')
const { formatResultData } = require('../utils')


class QuestionController {
  async find(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.query
    const page_size = Math.max(pageSize * 1, 1);
    const page_num = Math.max(pageNum * 1,1) - 1
    
    const like = new RegExp(ctx.query.like)
    ctx.body = await Question
      .find({
        $or: [{title: like},{description: like}]
      })
      .limit(page_size).skip(page_num * page_size);
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => '+' + f);
    const question = await Question
      .findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner topics')

    if(!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.body = question
  }
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    });
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save();

    ctx.body = question;
  }
  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })

    
    const question = await Question.findByIdAndUpdate(ctx.state.question._id.toString(), ctx.state.question)
    ctx.body = formatResultData(200, question, '成功');
  }
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if(question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(204, '没有权限')
    }

    await next();
  }
  async checkQuestionExit(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if(!question) {ctx.throw(404, '问题不存在')}
    ctx.state.question = question;
    await next()
  }
  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.body = formatResultData(200, null, '删除成功')
  }
}


module.exports = new QuestionController()