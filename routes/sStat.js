var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */


let storeID;
let store;

// 類別訂單量
let dateStart;
let dateEnd;
let orderSum;



router.get('/', function (req, res, next) {
    storeID = 4;
    store = 'select a.`storeID`,a.`storeName`,\
    a.`storePhoto`,count(b.`noticeStatus`) as\
     noticeCount from `store` as a,`notice` as\
      b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
       and b.`noticeStatus`=1 and storeID=' + storeID;

    // 類別訂單量
    dateStart = '"2020-06-01"';
    dateEnd = '"2020-08-31"';

    allType='SELECT a.`categoryName`,b.productName,a.`categoryID` FROM `category` as a,\
    `product` as b where a.categoryID=b.categoryID and a.storeId='+ storeID;

    orderSum = 'SELECT d.`categoryName`,c.productName,c.`categoryID`,sum(b.`quality`) total\
      FROM `order` as a, `orderdetail` as b,`product` as c,\
     `category` as d WHERE a.orderID=b.orderID and b.`productID`=c.`productID`\
      and c.`categoryID`=d.`categoryID` and a.`orderStatus`=5 and a.storeID='+ storeID +
        ' and a.`orderDeadline`>= ' + dateStart + ' and a.`orderDeadline`< ' + dateEnd +
        'GROUP by c.productName'
    console.log(orderSum);




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
const getOrderSum = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(orderSum)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getallType = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(allType)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

router.get('/', async (req, res) => {
    newsJSON = JSON.stringify(await getStoreData(req));
    newsJSON1 = JSON.stringify(await getOrderSum(req));
    newsJSON2 = JSON.stringify(await getallType(req));

    res.render('sStat', {
        storeData: newsJSON,
        orderSumData: newsJSON1,
        allTypeData: newsJSON2,
        active: 'sStat'
    });
});



module.exports = router;