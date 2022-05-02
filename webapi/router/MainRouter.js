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