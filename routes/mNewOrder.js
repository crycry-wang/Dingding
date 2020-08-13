var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let groupListSql;
let addressListSql;

/* GET home page. */
router.get('/', function (req, res, next) {
  memberID = 38;
  groupListSql = "select g.groupName,g.groupID from `group` g inner join `groupmember` m on g.groupID=m.groupID where m.memberID="+memberID;
  addressListSql = "select * from memberaddress where memberID = "+memberID;
  next();
});


router.post('/saveNewOrderData', function (req, res, next) {
  req.session.newOrderData = req.body ; 
  console.log(req.body)
  next();
});

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

const getaddressListData = (req) => {
  return new Promise((resolve, reject) => {
      // 輸入select 句型
      db.queryAsync(addressListSql)
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
  const addressList = await getaddressListData(req);
  groupListJsonResult = JSON.stringify(groupList);
  addressListJsonResult = JSON.stringify(addressList);
  res.render('mNewOrder', { 
    addressList: addressListJsonResult,
    groupList: groupListJsonResult
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(addressListJsonResult);
  //測試是否成功    
});



module.exports = router;
