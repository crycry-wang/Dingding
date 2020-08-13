var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

/* GET home page. */
let memberId;
let member;
let cost;



// 會員儲值金額
let saveCoin;

// 會員消費金額
let costCoin;

router.get('/', function (req, res, next) {
    memberId = req.session.memberID;
    member = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
count(b.`noticeStatus`) as noticeCount from `member` as a,\
`notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
and b.noticeStatus=1 and memberID='+ memberId;
    cost = 'select \
d.orderDeadline,c.storeName,b.productName,sum(a.price*a.quality) sum \
from `orderdetail` a join `order` d on a.`orderID`=d.`orderID`\
 join product b on a.productID=b.productID join store c on b.storeID=c.storeID \
 where a.memberID='+ memberId;
    saveCoin = 'SELECT SUM(saveCoin) saveSum from savecoin where memberID=' + memberId;
    costCoin = 'SELECT sum( `price`*`quality`) costSum FROM `orderdetail` WHERE memberID=' + memberId;

    console.log("session:", req.session.memberID);
    next();
});


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
const getCost = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(cost)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getsaveCoinData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(saveCoin)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getcostCoinData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(costCoin)
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
    newsJSON1 = JSON.stringify(await getCost(req));
    newsJSON2 = JSON.stringify(await getsaveCoinData(req));
    newsJSON3 = JSON.stringify(await getcostCoinData(req));
    res.render('mCostCoins', {
        mMemberData: newsJSON,
        costCoinListData: newsJSON1,
        saveCoinData: newsJSON2,
        costCoinData: newsJSON3,
        active: 'mSaveCoins'
    });

});







module.exports = router;
