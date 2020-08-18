var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let orderID;
let orderSql;
let productListSql;
let categoryListSql;

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
  orderID = req.query.orderID;
  orderSql = "select * from `order` o join `group` g on o.groupID=g.groupID join `store` s on s.storeID=o.storeID where o.orderID=" + orderID;
  categoryListSql = "select * from `order` o join `category` c on c.storeID=o.storeID where o.orderID=" + orderID;
  productListSql = "select * from `product` p join `orderdetail` d on d.productID=p.productID where d.orderID=" + orderID + " and d.memberID=" + memberID;
  next();
});

router.post('/order', function (req, res, next) {
  for (let i = 0; i < req.body.length; i++) {
    db.query('insert into `orderDetail`(`orderID`, `memberID`, `productID`, `price`, `quality`) VALUES (?,?,?,?,?)',
      [orderID,
        memberID,
        req.body[i].productID,
        req.body[i].productPrice,
        req.body[i].quality,],
      function (err, results) {
        if (err) console.log("ERR!!");
      })
  }
  // console.log(req.body[0].orderID)
  next();
});

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

router.post('/newComment', function (req, res, next) {
  db.query('insert into `comment`(`storeID`, `memberID`, `commentContent`, `commentScore`) VALUES (?,?,?,?)',
    [req.body.storeID,
      memberID,
    req.body.commentContent,
    req.body.score,],
    function (err, results) {
      if (err) console.log("ERR!!");
    })

  next();
});

router.get('/tab', async (req, res, next) => {
  console.log(req.query.tab);
  if (req.query.tab == -1) {
    productListSql = "select * from `order` o join `group` g on o.groupID=g.groupID join `product` p on o.storeID=p.storeID join `store` s on s.storeID=p.storeID where o.orderID=" + orderID;
  }else{
    productListSql = "select * from `order` o join `group` g on o.groupID=g.groupID join `product` p on o.storeID=p.storeID join `store` s on s.storeID=p.storeID where o.orderID=" + orderID+" and p.categoryID="+req.query.tab;
  }

  const productList = await getproductListData(req);
  productListJsonResult = JSON.stringify(productList);
  res.json(productListJsonResult);
});

const getOrderData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(orderSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

const getCategoryListData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(categoryListSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

const getproductListData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(productListSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

router.get('/needOrder', async (req, res, next) => {
  // console.log("!!!");
  productListSql = "select * from `order` o join `group` g on o.groupID=g.groupID join `product` p on o.storeID=p.storeID join `store` s on s.storeID=p.storeID where o.orderID=" + orderID;
  const productList = await getproductListData(req);
  jsonResult = JSON.stringify(productList);
  res.json(jsonResult);
});



/* GET home page. */

router.get('/', async (req, res, next) => {
  newsJSON = JSON.stringify(await getMemberData(req));
  const order = await getOrderData(req);
  const productList = await getproductListData(req);
  const categoryList = await getCategoryListData(req);
  orderJsonResult = JSON.stringify(order);
  categoryListJsonResult = JSON.stringify(categoryList);
  productListJsonResult = JSON.stringify(productList);
  res.render('mOrder', {
    mMemberData: newsJSON,
    order: orderJsonResult,
    categoryList: categoryListJsonResult,
    productList: productListJsonResult,
    active: 'mCalendar'
  });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(productListJsonResult);
  //測試是否成功    
});


module.exports = router;
