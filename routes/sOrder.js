var express = require('express');
var router = express.Router();
var db = require('../model/db');

let storeID;
let orderID;
let orderListSql;
let orderDetailListSql;
let updateOrderSql = "update `order` set orderStatus = 2 where (CURRENT_DATE) > orderDeadline and orderStatus = 1";


router.get('/', function (req, res, next) {
    storeID = req.session.storeID;
    orderID = 3;
    orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,m.memberPhone,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where o.storeID=" + storeID + " and orderStatus=3 and o.orderArrivedTime between CURRENT_DATE and CURRENT_DATE+1 group by d.orderID";
    orderDetailListSql = "select sum(quality) as singleQuality,productName,orderID,orderArrivedTime,deliveryAddress,orderArrivedTime,orderCreateTime,memberName,price,memberPhone,productPhoto from (select o.orderID,d.productID,d.price,d.quality,o.orderArrivedTime,o.orderCreateTime,o.deliveryAddress,m.memberName,m.memberPhone,p.productPhoto,p.productName FROM `orderdetail` as d , `order` as o, `member` as m,`product` as p where d.orderID=o.orderID and m.memberID=o.memberID and d.productID=p.productID and d.orderID=" + orderID + ") as tableA group by productName,price,productPhoto";
    store = 'select * from `store` where storeID=' + storeID;

    next();
});

router.get('/order', async (req, res, next) => {
    switch (req.query.orderTab) {
        case "1":
            orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,m.memberPhone,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where o.storeID=" + storeID + " and orderStatus=3 and (o.orderArrivedTime between CURRENT_DATE and CURRENT_DATE+1) group by d.orderID";
            break;
        case "2":
            orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,m.memberPhone,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where o.storeID=" + storeID + " and orderStatus=4 and (o.orderArrivedTime between CURRENT_DATE and CURRENT_DATE+1) group by d.orderID";
            break;
        case "3":
            orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,m.memberPhone,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where o.storeID=" + storeID + " and orderStatus=3 and (CURRENT_DATE+1 <= o.orderArrivedTime) group by d.orderID";
            break;
        case "4":
            orderListSql = "select o.orderID,o.memberID,o.orderArrivedTime,o.orderStatus,m.memberName,m.memberPhone,SUM(d.quality*d.price) as totalPrice from `order` o join `member` m on o.memberID=m.memberID join `orderdetail` d on o.orderID=d.orderID where (o.storeID=" + storeID + ") and (orderStatus=0 or orderStatus=5) group by d.orderID";
            break;
    }
    db.queryAsync(orderListSql,
        function (err, results) {
            if (err) console.log("ERR!!");
        })
    const orderList = await getorderListData(req);
    orderListJsonResult = JSON.stringify(orderList);
    res.json(orderListJsonResult);
    // console.log(orderListJsonResult)
});


router.get('/getDetail', async (req, res, next) => {
    orderID = req.query.orderID;
    orderDetailListSql = "select sum(quality) as singleQuality,productName,orderID,orderArrivedTime,deliveryAddress,orderArrivedTime,orderCreateTime,memberName,price,memberPhone,productPhoto from (select o.orderID,d.productID,d.price,d.quality,o.orderArrivedTime,o.orderCreateTime,m.memberName,o.deliveryAddress,m.memberPhone,p.productPhoto,p.productName FROM `orderdetail` as d , `order` as o, `member` as m,`product` as p where d.orderID=o.orderID and m.memberID=o.memberID and d.productID=p.productID and d.orderID=" + orderID + ") as tableA group by productName,price,productPhoto";
    const orderDetailList = await orderDetailListData(req);
    orderDetailListJsonResult = JSON.stringify(orderDetailList);
    res.json(orderDetailListJsonResult);
});


router.post('/prepared', async (req, res, next) => {
    // console.log(req.body)
    db.queryAsync('update `order` set `orderStatus`=4 where `orderID` =' + req.body.orderID,
        function (err, results) {
            if (err) console.log("ERR!!");
        })
    const orderList = await getorderListData(req);
    orderListJsonResult = JSON.stringify(orderList);
    res.json(orderListJsonResult);
});


const updateOrderData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(updateOrderSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

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
    const updateOrder = await updateOrderData(req);
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