const KoaRouter = require('koa-router')
const router = new KoaRouter({prefix: '/questions'})
const jwt = require('koa-jwt')
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkQuestionExit,
  checkQuestioner
} = require('../controllers/questions')
const { jwt_secret } = require('../config')


const auth = jwt({ secret: jwt_secret})

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, checkQuestionExit, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExit, checkQuestioner, del)


module.exports = router