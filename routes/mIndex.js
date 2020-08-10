var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = '';
var storeIndex = '';

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mIndex', {active: 'mIndex'});
});

router.get('/',async(req,res)=>{
  const a = await getDistrictData(req);
  district = JSON.stringify(a)
  const b = await storeIndexData(req);
  storeIndex=JSON.stringify(b);
  res.render('mIndex', { a: district,b: storeIndex });
  // console.log(storeIndex)
  // console.log(district)
});

module.exports = router;
