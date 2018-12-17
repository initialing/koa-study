const TencentAI = require('tencent-ai-nodejs-sdk')
/**
 * 实现腾讯鉴黄接口功能
 */
async function test() {
    const appId = 2110493895
    const appKey = '59MiGNQTQrzdXbdt'
    const imurl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544690571192&di=a20f11325d332586292be443c5e8cd07&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2FRYh0GlXytfdbaPFMjUriyw%3D%3D%2F6598262736773960181.png'
    const tencentAi = new TencentAI(appId, appKey)

    const result = await tencentAi.imagePorn(false,imurl)
    console.log('result====>',result)
}
test()
