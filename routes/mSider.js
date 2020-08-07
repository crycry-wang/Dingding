var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */



// router.get('/', function(req, res, next) {
//     db.query(member, function(err, results) {
//         if (err) console.log("ERR!!");
//         newsJSON = JSON.stringify(results);
//         res.render('mSider', { mMember1: newsJSON });

//     })

// });


router.get('/', function(req, res, next) {
    res.render('mSider');
});






module.exports = router;