var express = require('express');
var router = express.Router();
var db = require('../model/db');


let memberID;
let voteListSql;
let voteCheck;
let jsonResult;
/* GET home page. */

router.get('/', function (req, res, next) {
    memberID = 38;
    voteListSql = "select * from `vote` v inner join `member` m on v.memberID=m.memberID join `group` g on v.groupID=g.groupID where v.memberID=" + memberID + " and CURRENT_DATE <= v.voteDeadline";
    voteCheck = "select voteID,memberID from `voteRecord` where memberID=" + memberID + " group by voteID";
    next();
});





// 現在與未來的訂單
const getVoteListData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(voteListSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};

const voteCheckData = (req) => {
    return new Promise((resolve, reject) => {
        // 輸入select 句型
        db.queryAsync(voteCheck)
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
    const voteList = await getVoteListData(req);
    const voteCheck = await voteCheckData(req);
    jsonResult = JSON.stringify(voteList);
    voteCheckResult = JSON.stringify(voteCheck);
    res.render('mVoteList', { voteList: jsonResult, voteCheck: voteCheckResult });
    //          第一參數放ejs黨名  第二參數放需要的值
    console.log(voteCheckResult);
    //測試是否成功    
});

// 過去的訂單
router.get('/history', async (req, res, next) => {
    voteListSql = "select * from `vote` v inner join `member` m on v.memberID=m.memberID join `group` g on v.groupID=g.groupID where v.memberID=" + memberID + " and CURRENT_DATE > v.voteDeadLine";
    const voteList = await getVoteListData(req);
    jsonResult = JSON.stringify(voteList);
    res.json(jsonResult);
});

// 現在與未來的訂單
router.get('/future', async (req, res, next) => {
    voteListSql = "select * from `vote` v inner join `member` m on v.memberID=m.memberID join `group` g on v.groupID=g.groupID where v.memberID=" + memberID + " and CURRENT_DATE <= v.voteDeadLine";
    const voteList = await getVoteListData(req);
    jsonResult = JSON.stringify(voteList);
    res.json(jsonResult);
});


module.exports = router;