var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let storeListSql;
let newOrderData;

// 側邊欄 
var memberId;
var memberSelect;
var member;

// 取得最後一張訂單ID供新增通知用
let lastOrder;
let lastOrderIDSql = "select orderID from `order` order by orderID DESC LIMIT 1";

// 取得要發通知的團體
let groupMember;
let groupMemberSql;


/* GET home page. */
router.get('/', function (req, res, next) {
  // 側邊欄 
  memberId = req.session.memberID;
  member = memberSelect + memberId;
  memberSelect = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
  count(b.`noticeStatus`) as noticeCount from `member` as a,\
  `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
  and b.noticeStatus=1 and memberID=';

  memberID = req.session.memberID;
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID + " group by c.storeID";
  newOrderData = req.session.newOrderData;
  groupMemberSql = "select memberID from `groupmember` where groupID=" + newOrderData.groupID;

  // console.log(orderData)
  next();
});


// 新增訂單
router.post('/newOrder', function (req, res, next) {
  db.query('insert into `order`(`groupID`, `memberID`, `storeID`,`orderDeadline`,`orderArrivedTime`,`deliveryAddress`) VALUES (?,?,?,?,?,?)',
    [newOrderData.groupID,
      memberID,
    req.body.storeID,
    newOrderData.orderDeadline,
    newOrderData.orderArrivedTime,
    newOrderData.deliveryAddress,],
    function (err, results) {
      if (err) console.log("ERR!!");
    })
  next();
});


// 新增通知
router.post('/newOrder', function (req, res, next) {
  for (let i = 0; i < groupMember.length; i++) {
    db.query('insert into `notice`(`noticeType`, `toWhoType`, `toWhoID`,`noticeData`) VALUES (?,?,?,?)',
      [3,
        2,
        groupMember[i].memberID,
        parseInt(lastOrder[0].orderID) + 1,
      ],
      function (err, results) {
        if (err) console.log("ERR!!");
      })
  }
  next();
});

router.get('/tab', async (req, res, next) => {
  // console.log(req.query.tab);
  if(req.query.search){
    storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID WHERE s.storeName like '%"+req.query.search+"%' group by c.storeID";
  }

  switch(req.query.tab){
    case "0":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID group by c.storeID order by rand() limit 1";
      break;
    case "1":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID + " group by c.storeID";
      break;
    case "2":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID group by c.storeID order by rand() limit 10";
      break;
    case "3":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `order` o on s.storeID=o.storeID where o.memberID=" + memberID + " group by c.storeID";
      break;
    case "4":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID group by c.storeID order by rand() limit 6";
      break;
  }
  const storeList = await getStoreData(req);
  jsonResult = JSON.stringify(storeList);
  res.json(jsonResult);
});


const lastOrderData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(lastOrderIDSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};


const getStoreData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(storeListSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

const groupMemberData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(groupMemberSql)
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

router.get('/', async (req, res, next) => {
  // 側邊欄
  newsJSON = JSON.stringify(await getMemberData(req));

  const getgroupMember = await groupMemberData(req);
  groupMemberJsonResult = JSON.stringify(getgroupMember);
  groupMember = JSON.parse(groupMemberJsonResult);

  const getlastOrder = await lastOrderData(req);
  lastOrderJsonResult = JSON.stringify(getlastOrder);
  lastOrder = JSON.parse(lastOrderJsonResult);

  const storeList = await getStoreData(req);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewOrder_2', {
    mMemberData: newsJSON,
    storeList: storeListJsonResult,
    active: 'mCalendar'
  });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupMember);
  //測試是否成功    
});



module.exports = router;
