const KoaRouter = require('koa-router')
const router = new KoaRouter({prefix: '/topics'})
const {
  find,
  findById,
  create,
} = require('../controllers/topics')

// 获取所有主题
router.get('/', find)
// 创建主题
router.post('/', create)
// 获取特定主题
router.get('/:id', findById)

module.exports = router