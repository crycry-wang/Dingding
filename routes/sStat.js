var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */


const storeID = 2;
const store = 'select a.`storeID`,a.`storeName`,\
a.`storePhoto`,count(b.`noticeStatus`) as\
 noticeCount from `store` as a,`notice` as\
  b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
   and b.`noticeStatus`=1 and storeID=' + storeID;

router.get('/', function(req, res, next) {

    // 純店家side
    db.query(store, function(err, results) {
        if (err) console.log("ERR!!");
        newsJSON = JSON.stringify(results);
        res.render('sStat', { storeData: newsJSON, active: 'sStat' });
        console.log(newsJSON);
    })

});

module.exports = router;