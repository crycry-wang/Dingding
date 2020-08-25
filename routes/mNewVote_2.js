var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let newVoteData;
let storeListSql;

// 側邊欄 
var memberId;
var memberSelect;
var member;

// 取得要發通知的團體
let groupMember;
let groupMemberSql;

// 取得最後一場投票ID供新增選項用
let lastVote;
let lastVoteIDSql= "select voteID from vote order by voteID DESC LIMIT 1";

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
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID="+memberID+" group by c.storeID";
  newVoteData = req.session.newVoteData;

  groupMemberSql = "select memberID from `groupmember` where groupID=" + newVoteData.groupID;
  next();
});

// 新增投票
router.post('/newVote', function (req, res, next) {
  db.query('insert into `vote`(`groupID`, `memberID`,`voteDeadline`,`voteName`,`scheduledOrderTime`,`MultipleSelect`) VALUES (?,?,?,?,?,?)',
  [newVoteData.groupID,
      memberID,
      newVoteData.voteDeadline,
      newVoteData.voteName,
      newVoteData.scheduledOrderTime,
      newVoteData.MultipleSelect,],
     function (err, results) {
      if (err) console.log("ERR!!");
    })
  next();
});

// 新增選項
router.post('/newVote', function (req, res, next) {
  for (let i = 0; i < req.body.storeID.length; i++) {
  db.query('insert into `voteItem`(`voteID`, `storeID`) VALUES (?,?)',
  [lastVote[0].voteID+1,
  req.body.storeID[i],],
     function (err, results) {
      if (err) console.log("ERR!!");
    })
  }
  next();
});

// 新增通知
router.post('/newVote', function (req, res, next) {
  for (let i = 0; i < groupMember.length; i++) {
    db.query('insert into `notice`(`noticeType`, `toWhoType`, `toWhoID`,`noticeData`) VALUES (?,?,?,?)',
      [2,
        2,
        groupMember[i].memberID,
        parseInt(lastVote[0].voteID) + 1,
      ],
      function (err, results) {
        if (err) console.log("ERR!!");
      })
  }
  next();
});


router.get('/tab', async (req, res, next) => {
  // console.log(req.query.search);
  if(req.query.search){
    storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID WHERE s.storeName like '%"+req.query.search+"%' group by c.storeID";
  }


  switch(req.query.tab){
    case "1":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID + " group by c.storeID";
      break;
    case "2":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID group by c.storeID order by rand() limit 10";
      break;
    case "3":
      storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID group by c.storeID";
      break;
  }
  const storeList = await getStoreData(req);
  jsonResult = JSON.stringify(storeList);
  res.json(jsonResult);
});


const getStoreData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(storeListSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

const lastVoteData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(lastVoteIDSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};


const groupMemberData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(groupMemberSql)
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

  const getgroupMember = await groupMemberData(req);
  groupMemberJsonResult = JSON.stringify(getgroupMember);
  groupMember = JSON.parse(groupMemberJsonResult);

  const getlastVote = await lastVoteData(req);
  lastVoteJsonResult = JSON.stringify(getlastVote);
  lastVote = JSON.parse(lastVoteJsonResult);


  const storeList = await getStoreData(req);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewVote_2', { 
    mMemberData: newsJSON,
    storeList: storeListJsonResult,
    active: 'mCalendar'
    // lastVoteID: lastVoteIDJsonResult
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(lastVote[0].voteID);
  //測試是否成功    
});


module.exports = router;
