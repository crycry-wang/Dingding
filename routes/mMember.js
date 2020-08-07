var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

// 會員
const memberId = 2;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

// 單純地址
const addressSelect = 'select * from `memberaddress` where memberID=';
const address = addressSelect + memberId;
// 會員與地址表
const memberJoinaddress = 'select * from memberaddress a inner join member b on a.memberID=b.memberID where a.memberID=';
const memberWithaddress = memberJoinaddress + memberId;


router.get('/', function(req, res, next) {
    // 純會員side
    // db.query(member, function(err, results) {
    //     if (err) console.log("ERR!!");
    //     newsJSON = JSON.stringify(results);
    //     res.render('mMember', { mMemberData: newsJSON });
    // })

    // 會員與地址表
    db.query(memberWithaddress, function(err, results) {
        if (err) console.log("ERR!!");
        newsJSON = JSON.stringify(results);
        res.render('mMember', { mMemberData: newsJSON });
        console.log(newsJSON);
    })


})


module.exports = router;