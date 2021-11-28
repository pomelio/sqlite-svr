const db = require('./db');

async function get(req, res) {

    let {text, values}  = req.body;
    try {
        let row = await db.get(text, values);
        res.json({row});
    } catch (err) {
        let error = JSON.stringify(err, replaceErrors)
        res.json({error});
    }
}
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

async function list(req, res) {

    let {text, values}  = req.body;
    try {
        let rows = await db.list(text, values);
        res.json({rows});
    } catch (err) {
        let error = JSON.stringify(err, replaceErrors)
        res.json({error});
    }
}

async function update(req, res) {

    let {text, values}  = req.body;
    try {
        let {lastID, changes} = await db.update(text, values);
        res.json({lastID, changes});
    } catch (err) {
        let error = JSON.stringify(err, replaceErrors)
        res.json({error});
    }
}

module.exports = {
    get,
    list,
    update,
}