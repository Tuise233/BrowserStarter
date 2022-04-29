var mysql = require('mysql');


function executeReader(query, callback){
    try{
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'homepage',
            password: 'homepage',
            database: 'homepage'
        });
        connection.connect(); 
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
            connection.end();
            callback(res, err);
        }, 1000);
    } catch(error) {
        console.log(error);
    }
}

function executeQuery(query, callback){
    try{
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'homepage',
            password: 'homepage',
            database: 'homepage'
        });
        connection.connect(); 
        let err = false;
        connection.query(query, (error, result) => {
            if(error){
                err = true;
            }
            return;
        });
        setTimeout(() => {
            connection.end();
            callback(err);
        }, 1000);
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    executeReader,
    executeQuery
}