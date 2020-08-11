var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
// 店家
const storeID = 2;
const storeSelect = 'select * from `store` where storeID=';
const store = storeSelect + storeID;

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
//傳資料到表單裡
router.get('/', async (req, res) => {
    newsJSON = JSON.stringify(await getStoreData(req));
    
    res.render('sOrder', {
        storeData: newsJSON,
        active: 'sOrder'
    });
});






module.exports = router;