const express = require('express');
const router = express.Router();
const { executeReader, executeQuery } = require('../util/database');

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

module.exports = router;