var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'homepage',
    password: 'homepage',
    database: 'homepage'
});
connection.connect(); 

function executeReader(query, callback){
    try{
        let res = null;
        let err = false;
        connection.query(query, (error, result) => {
            if(error){
                err = true;
            } else {
                res = result;
            }
        });
        setTimeout(() => {
            callback(res, err);
        }, 300);
    } catch(error) {
        callback(true);
        console.log(error);
    }
}

function executeQuery(query, callback){
    try{
        let err = false;
        connection.query(query, (error, result) => {
            if(error){
                err = true;
            }
        });
        setTimeout(() => {
            callback(err);
        }, 300);
    } catch(err) {
        callback(true);
        console.log(err);
    }
}

function executeInsert(query, table, where, callback){
    try{
        let err = false;
        //判断数据库是否存在
        executeReader(`SELECT * FROM ${table} WHERE ${where}`, (result, error) => {
            if(error){
                err = true;
            } else {
                if(result.length == 0){
                    //不存在，插入数据
                    executeQuery(query, (error) => {
                        if(error){
                            err = true;
                        }
                    });
                } else {
                    err = true;
                }
            }
        });
        
        setTimeout(() => {
            callback(err);
        }, 300);
    } catch(err) {
        callback(true);
        console.log(err);
    }
}

module.exports = {
    executeReader,
    executeQuery,
    executeInsert
}