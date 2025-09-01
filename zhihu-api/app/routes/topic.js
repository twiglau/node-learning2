const KoaRouter = require('koa-router')
const router = new KoaRouter({prefix: '/topics'})
const jwt = require('koa-jwt')
const {
  find,
  findById,
  create,
  checkTopicExit,
  listFollowers,
  listQuestions,
  update,
} = require('../controllers/topics')
const { jwt_secret } = require('../config')

const auth = jwt({ secret: jwt_secret})
// 获取所有话题
router.get('/', find)
// 创建话题
router.post('/', create)
// 获取特定话题
router.get('/:id', findById)
// 编辑话题
router.patch('/:id', auth, checkTopicExit, update)
// 话题关注者列表
router.get('/:id/followers', checkTopicExit, listFollowers)
// 话题问题列表
router.get('/:id/questions', checkTopicExit, listQuestions)

module.exports = router