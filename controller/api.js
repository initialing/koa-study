const Router = require('koa-router')
const Monk = require('monk')
const tencentAI = require('tencent-ai-nodejs-sdk')
const mongodb = Monk('localhost/test')

const api = new Router();

api.all('/api/queryid/:id',async (ctx)=>{
    let test = mongodb.get('test')
    let temp = []
    temp.push(ctx.params)
    temp.push(ctx.query)
    ctx.response.body = await test.find({'name':ctx.params.id})
})
api.all('/api/data',async (ctx,next)=>{
    let test = mongodb.get('test')
    ctx.response.body = await test.find(ctx.request.body.data)              //获取请求体中的参数
    // ctx.body = ctx.request.body
    await next()
})
api.all('/api/hello', async (ctx,next)=>{
    let test = mongodb.get('test')
    // ctx.body=JSON.stringify({name:'scholes',job:'webcoder'});
    try{
        ctx.body = await test.find(ctx.request.query)
        // ctx.body = ctx.request
        console.log('qurey=====>',ctx.request.query,typeof(ctx.request.query))
        // ctx.body = ctx.mongo.collection("test")
    }catch(e){
        console.log(e)
    }
    await next();

})
api.post('/api/tencentai',async (ctx,next)=>{
    const appId = 2110493895
    const appKey = '59MiGNQTQrzdXbdt'
    let imagdata = ctx.request.body.image
    const tencentai = new tencentAI(appId,appKey)
    let result = await tencentai.imageTerrorism(imagdata)
    // console.log('tencent=====>',imagdata)

    ctx.body = result
    await next()

})

api.all('/api/test', async (ctx, next)=>{
    ctx.body = 'connect succed'
    await next();
})
module.exports = api
