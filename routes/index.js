var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = '';
var storeIndex = '';
var store = '';
var memberLogin;
var session = require('express-session');


//進到首頁的店家照片+店名
let storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
//地區
let districtSql = 'SELECT * FROM `district`';
//首頁店家評分
let commentSql = 'SELECT storeID,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` group by storeID';


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
}

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

})


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
})


router.get('/', async (req, res) => {
  const a = await getDistrictData(req);
  const b = await storeIndexData(req);
  const c = await getLoginData(req);
  district = JSON.stringify(a)
  storeIndex = JSON.stringify(b);
  memberLogin = JSON.stringify(c);
  
  res.render('index', { 
    a: district, 
    b: storeIndex,
    c:memberLogin,
    
   });
  
});
module.exports = router;
