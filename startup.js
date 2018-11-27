

async function empty() {}

var startup = async function(mongodb,config) {
    var ctx = {
        config:config
    }
    await mongodb(ctx,empty)
}

module.exports = startup
