const KoaRouter = require('koa-router')
const router = new KoaRouter({prefix: '/answers'})
const jwt = require('koa-jwt')
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkAnswerExit,
  checkAnswerer
} = require('../controllers/answers')
const { jwt_secret } = require('../config')


const auth = jwt({ secret: jwt_secret})

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, checkAnswerExit, checkAnswerer, update)
router.delete('/:id', auth, checkAnswerExit, checkAnswerer, del)


module.exports = router