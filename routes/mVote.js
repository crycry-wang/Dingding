var express = require('express');
var router = express.Router();
var db = require('../model/db');

let memberID;
let voteID;
let voteSql;
let voteItemSql;
let voteCheckSql;
let voteJsonResult;

// 側邊欄 
var memberId;
var memberSelect;
var member;

router.get('/', function (req, res, next) {
    // 側邊欄 
    memberId = req.session.memberID;
    member = memberSelect + memberId;
    memberSelect = 'select * from `member` where memberID=';

    memberID = req.session.memberID;
    voteID = req.query.voteID;
    voteSql = "select * from `vote` v inner join `groupmember` m on v.groupID=m.groupID join `group` g on v.groupID=g.groupID where v.voteID=" + voteID;
    // voteItemSql = "select r.voteItemID,s.storeName,s.storeBanner,SUM(r.votes) as sumVote from `voteitem` i inner join `vote` v on i.voteID=v.voteID join `voterecord` r on i.voteitemID=r.voteitemID join `store` s on s.storeID=i.storeID where v.voteID=" + voteID + " group by r.voteItemID";
    voteItemSql = "select i.voteItemID,s.storeName,s.storePhoto,SUM(r.votes) as sumVote from `voteitem` i inner join `vote` v on i.voteID=v.voteID left join `voterecord` r on i.voteitemID=r.voteitemID join `store` s on s.storeID=i.storeID where v.voteID=" + voteID + " group by i.voteItemID";
    voteCheckSql = "select r.voteItemID,r.memberID  from `voteitem` i inner join `vote` v on i.voteID=v.voteID join `voterecord` r on i.voteitemID=r.voteitemID where v.voteID=" + voteID + " and r.memberID=" + memberID;
    next();
});

router.post('/vote', function (req, res, next) {
    for (let i = 0; i < req.body.voteItemID.length; i++) {
        db.query('insert into `voterecord`(`voteItemID`, `voteID`, `memberID`) VALUES (?,?,?)',
            [req.body.voteItemID[i],
                voteID,
                memberID,],
            function (err, results) {
                if (err) console.log("ERR!!");
            })
    }
    next();
});

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
            .then(results => {
                resolve(results);
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

/* GET home page. */
router.get('/', async (req, res, next) => {
    newsJSON = JSON.stringify(await getMemberData(req));
    const vote = await getVoteData(req);
    const voteItem = await getVoteItemData(req);
    const voteCheck = await getCheckData(req);
    voteJsonResult = JSON.stringify(vote);
    voteItemJsonResult = JSON.stringify(voteItem);
    voteChecksonResult = JSON.stringify(voteCheck);
    res.render('mVote', {
        mMemberData: newsJSON,
        vote: voteJsonResult,
        voteItemList: voteItemJsonResult,
        voteCheck: voteChecksonResult,
        active: 'mCalendar'
    });
    //          第一參數放ejs黨名  第二參數放需要的值
    // console.log(voteChecksonResult);
    //測試是否成功    
});


module.exports = router;