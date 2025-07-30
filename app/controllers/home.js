const path = require('path')

class HomeController {
  index(ctx) {
    ctx.body = '这是主页'
  }
  upload(ctx) {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    console.log('basename>>>', basename);

    const url = `${ctx.origin}/uploads/${basename}`

    ctx.body = {
      url
    }
  }
}

module.exports = new HomeController()