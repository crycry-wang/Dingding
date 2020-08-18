var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

/* GET home page. */
// 店家
let storeID;
let store;

// 產品
let product;


router.get('/', function (req, res, next) {
    storeID = req.session.storeID;
    store = 'select a.`storeID`,a.`storeName`,\
    a.`storePhoto`,count(b.`noticeStatus`) as\
     noticeCount from `store` as a,`notice` as\
      b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
       and b.`noticeStatus`=1 and storeID=' + storeID;
    
    // 產品
    product = 'SELECT a.`productName`,a.`productPhoto`,\
    a.`productInformation`,a.`productPrice`,a.productID,a.`recommendProduct`,\
    b.`categoryID`,b.categoryName,a.productStatus FROM `product` a  join category b\
     on a.`categoryID`=b.`categoryID` WHERE a.`storeID`='+ storeID;

    next();
})


// 設定產品
router.post('/setInfo', function (req, res, next) {
    db.query('UPDATE `product` set `productName`="' + req.body.productName
        + '" ,`productPrice`="' + req.body.productPrice
        + '" ,`productInformation`="' + req.body.productInformation + '" where `productID` = ' +
        req.body.productID,
        function () {
            console.log('設定產品')
        })
        .catch(function () {
            console.log('err');
        })
})


// 刪除產品
router.post('/deleteInfo', function (req, res, next) {
    db.query('UPDATE `product` set `productStatus`=0  where `productID`=' + req.body.productID,
        function () {
            console.log('刪除產品')
        })
        .catch(function () {
            console.log('err');
        })
})


// 店家左側
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




// 店家產品
const getProduct = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(product)
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
    newsJSON1 = JSON.stringify(await getProduct(req));

    res.render('sProduct', {
        storeData: newsJSON,
        productData: newsJSON1,
        active: 'sProduct'
    });
});



module.exports = router;