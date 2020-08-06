var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

const memberId = 2;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;
const addressSelect = 'select * from `memberaddress` where memberID=';
const address = addressSelect + memberId;



router.get('/', function(req, res, next) {

    db.query(member, function(err, results) {
            if (err) console.log("ERR!!");

            newsJSON = JSON.stringify(results);
            db.query(address, function(err, results1) {
                if (err) console.log("ERR!!");
                newsJSON1 = JSON.stringify(results1);
                res.render('mMember', { add: newsJSON, add1: newsJSON1 });
            })

        })
        // db.query(address, function(err, results) {
        //     if (err) console.log("ERR!!");

    //     newsJSON = JSON.stringify(results);
    //     // 轉成要用的物件
    //     // newsJP = JSON.parse(newsJSON);
    //     // console.log(newsJP);
    //     // console.log(results);
    //     // res.render('test', { news: newsJP, add: newsJSON });

    //     res.render('mMember', { add: newsJSON });
    // })
})


module.exports = router;