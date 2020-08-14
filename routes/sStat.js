var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */


let storeID;
let store;

// 類別訂單量
 let orderSum;



router.get('/', function(req, res, next) {
    storeID = 4;
    store = 'select a.`storeID`,a.`storeName`,\
    a.`storePhoto`,count(b.`noticeStatus`) as\
     noticeCount from `store` as a,`notice` as\
      b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
       and b.`noticeStatus`=1 and storeID=' + storeID;
    
    // 類別訂單量
     orderSum='SELECT a.orderID,sum(b.`quality`) total,\
     c.`categoryID`,d.`categoryName` FROM `order` as a,\
     `orderdetail` as b,`product` as c,`category` as d WHERE \
     a.orderID=b.orderID and b.`productID`=c.`productID` and \
     c.`categoryID`=d.`categoryID` and a.`orderStatus`=5  and \
     a.storeID='+storeID+' GROUP by c.`categoryID`';
    
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

    router.get('/', async (req, res) => {
        newsJSON = JSON.stringify(await getStoreData(req));
        newsJSON1 = JSON.stringify(await getOrderSum(req));

        res.render('sStat', {
            storeData: newsJSON,
            orderSumData: newsJSON1,
            active: 'sStat'
        });
    });
    


module.exports = router;