var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district;
var storeIndex;
var store;
var memberLogin;
var session = require('express-session');


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

router.get('/',function(req,res,next){
  storeID = 1;
  storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
  districtSql = 'SELECT * FROM `district`';
  orderFinishSql = 'SELECT orderStatus FROM `order` WHERE storeId='+ storeID;
  commentScoreSql = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID='+ storeID ;
  commentSql = 'SELECT a.storeID,a.memberID,a.commentContent,a.commentScore,a.commentTime,b.memberName,b.memberPhoto FROM `comment` a LEFT JOIN `member` b on a.memberID=b.memberID where storeID='+ storeID ;
  storeProductSql = 'SELECT a.storeID,a.productID,a.productName,a.categoryID,a.productPhoto,a.productinformation,a.productPrice,b.categoryName FROM `product` a LEFT JOIN `category` b on a.categoryID=b.categoryID WHERE a.storeID='+ storeID;
  storeInformationSql = 'SELECT * FROM `store` where storeID='+ storeID ;
  
  next();
});
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


/* GET home page. */

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
}
// 地區
const getDistrictData = (req) => {
  return new Promise((resolve, reject) => {
    db.queryAsync(districtSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
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
// 註冊
router.post('/signup', function(req, res, next) {
  db.query('select * from member where eMail=?', [req.body.registeredEmail], function(err, results) {
      if (err) console.log("ERR!!");

      var actStr = "";
      if (results != 0) {
          text = [{ message: "此信箱已被註冊" }];
          actStr = JSON.stringify(text);
      } else {
          db.query('insert into `member`(`eMail`, `password`, `memberName`,`memberPhone`) VALUES (?,?,?,?)', [req.body.registeredEmail,
            req.body.registeredPassword,
            req.body.registeredName,
            req.body.registeredPhone,], function(err, results) {
              if (err) console.log("ERR!!");

              text = [{ message: "註冊成功" }];
              trans = JSON.stringify(text);
              // console.log(actStr);
          })
          text = [{ message: "註冊成功" }];
          actStr = JSON.stringify(text);
      }

      console.log(actStr);

      res.json(actStr);

  })

});
// 一般會員登入
router.post('/login', function(req, res, next) {
  db.query('SELECT * FROM `member` WHERE `eMail`=?', [req.body.memberEmail], function(err, results) {
      if (err) console.log("ERR!!");
      var actStr = "";
      
      if (results != 0) {
          actStr = JSON.stringify(results);
          var memberSession = JSON.parse(actStr);
          console.log(memberSession[0].memberID)
          req.session.memberID = memberSession[0].memberID
      } else {
          text = [{ message: "帳號或密碼錯誤" }];
          actStr = JSON.stringify(text);
      }
      res.json(actStr);
  })
});
// 企業用戶登入
router.post('/slogin', function(req, res, next) {
  db.query('SELECT * FROM `store` WHERE `storeEMail`=?', [req.body.storeEmail], function(err, results) {
      if (err) console.log("ERR!!");
      var storeActStr = "";
      
      if (results != 0) {
        storeActStr = JSON.stringify(results);
        // console.log("results:",results)
          var storeSession = JSON.parse(storeActStr);
          console.log("storeSession:",storeSession[0].storeID)
          req.session.storeID = storeSession[0].storeID
      } else {
          text = [{ message: "帳號或密碼錯誤" }];
          storeActStr = JSON.stringify(text);
      }
      res.json(storeActStr);
  })
});


router.get('/', async (req, res) => {
  const a = await getDistrictData(req);
  const b = await storeIndexData(req);
  const c = await getLoginData(req);
  const d = await storeInformationData(req);
  const e = await commentScoreData(req);
  const f = await commentData(req);
  const g = await orderFinishData(req);
  const h = await storeProductData(req);
  district = JSON.stringify(a)
  storeIndex = JSON.stringify(b);
  memberLogin = JSON.stringify(c);
  storeInformation = JSON.stringify(d);
  commentScore = JSON.stringify(e);
  comment = JSON.stringify(f);
  orderFinish = JSON.stringify(g);
  storeProduct = JSON.stringify(h);
  
  res.render('index', { 
    a: district, 
    b: storeIndex,
    c:memberLogin,
    d:storeInformation,
    e:commentScore,
    f:comment,
    g:orderFinish,
    h:storeProduct,
   });
  
});
module.exports = router;
