var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const savecoinSelect = 'select * from `savecoin` where memberID=';
const member = memberSelect + memberId;
const savecoin = savecoinSelect + memberId+' order by saveTime desc';

// 會員儲值金額
const saveCoinSelect = 'SELECT SUM(saveCoin) saveSum from savecoin where memberID='
const saveCoin = saveCoinSelect + memberId;

// 會員消費金額
const costCoinSelect = 'SELECT sum( `price`*`quality`) costSum FROM `orderdetail` WHERE memberID='
const costCoin = costCoinSelect + memberId;



const getMemberData = (req)=>{
  return new Promise((resolve, reject)=>{ 
      db.queryAsync(member)
          .then(results=>{
              resolve(results);
          })
          .catch(ex=>{
              reject(ex);
          });
  }) 
};
const getSaveData = (req)=>{
  return new Promise((resolve, reject)=>{ 
      db.queryAsync(savecoin)
          .then(results=>{
              resolve(results);
          })
          .catch(ex=>{
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
  newsJSON=JSON.stringify(await getMemberData(req));
  newsJSON1=JSON.stringify(await getSaveData(req));
  newsJSON2 = JSON.stringify(await getsaveCoinData(req));
    newsJSON3 = JSON.stringify(await getcostCoinData(req));
  res.render('mSaveCoins', { mMemberData: newsJSON,
     savecoinData: newsJSON1,
     saveCoinData:newsJSON2, 
        costCoinData:newsJSON3, 
      active: 'mSaveCoins' });

});


module.exports = router;
