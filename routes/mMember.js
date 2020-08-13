var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');



/* GET home page. */

// 會員
let memberId;
let member;


// 會員地址

let address;
let Likestore;

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
    address = 'select * from memberaddress a inner join member b on a.memberID=b.memberID where a.memberID=' + memberId;

    Likestore = 'select\
    c.`storeID`,c.`storeName`, c.`storePhoto` from member a \
    join likestore b on a.memberID=b.memberID \
    join store c on b.storeID=c.storeID where a.memberID='+ memberId;
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
const getAddressData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(address)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getLikestoreData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(Likestore)
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
    newsJSON1 = JSON.stringify(await getLikestoreData(req));
    newsJSON2 = JSON.stringify(await getsaveCoinData(req));
    newsJSON3 = JSON.stringify(await getcostCoinData(req));
    newsJSON4 = JSON.stringify(await getAddressData(req));

    res.render('mMember', {
        mMemberData: newsJSON,
        memberLikestore: newsJSON1,
        saveCoinData: newsJSON2,
        costCoinData: newsJSON3,
        addressData: newsJSON4,
        active: 'mMember'
    });

});

module.exports = router;