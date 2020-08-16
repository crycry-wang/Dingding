var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

/* GET home page. */

//// 會員
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

    member = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,a.`eMail`,\
     a.`password`,a.`memberPhone`, count(b.`noticeStatus`) as noticeCount \
     from `member` as a, `notice` as b where a.memberID=b.toWhoID and \
     toWhoType=2 and b.noticeStatus=1 and memberID='+ memberId;

    address = 'select `memberAddressID`,`memberAddress` from memberaddress where memberID=' + memberId;

    Likestore = 'select\
    c.`storeID`,c.`storeName`, c.`storePhoto` from member a \
    join likestore b on a.memberID=b.memberID \
    join store c on b.storeID=c.storeID where a.memberID='+ memberId;
    saveCoin = 'SELECT SUM(saveCoin) saveSum from savecoin where memberID=' + memberId;
    costCoin = 'SELECT sum( `price`*`quality`) costSum FROM `orderdetail` WHERE memberID=' + memberId;

    console.log("session:", req.session.memberID);

    next();
});


// 刪除喜愛店家
router.post('/deleteStore', function (req, res, next) {
    db.query('delete from likestore where memberID =' + req.body.memberID + ' and `storeID`=' + req.body.storeID,
        function () {
            console.log('刪除喜愛店家')
        })
        .catch(function () {
            console.log('err');
        })

})

// 刪除地址
// router.post('/saveInfo', function (req, res, next) {
//     db.query('delete from memberaddress where memberID =' + req.body.memberID,
//         function () {
//             console.log('刪除地址')
//         })
//         .catch(function () {
//             console.log('err');
//         })
//     next();
// })

// 增加地址
router.post('/saveInfo', function (req, res, next) {
    let arr = req.body.memberInfo;
    console.log(arr)
    console.log(req.body.memberID)
    for (let index = 0; index < arr.length; index++) {
        db.query('insert into memberaddress (`memberID`,`memberAddress`) VALUES (?,?)',
            [memberID,arr[index]],
            function () {
                console.log('增加地址')
            })
            .catch(function () {
                console.log('err');
            })

        next();

    }
})

// 修改暱稱與電話
router.post('/saveInfo', function (req, res, next) {
    db.query('update `member` set `memberName`= "' + req.body.memberName +
        '", memberPhone="' + req.body.memberPhone + '" where `memberID`=' + req.body.memberID,
        function () {
            console.log('修改暱稱與電話')
        })
        .catch(function () {
            console.log('err');
        })

})






// 會員左側
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
// 會員地址
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
// 會員喜愛的店家
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
// 會員儲值金額
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
// 會員消費金額
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