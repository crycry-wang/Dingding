var express = require('express');
var router = express.Router();
var db = require('../model/db');

var newsJS;
var newsJP;

let sql = 'select * from `member`';

router.get('/', function(req, res, next) {

    db.query(sql, function(err, results, fields) {

        if (err) console.log("ERR!!");

        newsJS = JSON.stringify(results);

        res.render('delete', { str: newsJS });
    })

})

router.post('/', function(req, res, next) {

    db.query('delete from member where memberID=' + req.body.mId, function() {
            console.log('Delete success!!!')
        })
        .catch(function() {
            console.log('err');
        })

})


module.exports = router;