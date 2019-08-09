const Router = require('koa-router')
const Monk = require('monk')
const tencentAI = require('tencent-ai-nodejs-sdk')
const mongodb = Monk('localhost/test')
const axios = require('axios')

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

api.all('/api/getsign', async (ctx, next)=>{
    const signUrl = 'https://admin-cmsqa.cw.sgmlink.com/api/public/util?entry=filepicker/sign'
    const signData = {
        "sid": "S1IY3IVqE",
        "userid": "apptest10",
        "token": "3EAD4F78392A4DB49DD3FD3DFCF09440",
        "url": "https://admin-cmsqa.cw.sgmlink.com/api/public/util"
    }
    const res = await axios.post(signUrl, signData)
    ctx.body = res.data

    await next()
})

api.post('/api/post', async (ctx, next)=>{
    console.log('api/post query======>',ctx.query)
    console.log('api/post params======>',ctx.request.rawBody)
    let res = {
        reeCode: 0,
        errMsg: 'succeed',
        body:[]
    }
    if(ctx.request.rawBody){
        res.body.push(JSON.parse(ctx.request.rawBody))
    }
    if(JSON.stringify(ctx.query) != "{}"){
        res.body.push(ctx.query)
    }
    ctx.body = res
    await next();
})
module.exports = api
