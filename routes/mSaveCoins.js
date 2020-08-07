var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;
router.get('/', function (req, res, next) {

  db.query(member, function (err, results) {
    if (err) console.log("ERR!!");
    newsJSON = JSON.stringify(results);
    res.render('mSaveCoins', { mMemberData: newsJSON, active: 'mSaveCoins' });

  });
})
  

  module.exports = router;
