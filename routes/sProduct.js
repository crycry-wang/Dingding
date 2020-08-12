var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
// 店家
const storeID = 1;
const storeSelect = 'select * from `store` where storeID=';
const store = storeSelect + storeID;

// 產品
const productSelect = 'SELECT a.`productName`,a.`productPhoto`,\
a.`productInformation`,a.`productPrice`,a.`recommendProduct`,\
b.categoryName,a.productStatus FROM `product` a  join category b\
 on a.`categoryID`=b.`categoryID` WHERE a.`storeID`='
const product = productSelect + storeID;


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