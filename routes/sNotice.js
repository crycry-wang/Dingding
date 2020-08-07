var express = require('express');
var router = express.Router();
var db = require('../model/db');



/* GET home page. */

// 店家
const storeID = 2;
const storeSelect = 'select * from `store` where storeID=';
const store = storeSelect + storeID;

router.get('/', function(req, res, next) {

    // 純店家side
    db.query(store, function(err, results) {
        if (err) console.log("ERR!!");
        newsJSON = JSON.stringify(results);
        res.render('sNotice', { storeData: newsJSON, active: 'sNotice' });
        console.log(newsJSON);
    })

});




module.exports = router;