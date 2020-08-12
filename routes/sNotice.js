var express = require('express');
var router = express.Router();
var db = require('../model/db');



/* GET home page. */

// 店家
let storeID;
let store;

// 通知讀取數
let read;

// 廠商平台通知
let dNotice;

// 廠商新訂單明細
let orderDtNotice;

// 廠商訂單
let a;

// 廠商新訂單
let orderNotice;

// 廠商拒絕訂單
let orderCaNotice;

// 廠商接受訂單
let orderOkNotice;

let orderDetailListSql;

// 通知資料
router.get('/', function (req, res, next) {
    // 店家
    storeID = 2;
    store = 'select * from `store` where storeID=' + storeID;
    // 通知讀取數
    read = 'SELECT count(noticeID) countZ  FROM `notice` WHERE `toWhoType`=1 and noticeStatus=1 and `toWhoID`=' + storeID;
    // 廠商平台通知
    dNotice = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=1 and toWhoID=' + storeID;

    // 廠商訂單
    a = 'SELECT a.`orderID`,b.`memberName`,b.`memberPhoto`,c.`noticeStatus`,\
    c.`noticeTime`,sum(d.`price`*d.`quality`) total,a.`orderDeadline` FROM\
     `order` as a ,`member` as b ,`notice` as c ,`orderdetail` as d\
    where a.`memberID`=b.`memberID` and a.`orderID`=c.`noticeData` and a.`orderID` =d.`orderID` and a.`orderStatus`'
    // 廠商新訂單
    orderNotice = `${a} =2 and a.storeID=` + storeID;
    // 廠商拒絕訂單
    orderCaNotice = `${a} =0 and a.storeID=` + storeID;
    // 廠商接受訂單
    orderOkNotice = `${a} =3 and a.storeID=` + storeID;

    next();
});

router.get('/getDetail', async (req, res, next) => {
    orderID = req.query.orderID;
        // 廠商新訂單明細
        // orderDetailListSql = 'SELECT a.`orderId`,c.`price`,\
        // c.`quality` FROM `order` a join member b on a.`memberID`=b.`memberID` \
        // join `orderdetail` c on a.`orderID`=c.`orderID` \
        // join `notice` d on a.`orderID`=c.`orderID` \
        // where a.orderStatus=2 and d.noticeType=1 and d.toWhoType=1 and d.toWhoID=' + storeID;
        orderDetailListSql = "select o.orderID,d.productID,d.price,d.quality,o.orderArrivedTime,o.orderCreateTime,m.memberName,m.memberPhone,p.productPhoto,p.productName FROM `orderdetail` d join `order` o on d.orderID=o.orderID join `member` m on m.memberID=o.memberID join `product` p on d.productID=p.productID where d.orderID=" + orderID;
        const orderDetailList = await orderDetailListData(req);
        orderDetailListJsonResult = JSON.stringify(orderDetailList);
        res.json(orderDetailListJsonResult);
        next();
});



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

const getDNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(dNotice)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

const getOrderNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderNotice)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
// const getOrderDTNotice = (req) => {
//     return new Promise((resolve, reject) => {
//         db.queryAsync(orderDtNotice)
//             .then(results => {
//                 resolve(results);
//             })
//             .catch(ex => {
//                 reject(ex);
//             });
//     })
// };

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

const getOrderCaNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderCaNotice)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

const getOrderOkNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderOkNotice)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getread = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(read)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

//傳資料到表單裡
router.get('/', async (req, res,next) => {
    newsJSON = JSON.stringify(await getStoreData(req));
    newsJSON1 = JSON.stringify(await getDNotice(req));
    newsJSON2 = JSON.stringify(await getOrderNotice(req));
    const orderDetailList = await orderDetailListData(req);
    orderDetailListJsonResult = JSON.stringify(orderDetailList);
    // newsJSON3 = JSON.stringify(await getOrderDTNotice(req));
    newsJSON4 = JSON.stringify(await getOrderCaNotice(req));
    newsJSON5 = JSON.stringify(await getOrderOkNotice(req));
    newsJSON6 = JSON.stringify(await getread(req));

    res.render('sNotice', {
        storeData: newsJSON,
        dNticeData: newsJSON1,
        orderNoticeData: newsJSON2,
        orderDetailList: orderDetailListJsonResult,
        orderCaNoticeData: newsJSON4,
        orderOkNoticeData: newsJSON5,
        readData: newsJSON6,
        active: 'sNotice'
    });
});





module.exports = router;