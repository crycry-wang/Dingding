var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

// 會員平台通知
const dNoticeSelect = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=2 and toWhoID='
const dNotice = dNoticeSelect + memberId;


// 訂單狀況通知
const orderNoticeSelect = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=2 and toWhoID='
const orderNotice = orderNoticeSelect + memberId;

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

//傳資料到表單裡
router.get('/', async (req, res) => {
    newsJSON = JSON.stringify(await getMemberData(req));
    newsJSON1 = JSON.stringify(await getDNotice(req));

    res.render('mNotice', {
        mMemberData: newsJSON,
        dNticeData: newsJSON1,
        active: 'mNotice'
    });
});





module.exports = router;