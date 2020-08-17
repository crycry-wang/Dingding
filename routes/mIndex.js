var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = '';
var storeIndex = '';
var session = require('express-session');
// var mysession="";
// 會員
var memberId;
var memberSelect;
var member;
//進到首頁的店家照片+店名
var storeIndexSql;
//地區
var districtSql;
//店家資訊
var storeInformationSql;
//店家商品
var storeProductSql;
//店家評論
var commentSql;
//店家評分
var commentScoreSql;
//訂單總數(算完成率用)
var orderFinishSql;
// 會員收藏店家
var likeStoreSql;

router.get('/', function(req, res, next) {
  memberId =  req.session.memberID;
  member = memberSelect + memberId;
  memberSelect = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
  count(b.`noticeStatus`) as noticeCount from `member` as a,\
  `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
  and b.noticeStatus=1 and memberID=';
  storeID = 1;
  storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
  districtSql = 'SELECT * FROM `district`';
  orderFinishSql = 'SELECT orderStatus FROM `order` WHERE storeId='+ storeID;
  commentScoreSql = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID='+ storeID ;
  commentSql = 'SELECT a.storeID,a.memberID,a.commentContent,a.commentScore,a.commentTime,b.memberName,b.memberPhoto FROM `comment` a LEFT JOIN `member` b on a.memberID=b.memberID where storeID='+ storeID ;
  storeProductSql = 'SELECT a.storeID,a.productID,a.productName,a.categoryID,a.productPhoto,a.productinformation,a.productPrice,b.categoryName FROM `product` a LEFT JOIN `category` b on a.categoryID=b.categoryID WHERE a.storeID='+ storeID;
  storeInformationSql = 'SELECT * FROM `store` where storeID='+ storeID ;
  likeStoreSql = 'SELECT a.memberID,a.storeID,b.storeName from `likestore` a left join `store` b on a.storeID=b.storeID where a.memberID='+ memberId ;

  next();
});

// memberId = 38;




/* GET home page. */
// 抓店家彈框資訊
router.get('/getDetail',async(req,res,next) => {
  storeID=req.query.storeID;
  // 店家資訊
  storeInformationSql = 'SELECT * FROM `store` where storeID='+ storeID ;
  const d = await storeInformationData(req);
  storeInformation = JSON.stringify(d);
  // 店家評分
  commentScoreSql = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID='+ storeID ;
  const e = await commentScoreData(req);
  commentScore = JSON.stringify(e);

  //店家評論
  commentSql = 'SELECT a.storeID,a.memberID,a.commentContent,a.commentScore,a.commentTime,b.memberName,b.memberPhoto FROM `comment` a LEFT JOIN `member` b on a.memberID=b.memberID where storeID='+ storeID ;
  const f = await commentData(req);
  comment = JSON.stringify(f);

  //訂單總數(算完成率用)
  orderFinishSql = 'SELECT orderStatus FROM `order` WHERE storeId='+ storeID;
  const g = await orderFinishData(req);
  orderFinish = JSON.stringify(g);

  //店家商品
  storeProductSql = 'SELECT a.storeID,a.productID,a.productName,a.categoryID,a.productPhoto,a.productinformation,a.productPrice,b.categoryName FROM `product` a LEFT JOIN `category` b on a.categoryID=b.categoryID WHERE a.storeID='+ storeID;
  const h = await storeProductData(req);
  storeProduct = JSON.stringify(h);

  res.json({storeInformation,commentScore,comment,orderFinish,storeProduct});
  next();
})



// 首頁店家照片+店名
const storeIndexData = (req) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(storeIndexSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      })
  })
};
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
// 店家評分
const commentScoreData = (req) => {
  return new Promise((resolve, reject) => {
      db.queryAsync(commentScoreSql)
          .then(results => {
              resolve(results);
          })
          .catch(ex => {
              reject(ex);
          })
  })
};
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
const orderFinishData = (req) => {
  return new Promise((resolve,reject) => {
    db.queryAsync(orderFinishSql)
        .then(results => {
            resolve(results);
        })
        .catch(ex => {
            reject(ex);
        })
})
};

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
};
// 會員收藏店家
const getLikeStoreData = (req)=>{
  return new Promise((resolve,reject)=>{
    db.queryAsync(likeStoreSql)
      .then(results=>{
        resolve(results);
      })
      .catch(ex=>{
        reject(ex);
      })
  })
};
// 一般會員資料
const getLoginData = (req) => {
  return new Promise((resolve, reject) => {
    db.queryAsync('select * from member')
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      })
  })
};


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
router.get('/',async(req,res)=>{
  newsJSON = JSON.stringify(await getMemberData(req));
  const a = await getDistrictData(req);
  const b = await storeIndexData(req);
  const c = await getLoginData(req);
  const d = await storeInformationData(req);
  const e = await commentScoreData(req);
  const f = await commentData(req);
  const g = await orderFinishData(req);
  const h = await storeProductData(req);
  const i = await getLikeStoreData(req);
  district = JSON.stringify(a)
  storeIndex = JSON.stringify(b);
  memberLogin = JSON.stringify(c);
  storeInformation = JSON.stringify(d);
  commentScore = JSON.stringify(e);
  comment = JSON.stringify(f);
  orderFinish = JSON.stringify(g);
  storeProduct = JSON.stringify(h);
  likeStore = JSON.stringify(i);
  // console.log(req.session.memberID)
  
  res.render('mIndex', {
    mMemberData: newsJSON,
    a: district, 
    b: storeIndex,
    c:memberLogin,
    d:storeInformation,
    e:commentScore,
    f:comment,
    g:orderFinish,
    h:storeProduct,
    i:likeStore,
     active: 'mIndex'
    });
  console.log(newsJSON);
  // console.log(district)
});

module.exports = router;
