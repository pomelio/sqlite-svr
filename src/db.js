
var sql = require('squel').useFlavour('mysql');
const sqlite3 = require('sqlite3').verbose();
let db_path = process.cwd() + '/' + process.env.db_name;
console.log('--sqlite--' + db_path);

let _db = new sqlite3.Database(db_path, (err) => {
    if (err) {
        throw err;
    }
});


function clean(obj) {
    if (typeof obj !== 'object' || !obj) {
        return obj;
    }
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
        var propName = propNames[i];
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj;
}

function list(text, values) {
    
    return new Promise((resolve, reject) =>  {
        _db.all(text, ...values, (err, rows)=> {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(rows);
            return;
        });
    });
}

function get(text, values) {
   
    
    return new Promise((resolve, reject) =>  {
        _db.get(text, ...values, (err, row)=> {
            if (err) {
                reject(err);
                return;
            }
            if(row){
                resolve(row);
                return;
            }
            resolve(null);
        });
    });
    
}


function update(text, values) {
   
    return new Promise((resolve, reject) =>  {
        _db.run(text, ...values, (err)=> {
            if (err) {
                reject(err);
                return;
            }
            let lastID = this.lastID;
            let changes = this.changes;
            resolve({lastID, changes});
        });
    });
}

function close() {
    return new Promise((resolve, reject) =>  {
        _db.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve('OK');
        });
    });
    
}

async function deleteByID(tbl, id) {
    let ql = sql.delete();
    ql.from(tbl);

    ql.where('id=?', id);
    await update(ql);
    
    return id;
}

async function getByID(tbl, id) {
    let ql = sql.select();
    ql.from(tbl);

    ql.where('id=?', id);
    let obj = await get(ql);
    if (obj) {
        return clean(obj);
    }
    return null;
}

async function existsByID(tbl, id) {
    let ql = sql.select();
    ql.field('1');
    ql.from(tbl);

    ql.where('id=?', id);
    let obj = await get(ql);
    if (obj) {
        return true;
    }
    return false;
}


module.exports = {
    get,
    list,
    update,
    close,
    getByID,
    deleteByID,
    existsByID,
}