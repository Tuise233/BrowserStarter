const express = require('express');
const router = express.Router();

const http = require('http');
const urlencode = require('urlencode');
const { executeReader, executeQuery } = require('../util/database');

router.get('/getSentence', (req, res) => {
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth().toString();
    let day = date.getDate().toString();
    month = month.length == 1 ? `0${month}` : month;
    day = day.length == 1 ? `0${day}` : day;
    dateStr = `${year}-${month}-${day}`;
    let url = `http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${dateStr}`;
    http.get(url, (response) => {
        let result = "";
        response.setEncoding('utf-8');
        response.on('data', (chunk) => {
            result += chunk;
        });

        response.on('end', () => {
            let data = JSON.parse(result);
            res.send({
                translate: data.content,
                text: data.note
            });
        });
    });
});

router.get('/loginUser', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    //检查用户是否存在
    executeReader(`SELECT * FROM user WHERE username = '${username}'`, (result, error) => {
        if(error){
            res.send({
                type: "error"
            });
        } else {
            if(result.length > 0){
                if(result[0].password == password){
                    console.log(`[log]用户${username}成功登录`);
                    res.send({
                        type: "correct"
                    });
                } else {
                    console.log(`[log]用户${username}尝试登录,但密码错误. (${password} - ${result[0].password})`);
                    res.send({
                        type: "incorrect"
                    });
                }
            } else {
                res.send({
                    type: "unexist"
                });
            }
        }
    });
});

router.get('/registerUser', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    let exist = false;
    executeReader(`SELECT * FROM user WHERE username = '${username}'`, (result, error) => {
        if(error){
            res.send({
                type: "error"
            });
        } else {
            if(result.length > 0){
                exist = true;
                res.send({
                    type: "exist"
                });
                return;
            }
        }
    });
    setTimeout(() => {
        if(exist == false){
            executeQuery(`INSERT INTO user (username, password) VALUES ('${username}', '${password}')`, (error) => {
                if(error){
                    res.send({
                        type: "error"
                    });
                } else {
                    console.log(`[log]用户${username}注册成功 (${password})`);
                    res.send({
                        type: "success"
                    });
                }
            })
        }
    }, 1000);
});

router.get('/search', (req, res) => {
    try{
        let text = req.query.keyword;
        let date = new Date();
        let now = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        executeQuery(`INSERT INTO search (keyword, date) VALUES ('${text}', '${now}')`, (error) => {
            if(error){
                res.send({
                    type: "error"
                });
            } else {
                console.log(`[log]用户正在查询: ${text} (${now})`);
                res.send({
                    type: "success"
                });
            }
        })
    } catch(err){
        console.log(err);
    }
    
})

module.exports = router;