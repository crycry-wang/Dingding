var express = require('express');
var router = express.Router();
var db = require('../model/db');


let memberID;
let groupListSql;

/* GET home page. */
router.get('/', function(req, res, next) {
  memberID = 38;
  groupListSql = "select g.groupName,g.groupID from `group` g inner join `groupmember` m on g.groupID=m.groupID where m.memberID="+memberID;

  next();
});

router.post('/saveNewVoteData', function (req, res, next) {
  req.session.newVoteData = req.body ; 
  // console.log(req.body)
  next();
});

const getData = (req) => {
  return new Promise((resolve, reject) => {
      // 輸入select 句型
      db.queryAsync(groupListSql)
          .then(results => {
              resolve(results);
          })
          .catch(ex => {
              reject(ex);
          });
  })
};

router.get('/', async (req, res, next) => {
  const groupList = await getData(req);
  groupListJsonResult = JSON.stringify(groupList);
  res.render('mNewVote', { groupList: groupListJsonResult});
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupNameJsonResult);
  //測試是否成功    
});

module.exports = router;
