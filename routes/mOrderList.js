var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let orderListSql;
let orderCheck;
let jsonResult;

// 側邊欄 
var memberId;
var memberSelect;
var member;

router.get('/', function (req, res, next) {
  // 側邊欄 
  memberId = req.session.memberID;
  member = memberSelect + memberId;
  memberSelect = 'select * from `member` where memberID=';

  memberID = req.session.memberID;
  orderListSql = "select * from `order` o inner join `store` s on o.storeID=s.storeID join `group` g on o.groupID=g.groupID join `groupmember` m on g.groupID=m.groupID where m.memberID=" + memberID + " and CURRENT_DATE <= o.orderDeadline";
  orderCheck = "select orderID,memberID from `orderdetail` where memberID=" + memberID + " group by orderID";
  next();
});

// 現在與未來的訂單
const getorderListData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(orderListSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

const orderCheckData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(orderCheck)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
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

//傳資料到表單裡
router.get('/', async (req, res) => {
  newsJSON = JSON.stringify(await getMemberData(req));
  const orderList = await getorderListData(req);
  const orderCheck = await orderCheckData(req);
  jsonResult = JSON.stringify(orderList);
  orderCheckResult = JSON.stringify(orderCheck);
  res.render('mOrderList', { 
    mMemberData: newsJSON,
    orderList: jsonResult,
    orderCheck: orderCheckResult,
    active: 'mCalendar', 
  });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(orderCheckResult);
  //測試是否成功    
});

// 過去的訂單
router.get('/history', async (req, res, next) => {
  orderListSql = "select * from `order` o inner join `store` s on o.storeID=s.storeID join `group` g on o.groupID=g.groupID join `groupmember` m on g.groupID=m.groupID where m.memberID=" + memberID + " and CURRENT_DATE > o.orderDeadline order by orderID DESC";
  const orderList = await getorderListData(req);
  jsonResult = JSON.stringify(orderList);
  res.json(jsonResult);
});

// 現在與未來的訂單
router.get('/future', async (req, res, next) => {
  orderListSql = "select * from `order` o inner join `store` s on o.storeID=s.storeID join `group` g on o.groupID=g.groupID join `groupmember` m on g.groupID=m.groupID where m.memberID=" + memberID + " and CURRENT_DATE <= o.orderDeadline";
  const orderList = await getorderListData(req);
  jsonResult = JSON.stringify(orderList);
  res.json(jsonResult);
  console.log(jsonResult)
});

module.exports = router;
