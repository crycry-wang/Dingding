var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET users listing. */

// 會員
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

const getMemberData = (req) => {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
      db.queryAsync(member)
=======
      db.queryAsync(memberId)
>>>>>>> 277b81a... 日曆暫存
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
  newsJSON = JSON.stringify(await getMemberData(req));
  
<<<<<<< HEAD
=======
  
>>>>>>> 277b81a... 日曆暫存
  res.render('mCalendar', { 
      mMemberData: newsJSON,
      active: 'mCalendar'});

});



module.exports = router;
