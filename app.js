const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const cors = require('koa2-cors')       //引入跨域插件
const api = require('./controller/api.js')
// const mongo = require('koa-mongo')
// const startup = require('./startup')
const Monk = require('monk')
const mongodb = Monk('localhost/test')
// const test = mongodb.get('test')

const config = require('./config')
const routes = require('./routes')

// const mgconf = {
//   uri:'mongodb://zqt:1234321@localhost:27017/test',
//   // user:"zqt",
//   // password:'1234321',
//   dbname:'test',
//   max: 100,
//   min: 1,
//   timeout: 30000,
//   log:false
// }
const port = process.env.PORT || config.port

// error handler
onerror(app)

// const mongodb = convert(mongo(mgconf))

// startup(mongodb,mgconf)
// middlewares
app.use(cors())       //允许跨域
app.use(bodyparser())//该中间件用以解析post请求中的data数据
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  console.log('mongo=====>',ctx.mongo)
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})


app.use(convert(api.routes()))

routes(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
