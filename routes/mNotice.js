var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');
/* GET home page. */

// 會員
let memberId;
let member;

// 會員平台通知
let dNotice;

// 訂單狀況通知
let orderNotice;

// 團體通知
let group;

router.get('/', function (req, res, next) {
    // 會員
    memberId =  req.session.memberID;
    member = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
    count(b.`noticeStatus`) as noticeCount from `member` as a,\
    `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
    and b.noticeStatus=1 and memberID='+ memberId;

    // 會員平台通知
    dNotice = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=2 and toWhoID=' + memberId;
    // 會員訂單通知
    orderNoticeSelect = 'SELECT a.noticeID,a.noticeTime,b.`orderStatus`,\
    a.`noticeStatus`,c.storeName,c.storePhoto,\
    sum(d.`price`*d.`quality`) total FROM `notice` as a,`order` as b,\
    `store` as c ,`orderdetail` as d where a.noticeData=b.orderID and\
     noticeType=1 and b.storeID=c.storeID and a.noticeData=d.orderID and\
      toWhoType=2 and toWhoID=';
    orderNotice = `${orderNoticeSelect}${memberId} group by b.orderID`;
    // 團體通知
    group='SELECT a.`noticeID`,a.`noticeType`,a.`noticeTime`,a.`noticeStatus`,c.groupName from `notice` as a,\
     `order` as b,`group` as c where a.noticeData=b.orderID and b.groupID=c.groupID\
      and (a.noticeType=2 or a.noticeType=3) and toWhoID='+memberId



    next();
})



const getMemberData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(member)
        .then(results => {
            resolve(results);
        })
        .catch(ex => {
            reject(ex);
            });
        })
};

const getDNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(dNotice)
        .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
        })
};
const getOderNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderNotice)
        .then(results => {
            resolve(results);
        })
            .catch(ex => {
                reject(ex);
            });
        })
    };
const getGroupNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(group)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

router.post('/read', function(req, res, next) {
    // console.log('req.body');
    db.query('UPDATE `notice` set `noticeStatus`=2 where noticeID=' + req.body.noticeId,
    function() {
            console.log('已讀')
        })
        .catch(function() {
            console.log('err');
        })
       
})


//傳資料到表單裡
router.get('/', async (req, res) => {
    newsJSON = JSON.stringify(await getMemberData(req));
    newsJSON1 = JSON.stringify(await getDNotice(req));
    newsJSON2 = JSON.stringify(await getOderNotice(req));
    newsJSON3 = JSON.stringify(await getGroupNotice(req));

    res.render('mNotice', {
        mMemberData: newsJSON,
        dNticeData: newsJSON1,
        oderNoticeData: newsJSON2,
        groupNoticeData: newsJSON3,
        active: 'mNotice'
    });
});




module.exports = router;