const db = require('./db');

async function get(req, res) {

    let {text, values}  = req.body;
    try {
        let row = await db.get(text, values);
        res.json({row});
    } catch (err) {
        res.json({error: err});
    }
}

async function list(req, res) {

    let {text, values}  = req.body;
    try {
        let rows = await db.list(text, values);
        res.json({rows});
    } catch (err) {
        res.json({error: err});
    }
}

async function update(req, res) {

    let {text, values}  = req.body;
    try {
        let {lastID, changes} = await db.update(text, values);
        res.json({lastID, changes});
    } catch (err) {
        res.json({error: err});
    }
}

module.exports = {
    get,
    list,
    update,
}