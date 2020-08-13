var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

/* GET home page. */
let memberId;
let savecoinSelect;
let member;
let savecoin;

// 會員儲值金額
let saveCoinSelect;
let saveCoin;
// 會員消費金額
let costCoinSelect;
let costCoin;


router.get('/', function (req, res, next) {
  memberId = req.session.memberID;
  savecoinSelect = 'select * from `savecoin` where memberID=';
  member = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
  count(b.`noticeStatus`) as noticeCount from `member` as a,\
  `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
  and b.noticeStatus=1 and memberID='+ memberId;
  savecoin = savecoinSelect + memberId + ' order by saveTime desc';
  saveCoinSelect = 'SELECT SUM(saveCoin) saveSum from savecoin where memberID='
  saveCoin = saveCoinSelect + memberId;
  costCoinSelect = 'SELECT sum( `price`*`quality`) costSum FROM `orderdetail` WHERE memberID='
  costCoin = costCoinSelect + memberId;


  console.log("session:", req.session.memberID);
  next();
});


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
const getSaveData = (req) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(savecoin)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

// 儲值
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
// 消費
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
  newsJSON1 = JSON.stringify(await getSaveData(req));
  newsJSON2 = JSON.stringify(await getsaveCoinData(req));
  newsJSON3 = JSON.stringify(await getcostCoinData(req));
  res.render('mSaveCoins', {
    mMemberData: newsJSON,
    savecoinData: newsJSON1,
    saveCoinData: newsJSON2,
    costCoinData: newsJSON3,
    active: 'mSaveCoins'
  });

});


module.exports = router;
