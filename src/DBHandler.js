const db = require('./db');

function replaceErrors(key, value) {
    if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(function (propName) {
            error[propName] = value[propName];
        });

        return error;
    }

    return value;
}


module.exports = function(api) {

    async function get(ctx) {
    
        let body = ctx.request.body;
        
        let {text, values}  = body;
        try {
            let row = await db.get(text, values);
            res.json({row});
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            res.json({error});
        }
    }

    async function list(ctx) {
    
        let body = ctx.request.body;
        let {text, values}  = body;
        try {
            let rows = await db.list(text, values);
            ctx.body = {rows};
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            ctx.body ={error};
        }
    }

    async function update(ctx) {
    
        let body = ctx.request.body;

        let {text, values}  = body;
        try {
            let {lastID, changes} = await db.update(text, values);
            res.json({lastID, changes});
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            res.json({error});
        }
    }

    return {
        get,
        list,
        update,
    };
    
}
