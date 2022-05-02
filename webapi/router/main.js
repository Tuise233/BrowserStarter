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

router.get('/createDataId', (req, res) => {
    try{
        let dataid = req.query.dataid;
        //判断是否存在dataid
        executeReader(`SELECT * FROM user WHERE dataid='${dataid}'`, (reader, error) => {
            if(error){
                res.send({
                    type: "error"
                });
            } else {
                if(reader.length == 0){
                    //创建dataid
                    executeQuery(`INSERT INTO user (dataid) VALUE ('${dataid}')`, (error) => {
                        if(error){
                            res.send({
                                type: "error"
                            });
                        } else {
                            res.send({
                                type: "success"
                            });
                        }
                    })
                } else {
                    res.send({
                        type: "exist"
                    });
                }
            }
        })
    } catch(err){
        console.log(err);
    }
})

router.get('/isExistDataId', (req, res) => {
    try{
        let dataid = req.query.dataid;
        executeReader(`SELECT * FROM user WHERE dataid='${dataid}'`, (reader, error) => {
            if(error){
                res.send({
                    type: "error"
                });
            } else {
                if(reader.length > 0){
                    res.send({
                        type: "exist"
                    });
                } else {
                    res.send({
                        type: "unexist"
                    });
                }
            }
        });
    } catch(error){
        console.log(error);
    }
})

router.post('/createFav', (req, res) => {
    try{
        //console.log(req);
        let color = req.body.color;
        let name = req.body.name;
        let url = req.body.url;
        let pic = req.body.pic;
        let dataid = req.body.dataid;
        //存储
        executeQuery(`INSERT INTO fav (dataid, name, url, pic, color) VALUES ('${dataid}', '${name}', '${url}', '${pic}', '${color}')`, (error) => {
            if(error){
                res.send({
                    type: "error"
                });
            } else {
                res.send({
                    type: "success"
                });
            }
        });
    } catch(err){
        console.log(err);
    }
});

router.get('/getFav', (req, res) => {
    let dataid = req.query.dataid;
    executeReader(`SELECT * FROM fav WHERE dataid='${dataid}'`, (result, error) => {
        if(error){
            res.send({
                type: "error"
            });
        } else {
            let array = [];
            for(let i = 0; i < result.length; i++){
                array.push({
                    name: result[i].name,
                    url: result[i].url,
                    pic: result[i].pic,
                    color: result[i].color
                });
            }
            res.send({
                type: "success",
                result: JSON.stringify(array)
            });
        }
    })
});

module.exports = router;