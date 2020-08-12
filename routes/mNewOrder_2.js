var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let storeListSql;
let newOrderData;

/* GET home page. */
router.get('/', function (req, res, next) {
  memberID = 38;
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID + " group by c.storeID";
  newOrderData = req.session.newOrderData;
  // console.log(orderData)
  next();
});

router.post('/newOrder', function (req, res, next) {
  db.query('insert into `order`(`groupID`, `memberID`, `storeID`,`orderDeadline`,`orderArrivedTime`,`deliveryAddress`) VALUES (?,?,?,?,?,?)',
    [newOrderData.groupID,
      memberID,
      req.body.storeID,
      newOrderData.orderArrivedTime,
      newOrderData.orderDeadline,
      newOrderData.deliveryAddress,],
     function (err, results) {
      if (err) console.log("ERR!!");
    })
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


router.get('/', async (req, res, next) => {
  const storeList = await getStoreData(req);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewOrder_2', {
    storeList: storeListJsonResult,
  });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupNameJsonResult);
  //測試是否成功    
});



module.exports = router;
