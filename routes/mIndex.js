var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = '';
var storeIndex = '';
// 會員
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

//進到首頁的店家照片+店名
let storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
//地區
let districtSql = 'SELECT * FROM `district`';


// 首頁店家照片+店名
const storeIndexData = (req)=>{
  return new Promise((resolve,reject)=>{
    db.queryAsync(storeIndexSql)
      .then(results=>{
        resolve(results);
      })
      .catch(ex=>{
        reject(ex);
      })
  })
}

// 地區
const getDistrictData = (req)=>{
  return new Promise((resolve,reject)=>{
    db.queryAsync(districtSql)
      .then(results=>{
        resolve(results);
      })
      .catch(ex=>{
        reject(ex);
      })
  })
}

//側邊欄
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mIndex');
});

router.get('/',async(req,res)=>{
  newsJSON = JSON.stringify(await getMemberData(req));
  const a = await getDistrictData(req);
  const b = await storeIndexData(req);
  district = JSON.stringify(a)
  storeIndex=JSON.stringify(b);
  
  res.render('mIndex', {
    mMemberData: newsJSON,
     a: district,
     b: storeIndex,
     active:'mIndex'});
  console.log(newsJSON);
  // console.log(district)
});

module.exports = router;
