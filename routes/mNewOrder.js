var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let storeListSql;
let groupListSql;

/* GET home page. */
router.get('/', function (req, res, next) {
  memberID = 38;
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID="+memberID+" group by c.storeID";
  groupListSql = "select groupName from `group` g inner join `groupmember` m on g.groupID=m.groupID where m.memberID="+memberID;
  next();
});

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

const getGroupListData = (req) => {
  return new Promise((resolve, reject) => {
      // 輸入select 句型
      db.queryAsync(groupListSql)
          .then(results => {
              resolve(results);
          })
          .catch(ex => {
              reject(ex);
          });
  })
};

router.get('/', async (req, res, next) => {
  const groupList = await getGroupListData(req);
  const storeList = await getStoreData(req);
  groupListJsonResult = JSON.stringify(groupList);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewOrder', { 
    storeList: storeListJsonResult,
    groupList: groupListJsonResult
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupNameJsonResult);
  //測試是否成功    
});



module.exports = router;
