var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');
const { resolve, reject } = require('bluebird');
var northDistrict = "";
var storeInformation ="";
var centralDistrict ="";
var storeProduct="";
var storeComment="";
var comment="";
var storeID;
var districtSql;
var northDistrictSql;
var centralDistrictSql;
var southDistrictSql;
var eastDistrictSql;
//店家資訊
var storeInformationSql;
//店家商品
var storeProductSql;
//店家評論
var commentSql;
//店家評分
var commentScoreSql;
// 店家配送區
var storeDeliverySql;
//訂單總數(算完成率用)
var orderSelectSql;

//側邊欄
var storeSelect = 'select a.`storeID`,a.`storeName`,\
a.`storePhoto`,count(b.`noticeStatus`) as\
 noticeCount from `store` as a,`notice` as\
  b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
   and b.`noticeStatus`=1 and storeID=';
var store = storeSelect + storeID;
router.get('/', function(req, res, next) {
  storeID = 1;
  store = storeSelect + storeID;
  orderSelectSql = 'SELECT orderStatus FROM `order` WHERE storeId='+ storeID;
  commentScoreSql = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID='+ storeID ;
  commentSql = 'SELECT a.storeID,a.memberID,a.commentContent,a.commentScore,a.commentTime,b.memberName,b.memberPhoto FROM `comment` a LEFT JOIN `member` b on a.memberID=b.memberID where storeID='+ storeID ;
  storeProductSql = 'SELECT a.storeID,a.productID,a.productName,a.categoryID,a.productPhoto,a.productinformation,a.productPrice,b.categoryName FROM `product` a LEFT JOIN `category` b on a.categoryID=b.categoryID WHERE a.storeID='+ storeID;
  storeInformationSql = 'SELECT * FROM `store` where storeID='+ storeID ;
  northDistrictSql = "SELECT * FROM `district` where area='北部'";
  centralDistrictSql = "SELECT * FROM `district` where area='中部'";
  southDistrictSql = "SELECT * FROM `district` where area='南部'";
  eastDistrictSql = "SELECT * FROM `district` where area='東部'";
  districtSql = "SELECT * FROM `district`";
  storeDeliverySql = 'select a.storeID,a.districtID,b.districtName,b.country from `delivery` a LEFT JOIN `district` b on a.districtID=b.districtID where storeID='+ storeID;
  console.log("session:",req.session.storeID);
  next();
});


/* GET home page. */



// 地區
// 北部
const getNorthDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(northDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
//中部
const getCentralDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(centralDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
// 南部
const getSouthDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(southDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
  // 東部
const getEastDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(eastDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
// 全部地區
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
const getStoreDeliveryData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(storeDeliverySql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }

//店家資訊
const storeInformationData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(storeInformationSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            })
    })
}
//店家菜單
const storeProductData = (req) => {
    return new Promise((resolve,reject) => {
        db.queryAsync(storeProductSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            })
    })
}
//店家評分
const commentScoreData = (req) => {
  return new Promise((resolve,reject) => {
    db.queryAsync(commentScoreSql)
        .then(results => {
            resolve(results);
        })
        .catch(ex => {
            reject(ex);
        })
})
}

//店家評論
const commentData = (req) => {
  return new Promise((resolve,reject) => {
    db.queryAsync(commentSql)
        .then(results => {
            resolve(results);
        })
        .catch(ex => {
            reject(ex);
        })
})
};
//訂單總數(算完成率用)
const orderSelectData = (req) => {
  return new Promise((resolve,reject) => {
    db.queryAsync(orderSelectSql)
        .then(results => {
            resolve(results);
        })
        .catch(ex => {
            reject(ex);
        })
})
}

//側邊欄
const getStoreData = (req) => {
  return new Promise((resolve, reject) => {
      db.queryAsync(store)
          .then(results => {
              resolve(results);
          })
          .catch(ex => {
              reject(ex);
          });
  })
};


router.get('/', async (req, res) => {
    const a = await storeInformationData(req);
    const b = await getNorthDistrictData(req);
    const c = await getCentralDistrictData(req);
    const d = await storeProductData(req);
    const e = await commentScoreData(req);
    const f = await commentData(req);
    const g = await orderSelectData(req);
    const h = await getSouthDistrictData(req);
    const i = await getEastDistrictData(req);
    const j = await getDistrictData(req);
    const k = await getStoreDeliveryData(req);
    storeInformation = JSON.stringify(a);
    northDistrict = JSON.stringify(b);
    centralDistrict = JSON.stringify(c);
    storeProduct = JSON.stringify(d);
    storeComment = JSON.stringify(e);
    comment = JSON.stringify(f);
    orderSelect = JSON.stringify(g);
    southDistrict = JSON.stringify(h);
    eastDistrict = JSON.stringify(i);
    district = JSON.stringify(j);
    storeDelivery = JSON.stringify(k);
    newsJSON = JSON.stringify(await getStoreData(req));
    // console.log(northDistrict)
    res.render('sInformation', {
       a: storeInformation ,
       b:northDistrict,
       c:centralDistrict,
       d:storeProduct,
       e:storeComment,
       f:comment,
       g:orderSelect,
       h:southDistrict,
       i:eastDistrict,
       j:district,
       k:storeDelivery,
       storeData: newsJSON,
       active:'sInformation' })
})


module.exports = router;