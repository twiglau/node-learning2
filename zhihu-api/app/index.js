
const Koa = require('koa')
const path = require('path')
const KoaStatic = require('koa-static')
const {koaBody} = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const cors = require('@koa/cors')

const app = new Koa();
const { setupRouting } = require('./routes')
const { connectionUrl, staticPath } = require('./config')

async function databaseConnect() {
  await mongoose.connect(connectionUrl)
}

databaseConnect().catch(err => console.log(err));


mongoose.connection.on(error, console.error)

app.use(error({
  format: (err) => ({
        status: err.status || 500,
        message: err.message,
        // Add other relevant error properties
      }),
  postFormat: ({stack, ...rest}) => process.env.NODE_ENV !== 'production' ? rest: ({stack, ...rest})
}))


app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, staticPath),
    keepExtensions: true
  }
}))

app.use(KoaStatic(
  path.join(__dirname, 'public')
))

app.use(parameter(app))
app.use(cors())
setupRouting(app)

const port = 5000 || process.env.port
app.listen(port, () => {
  console.log(`App is listen on ${port}`)
})