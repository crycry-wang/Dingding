var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {



const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

db.query(member, function(err, results) {
    if (err) console.log("ERR!!");
    newsJSON = JSON.stringify(results);
    res.render('mNotice', { mMemberData: newsJSON, active: 'mNotice'});
})
});

module.exports = router;