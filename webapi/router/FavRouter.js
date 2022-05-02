const express = require('express');
const router = express.Router();
const { executeReader, executeQuery } = require('../util/database');

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