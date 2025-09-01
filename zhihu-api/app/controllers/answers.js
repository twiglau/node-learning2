const Answer = require('../models/answers')
const { formatResultData } = require('../utils')


class AnswerController {
  async find(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.query
    const page_size = Math.max(pageSize * 1, 1);
    const page_num = Math.max(pageNum * 1,1) - 1
    
    const like = new RegExp(ctx.query.like)
    ctx.body = await Answer
      .find({
        content: like,
        questionId: ctx.params.questionId
      })
      .limit(page_size)
      .skip(page_num * page_size);
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => '+' + f);
    const question = await Answer
      .findById(ctx.params.id)
      .select(selectFields)
      .populate('answerer')

    if(!question) {
      ctx.throw(404, '回答不存在')
    }
    ctx.body = question
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    });
    const question = await new Answer({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId
    }).save();

    ctx.body = question;
  }
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    
    const answer = await Answer.findByIdAndUpdate(ctx.state.answer._id.toString(), ctx.state.answer)
    ctx.body = formatResultData(200, answer, '成功');
  }
  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    if(answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(204, '没有权限')
    }

    await next();
  }
  async checkAnswerExit(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if(!answer) {ctx.throw(404, '答案不存在')}
    if(answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题没有此答案')
    }
    ctx.state.answer = answer;
    await next()
  }
  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.body = formatResultData(200, null, '删除成功')
  }
}


module.exports = new AnswerController()