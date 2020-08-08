var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = '';
var storeIndex = '';
var store = '';

//進到首頁的店家照片+店名
let storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
//地區
let districtSql = 'SELECT * FROM `district`';
// 點擊店家後連結店家資訊
let storeSql = 'SELECT a.storeID,a.storeName,a.storeBanner,a.storeIntroduction,a.storePhone,a.storeAddress,a.storeClose,a.storeOpen,a.storeNotice,b.productID,b.productName,b.category,b.productPhoto,b.productInformation,b.productPrice,c.commentID,c.memberID,c.commentContent,c.commentScore,c.commentTime,d.categoryName,e.districtID,f.districtName,f.country,g.memberName FROM `store` a JOIN `product` b on a.storeID=b.storeID JOIN `comment` c on a.storeID=c.storeID JOIN `category` d on b.category=d.categoryID JOIN `delivery` e on a.storeID=e.storeID JOIN `district` f on e.districtID=f.districtID JOIN `member` g on c.memberID=g.memberID where a.storeID=1;'
/* GET home page. */

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

//七個表
const getStoreData = (req)=>{
  return new Promise((resolve,reject)=>{
    db.queryAsync(storeSql)
      .then(results=>{
        resolve(results);
      })
      .catch(ex=>{
        reject(ex);
      })
  })
}

router.get('/',async(req,res)=>{
  const a = await getDistrictData(req);
  district = JSON.stringify(a)
  const b = await storeIndexData(req);
  storeIndex=JSON.stringify(b);
  res.render('index', { a: district,b: storeIndex });
  console.log(storeIndex)
  // console.log(district)
})

// router.get('/', function (req, res, next) {
  
//   db.query(districtSql, function (err, results, fields) {
//     if (err) console.log("ERR!!");
//     district = JSON.stringify(results);
//     // console.log(district)
//     return district;

//   });
//   db.query(storeSql, function (err, results, fields) {
//     if (err) console.log("ERR!!");
//     store = JSON.stringify(results);
//     console.log(store)
//     return store;

//   });


//   res.render('index', { a: district, b: store });
// });

module.exports = router;
