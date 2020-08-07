var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

// 會員
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

// 單純地址
// const addressSelect = 'select * from `memberaddress` where memberID=';
// const address = addressSelect + memberId;

// 會員地址
const memberJoinaddress = 'select * from memberaddress a inner join member b on a.memberID=b.memberID where a.memberID=';
const address = memberJoinaddress + memberId;

// 會員各項(地址 喜愛餐廳)

// const memberJoinaddressJoinLikestore = 'select * from memberaddress a inner join member b on a.memberID=b.memberID join likestore c on b.memberID=c.memberID where a.memberID=';
// const memberJoin = memberJoinaddressJoinLikestore + memberId;

const memberJoinLikestore = 'select * from member a inner join likestore b on a.memberID=b.memberID join store c on b.storeID=c.storeID where a.memberID=';
const Likestore = memberJoinLikestore + memberId;

router.get('/', function(req, res, next) {
    // 純會員side
    // db.query(member, function(err, results) {
    //     if (err) console.log("ERR!!");
    //     newsJSON = JSON.stringify(results);
    //     res.render('mMember', { mMemberData: newsJSON });
    // })

    // 會員各項(地址)
    db.query(address, function(err, results) {
        if (err) console.log("ERR!!");
        newsJSON = JSON.stringify(results);

        db.query(Likestore, function(err, results) {
            if (err) console.log("ERR!!");
            newsJSON1 = JSON.stringify(results);

            res.render('mMember', { mMemberData: newsJSON, memberLikestore: newsJSON1, active: 'mMember' });
        })
    })


})








module.exports = router;