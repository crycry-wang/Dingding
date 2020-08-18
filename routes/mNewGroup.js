var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

// 側邊欄 
var memberId;
var memberSelect;
var member;

router.get('/', function (req, res, next) {
    // 側邊欄 
    memberId = req.session.memberID;
    member = memberSelect + memberId;
    memberSelect = 'select a.`memberID`,a.`memberName`,a.`memberPhoto`,\
    count(b.`noticeStatus`) as noticeCount from `member` as a,\
    `notice` as b where a.memberID=b.toWhoID and toWhoType=2 \
    and b.noticeStatus=1 and memberID=';

    next();
  });
  
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
router.get('/', async(req, res, next) =>{
    // 側邊欄
  newsJSON = JSON.stringify(await getMemberData(req));


   var a = req.session.tempgroupID;
    // res.locals.tempgroupID;
    console.log("mNew"+req.session.tempgroupID);
    console.log("mNew"+ a);
    // console.log("mNew"+res.locals.tempgroupID);

    var sql = 'SELECT a.groupID,a.memberID,a.groupAdmin,b.groupName,c.memberName,c.eMail FROM `groupmember` a inner join `group` b on a.groupID=b.groupID inner join `member` c on a.memberID=c.memberID WHERE a.groupAdmin=1 and a.memberID=38 and a.groupID=?';
    db.query(sql,[5], function(err, results) {
        groupData = JSON.stringify(results);
        var sql = 'SELECT a.groupID,a.groupAdmin,a.memberID,b.memberName,b.memberPhoto FROM `groupmember` a inner join `member` b on a.memberID=b.memberID where a.groupID=?';
        db.query(sql,[5], function(err, results) {
            groupList = JSON.stringify(results);
            res.render('mNewGroup', { groupData: groupData,
                                    groupList: groupList,
                                    mMemberData: newsJSON,
                                    active: 'mCalendar'
            });
        })

    })
});

router.post('/inviteMember', function(req, res, next) {
    var sql = 'select memberID from member where eMail=?';
    db.query(sql, [req.body.memberEmail], function(err, results) {
        console.log(results[0].memberID);
        var sql = 'insert into `groupmember` (groupID,groupAdmin,memberID) values (5,0,?)';
        db.query(sql, [results[0].memberID], function(err, results) {
            console.log(results);
        })
    })
})

module.exports = router;