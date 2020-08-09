var express = require('express');
var router = express.Router();
var db = require('../model/db');



/* GET home page. */

// 店家
const storeID = 2;
const storeSelect = 'select * from `store` where storeID=';
const store = storeSelect + storeID;


// 廠商平台通知
const dNoticeSelect = 'SELECT * FROM `notice` where noticeType=0 and toWhoType=1 and toWhoID='
const dNotice = dNoticeSelect + storeID;

// 廠商新訂單
const orderDtNoticeSelect = 'SELECT a.`orderId`,c.`price`,\
c.`quality` FROM `order` a join member b on a.`memberID`=b.`memberID` \
join `orderdetail` c on a.`orderID`=c.`orderID` \
join `notice` d on a.`orderID`=c.`orderID` \
where a.orderStatus=2 and d.noticeType=1 and d.toWhoType=1 and d.toWhoID='
const orderDtNotice = orderDtNoticeSelect + storeID;

// 廠商新訂單
const orderNoticeSelect ='SELECT a.`orderID`,b.`memberName`,b.`memberPhoto`,\
a.`orderDeadline` FROM `order` a join `member` b on a.`memberID`=b.`memberID`\
 WHERE a.`orderStatus`=2 and a.`storeID`='
const orderNotice = orderNoticeSelect + storeID;

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
const getOrderDTNotice = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderDtNotice)
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
    newsJSON = JSON.stringify(await getStoreData(req));
    newsJSON1 = JSON.stringify(await getDNotice(req));
    newsJSON2 = JSON.stringify(await getOrderNotice(req));
    newsJSON3 = JSON.stringify(await getOrderDTNotice(req));

    res.render('sNotice', {
        storeData:newsJSON,
        dNticeData:newsJSON1,
        orderNoticeData:newsJSON2,
        orderDTNoticeData:newsJSON3,
        active: 'sNotice'
    });
});









module.exports = router;