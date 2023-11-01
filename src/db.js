
var sql = require('squel').useFlavour('mysql');
const sqlite3 = require('sqlite3').verbose();


var _DB_MAP = {};


function getDB(db_name){
    let db_path = process.cwd() + '/db/' + db_name + '.db';
    console.log('--sqlite--' + db_path);
    if (db_name in _DB_MAP) {
        return _DB_MAP[db_name];
    }
    let db = new sqlite3.Database(db_path, (err) => {
        if (err) {
            throw err;
        }
    });
    _DB_MAP[db_name] = db;
    return db;
}



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

function list(db, text, values) {
    
    return new Promise((resolve, reject) =>  {
        getDB(db).all(text, ...values, (err, rows)=> {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(rows);
            return;
        });
    });
}

function get(db, text, values) {
   
    
    return new Promise((resolve, reject) =>  {
        getDB(db).get(text, ...values, (err, row)=> {
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


function update(db, text, values) {
   
    return new Promise((resolve, reject) =>  {
        getDB(db).run(text, ...values, (err)=> {
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

function close(db) {
    return new Promise((resolve, reject) =>  {
        getDB(db).close((err) => {
            delete _DB_MAP[db];
            if (err) {
                reject(err);
                return;
            }

            resolve('OK');
        });
    });
    
}

async function deleteByID(db, tbl, id) {
    let ql = sql.delete();
    ql.from(tbl);

    ql.where('id=?', id);
    await update(db, ql);
    
    return id;
}

async function getByID(db, tbl, id) {
    let ql = sql.select();
    ql.from(tbl);

    ql.where('id=?', id);
    let obj = await get(db, ql);
    if (obj) {
        return clean(obj);
    }
    return null;
}

async function existsByID(db, tbl, id) {
    let ql = sql.select();
    ql.field('1');
    ql.from(tbl);

    ql.where('id=?', id);
    let obj = await get(db, ql);
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