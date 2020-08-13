var express = require('express');
var router = express.Router();
var db = require('../model/db');

let storeID;
let orderID;
let orderListSql;
let orderDetailListSql;

router.get('/', function (req, res, next) {
    storeID = 1;
    orderID = 3;
    orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where o.storeID=" + storeID + " group by d.orderID";
    orderDetailListSql = "select sum(quality) as singleQuality,productName,orderID,orderArrivedTime,orderArrivedTime,orderCreateTime,memberName,price,memberPhone,productPhoto from (select o.orderID,d.productID,d.price,d.quality,o.orderArrivedTime,o.orderCreateTime,m.memberName,m.memberPhone,p.productPhoto,p.productName FROM `orderdetail` as d , `order` as o, `member` as m,`product` as p where d.orderID=o.orderID and m.memberID=o.memberID and d.productID=p.productID and d.orderID=" + orderID +") as tableA group by productName,price,productPhoto";
    store='select * from `store` where storeID='+storeID;
    
    next();
});

router.get('/getDetail', async (req, res, next) => {
    orderID = req.query.orderID;
    orderDetailListSql = "select sum(quality) as singleQuality,productName,orderID,orderArrivedTime,orderArrivedTime,orderCreateTime,memberName,price,memberPhone,productPhoto from (select o.orderID,d.productID,d.price,d.quality,o.orderArrivedTime,o.orderCreateTime,m.memberName,m.memberPhone,p.productPhoto,p.productName FROM `orderdetail` as d , `order` as o, `member` as m,`product` as p where d.orderID=o.orderID and m.memberID=o.memberID and d.productID=p.productID and d.orderID=" + orderID +") as tableA group by productName,price,productPhoto";
    const orderDetailList = await orderDetailListData(req);
    orderDetailListJsonResult = JSON.stringify(orderDetailList);
    res.json(orderDetailListJsonResult);
    next();
});

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

const orderDetailListData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(orderDetailListSql)
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
        db.queryAsync(store)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};


/* GET home page. */
router.get('/', async (req, res, next) => {
    newsJSON = JSON.stringify(await getStoreData(req));
    const orderList = await getorderListData(req);
    const orderDetailList = await orderDetailListData(req);
    orderListJsonResult = JSON.stringify(orderList);
    orderDetailListJsonResult = JSON.stringify(orderDetailList);
    res.render('sOrder', {
        storeData: newsJSON,
        orderList: orderListJsonResult,
        orderDetailList: orderDetailListJsonResult,
        active: 'sOrder'
    });
    //          第一參數放ejs黨名  第二參數放需要的值
    // console.log(orderDetailListJsonResult);
    //測試是否成功    
});

module.exports = router;