const db = require('./db');

const logger = require("./logger");

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
        let db_name = ctx.state.db;
        let body = ctx.request.body;
        
        let {text, values}  = body;
        logger.info(`get->${text}`);
        try {
            let row = await db.get(db_name, text, values);
            ctx.body = {row};
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            ctx.body ={error};
        }
    }

    async function list(ctx) {
    
        let body = ctx.request.body;
        let {text, values}  = body;
        logger.info(`list->${text}`);
        let db_name = ctx.state.db;
        try {
            let rows = await db.list(db_name, text, values);
            ctx.body = {rows};
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            ctx.body ={error};
        }
    }

    async function update(ctx) {
    
        let body = ctx.request.body;
        let db_name = ctx.state.db;

        let {text, values}  = body;
        logger.info(`update->${text}`);
        try {
            let {lastID, changes} = await db.update(db_name, text, values);
            ctx.body = {lastID, changes};
        } catch (err) {
            let error = JSON.stringify(err, replaceErrors)
            console.log(error);
            ctx.body ={error};
        }
    }

    return {
        get,
        list,
        update,
    };
    
}
