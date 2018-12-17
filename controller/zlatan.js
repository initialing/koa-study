const path = require('path')
const fs = require('fs')

const workfolder = path.join(path.resolve(),'models');
let maps = new Map();

var handle = async function(name,params,ctx,next){
    let key = name
    let file = path.join(workfolder,name+'.js')
    let handler = maps.get(key);
    if(!handler){
        if(!fs.existsSync(file)){
            return ctx.fail(new Error(`文件${name}不存在`))
        }
        try{
            handler = require(file)
        }catch(e){
            return ctx.fail(e)
        }
    }
    try{
        return await handle.call(null,params,ctx,next)
    }catch(e){
        throw e
    }
}

var zlatan = async function(ctx,next){
    ctx.zlatan = {}
    ctx.zlatan.call = async function(name,params){

        let ret = null
        ctx.succeed = function(data){
            ret = data
        }
        ctx.fail = function(err){
            ret = err.name
        }
        ctx._zlatan_cb_stack = ctx._zlatan_cb_stack || []
        ctx._zlatan_cb_stack.push({
            succeed:ctx.succeed,
            fail:ctx.fail
        })

        try{
            let tetdata = await handle(name,params,ctx,next)
        }catch(e){
            ret = e.name
        }
        ctx._zlatan_cb_stack.pop()
        ctx.succeed = ctx._zlatan_cb_stack.length > 0? ctx._zlatan_cb_stack[ctx._zlatan_cb_stack.length - 1]['succeed'] : null;
        ctx.fail = ctx._zlatan_cb_stack > 0? ctx._zlatan_cb_stack[ctx._zlatan_cb_stack.length -1]['fail'] : null;
        return ret
    }
    return next()
}

module.exports = zlatan
