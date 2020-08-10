var express = require('express');
var router = express.Router();
var db = require('../model/db');
  
let memberID;
let voteID;
let voteSql; 
let voteItemSql;
let voteCheckSql;
let voteJsonResult;

router.get('/', function (req, res, next) {
    memberID = 38;
    voteID = req.query.voteID;
    voteSql = "select * from `vote` v inner join `groupmember` m on v.groupID=m.groupID join `group` g on v.groupID=g.groupID where v.voteID=" + voteID;
    voteItemSql = "select r.voteItemID,s.storeName,s.storeBanner,SUM(r.votes) as sumVote from `voteitem` i inner join `vote` v on i.voteID=v.voteID join `voterecord` r on i.voteitemID=r.voteitemID join `store` s on s.storeID=i.storeID where v.voteID=" + voteID + " group by r.voteItemID";
    voteCheckSql = "select r.voteItemID,r.memberID  from `voteitem` i inner join `vote` v on i.voteID=v.voteID join `voterecord` r on i.voteitemID=r.voteitemID where v.voteID=" + voteID + " and r.memberID=" + memberID;
    next();
});

/* GET home page. */
const getVoteData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(voteSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

const getVoteItemData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(voteItemSql)
            .then(results2 => {
                resolve(results2);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
const getCheckData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(voteCheckSql)
            .then(results3 => {
                resolve(results3);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

router.get('/', async (req, res, next) => {
    const vote = await getVoteData(req);
    const voteItem = await getVoteItemData(req);
    const voteCheck = await getCheckData(req);
    voteJsonResult = JSON.stringify(vote);
    voteItemJsonResult = JSON.stringify(voteItem);
    voteChecksonResult = JSON.stringify(voteCheck);
    res.render('mVote', { 
        vote: voteJsonResult, 
        voteItemList: voteItemJsonResult, 
        voteCheck: voteChecksonResult
     });
    //          第一參數放ejs黨名  第二參數放需要的值
    // console.log(voteChecksonResult);
    //測試是否成功    
});


module.exports = router;