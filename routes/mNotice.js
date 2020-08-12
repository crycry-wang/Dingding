var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

// 會員
let memberId;
let member;

// 會員平台通知
let dNotice;

// 訂單狀況通知

let orderNotice;

router.get('/', function (req, res, next) {
    // 會員
    memberId = 38;
    member = 'select * from `member` where memberID='+memberId;

    // 會員平台通知
    dNotice = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=2 and toWhoID='+memberId;
    orderNotice = 'SELECT a.noticeID,a.noticeTime,b.`orderStatus`,\
    c.storeName,c.storePhoto FROM `notice` as a,`order` as b,`store` as c where\
     a.noticeData=b.orderID and noticeType=1 and b.storeID=c.storeID and toWhoType=2 and toWhoID='+ memberId;
    
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

//傳資料到表單裡
router.get('/', async (req, res) => {
    newsJSON = JSON.stringify(await getMemberData(req));
    newsJSON1 = JSON.stringify(await getDNotice(req));
    newsJSON2 = JSON.stringify(await getOderNotice(req));

    res.render('mNotice', {
        mMemberData: newsJSON,
        dNticeData: newsJSON1,
        OderNoticeData: newsJSON2,
        active: 'mNotice'
    });
});



module.exports = router;