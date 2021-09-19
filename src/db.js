const { registerValueHandler } = require('squel');

var sql = require('squel').useFlavour('mysql');
const sqlite3 = require('sqlite3').verbose();

const conf = require('./conf.json');


let _db = new sqlite3.Database(conf.db.path, (err) => {
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

function list(text,  values) {
    
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


module.exports = {
    get,
    list,
    update,
    close,
}