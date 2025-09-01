const KoaRouter = require('koa-router')
const jwt = require('koa-jwt')
const jwtSecret = require('../config').jwt_secret
const router = new KoaRouter({prefix: '/users'})
const {
  find,
  findById,
  create,
  update,
  del,
  login,
  checkOwer,
  checkUserExit,
  follow,
  unfollow,
  followTopics,
  unfollowTopics,
  listFollower,
  listFollowing,
  currentUser,
  listQuestions
} = require('../controllers/users')
const {
  checkTopicExit
} = require('../controllers/topics')

const auth = jwt({
  secret: jwtSecret
})

// 获取所有用户
router.get('/', find)
// 创建用户
router.post('/', create)
// 获取特定用户
router.get('/:id', findById)
// 更新用户
router.patch('/:id', auth, checkOwer, update)
// 删除用户
router.delete('/:id', auth, checkOwer, del)
// 登录
router.post('/login', login)
// 关注
router.put('/follow/:id', auth, checkUserExit, follow)
// 取消关注
router.delete('/unfollow/:id', auth, checkUserExit, unfollow)
// 关注话题
router.put('/followTopics/:id', auth, checkTopicExit, followTopics)
// 取消关注话题
router.delete('/unfollowTopics/:id', auth, checkTopicExit, unfollowTopics)
// 粉丝
router.get('/:id/follower', listFollower)
// 关注
router.get('/:id/following', listFollowing)
// 管理员
router.get('/api/currentUser', currentUser)

router.get('/:id/questions', listQuestions)

module.exports = router