var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let newVoteData;
let storeListSql;

// 取得最後一場投票ID供新增選項用
let lastVote;
let lastVoteIDSql= "select voteID from vote order by voteID DESC LIMIT 1";

/* GET home page. */
router.get('/', function (req, res, next) {
  memberID = 38;
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID="+memberID+" group by c.storeID";
  newVoteData = req.session.newVoteData;
  next();
});

router.get('/likestore', function (req, res, next) {
  storeListSql = "select * from `store` s inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID;
  next();
});

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

router.get('/', async (req, res, next) => {
  const getlastVote = await lastVoteData(req);
  lastVoteJsonResult = JSON.stringify(getlastVote);
  lastVote = JSON.parse(lastVoteJsonResult);


  const storeList = await getStoreData(req);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewVote_2', { 
    storeList: storeListJsonResult,
    // lastVoteID: lastVoteIDJsonResult
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(lastVote[0].voteID);
  //測試是否成功    
});


module.exports = router;
