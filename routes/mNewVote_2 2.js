var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let storeListSql;
let storeScoreSql;

/* GET home page. */
router.get('/', function (req, res, next) {
  memberID = 38;
  storeListSql = "select s.storeID,s.storeName,s.storeBanner,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` c inner join `store` s on c.storeID=s.storeID inner join `likeStore` l on s.storeID=l.storeID where l.memberID="+memberID+" group by c.storeID";
  next();
});

router.get('/likestore', function (req, res, next) {
  storeListSql = "select * from `store` s inner join `likeStore` l on s.storeID=l.storeID where l.memberID=" + memberID;
  next();
});

router.get('/score', async (req, res, next) => {
  storeID = req.query.storeID;
  storeScoreSql = "select count(commentID) count,round(AVG(commentScore),1) star from `comment` where storeID=" + storeID;
  const score = await getStoreScoreData(req);
  storeScoreResult = JSON.stringify(score);
  res.json(storeScoreResult);
  console.log(JSON.stringify(storeScoreResult))
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

const getStoreScoreData = (req) => {
  return new Promise((resolve, reject) => {
    // 輸入select 句型
    db.queryAsync(storeScoreSql)
      .then(results => {
        resolve(results);
      })
      .catch(ex => {
        reject(ex);
      });
  })
};

router.get('/', async (req, res, next) => {
  const storeList = await getStoreData(req);
  storeListJsonResult = JSON.stringify(storeList);
  res.render('mNewVote_2', { 
    storeList: storeListJsonResult
   });
  //          第一參數放ejs黨名  第二參數放需要的值
  // console.log(groupNameJsonResult);
  //測試是否成功    
});


module.exports = router;
