var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let groupListSql;

// 側邊欄 
var memberId;
var memberSelect;
var member;

/* GET home page. */
router.get('/', function (req, res, next) {
  // 側邊欄 
  memberId = req.session.memberID;
  member = memberSelect + memberId;
  memberSelect = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
  count(b.`noticeStatus`) as noticeCount from `member` as a,\
  `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
  and b.noticeStatus=1 and memberID=';

  memberID = req.session.memberID;
  groupListSql = "select g.groupName,g.groupID from `group` g inner join `groupmember` m on g.groupID=m.groupID where m.memberID=" + memberID;

  next();
});

router.post('/saveNewVoteData', function (req, res, next) {
  req.session.newVoteData = req.body;
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

//側邊欄
const getMemberData = (req) => {
  return new Promise((resolve, reject) => {
      db.queryAsync(member)
          .then(results => {
              resolve(results);
          })
          .catch(ex => {
              reject(ex);
          });
  })
};

router.get('/', async (req, res, next) => {
  newsJSON = JSON.stringify(await getMemberData(req));
  const groupList = await getData(req);
  groupListJsonResult = JSON.stringify(groupList);
  res.render('mNewVote', { 
    mMemberData: newsJSON,
    groupList: groupListJsonResult,
    active: 'mCalendar',
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupNameJsonResult);
  //測試是否成功    
});

module.exports = router;
