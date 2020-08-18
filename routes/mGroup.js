var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { text } = require('express');
var session = require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
    var sql = 'SELECT a.groupMemberID,a.memberID,a.groupAdmin,a.groupID,b.groupName,c.memberName FROM `groupmember` a inner join `group` b on a.groupID = b.groupID inner join `member` c on a.memberID=c.memberID WHERE a.memberID=38';
    db.query(sql, function (err, results) {
        if (err) console.log('query data err!!')
        // console.log(results);
        GroupList = JSON.stringify(results);
        checkGroupList = JSON.parse(GroupList);
        checkGroup = checkGroupList.map(item => item.groupID);


        var sql = 'SELECT * FROM `groupmember` a inner join `member` b on a.memberID = b.memberID where groupAdmin=1'
        db.query(sql, function (err, results) {
            if (err) console.log('err!!')
            // console.log(results);
            GroupAdmin = JSON.stringify(results);
            checkAdminList = JSON.parse(GroupAdmin);
            checkAdmin = checkAdminList.map(item => item.groupID);

            // console.log(checkGroup);
            // console.log(checkAdminList);

            res.render('mGroup', { GroupList, GroupAdmin });
        })


    })

});

router.post('/joinGroup', function (req, res, next) {
    // console.log(req.body.groupNum);
    var sql = 'SELECT a.groupID,a.memberID,a.groupAdmin,b.groupName,c.eMail,c.memberName FROM `groupmember` a inner join `group` b on a.groupID=b.groupID inner join `member` c on a.memberID=c.memberID where a.groupID=?';
    db.query(sql, [req.body.groupNum], function (err, results) {

        resStr = JSON.stringify(results);
        resPar = JSON.parse(resStr);
        // console.log(resPar);

        if (results != 0) {
            var sql = 'SELECT a.groupID,a.memberID,a.groupAdmin,b.groupName,c.memberName,c.eMail FROM `groupmember` a inner join `group` b on a.groupID=b.groupID inner join `member` c on a.memberID=c.memberID where a.memberID=38 and a.groupID=?';
            db.query(sql, [req.body.groupNum], function (err, results) {
                resStr = JSON.stringify(results);
                resPar = JSON.parse(resStr);
                // console.log(resPar);
                var backMessage = "";
                if (results != 0) {
                    for (let i = 0; i < resPar.length; i++) {
                        if (resPar[i].eMail === 'a0997248516@gmail.com') {
                            // console.log('已加入過此團體');
                            mestext = [{ Message: '已加入過此團體', groupName: results[0].groupName }];
                            backMessage = JSON.stringify(mestext);
                            console.log(mestext);
                            res.json(backMessage);
                        }
                    }
                } else {
                    // console.log('還沒加入此團體');
                    // mestext = [{ Message: '還沒加入此團體' }];
                    // backMessage = JSON.stringify(mestext);
                    var sql = 'SELECT a.groupID,a.memberID,a.groupAdmin,b.groupName,c.memberName,c.eMail FROM `groupmember` a inner join `group` b on a.groupID=b.groupID inner join `member` c on a.memberID=c.memberID WHERE a.groupAdmin=1 and a.groupID=?';
                    db.query(sql, [req.body.groupNum], function (err, results) {
                        console.log(results);
                        backMessage = JSON.stringify(results);
                        res.json(backMessage);
                    })
                }
            })
        } else {
            console.log('請輸入正確團號');
            mestext = [{ Message: '請輸入正確團號' }];
            backMessage = JSON.stringify(mestext);
            res.json(backMessage);
        }

    })
})

router.post('/insertGroup', function (req, res, next) {
    var sql = 'insert into groupmember (groupID,memberID,groupAdmin) values (?,38,0)';
    db.query(sql, [req.body.groupNum], function (err, results) {
        console.log('已加入成功');
        res.location('back');
    })
})

router.post('/createGroup', function (req, res, next) {
    var sql = 'insert into `group` (groupName) values (?)';
    db.query(sql, [req.body.buildgroupName], function (err, results) {
        console.log('建立團體成功');

        var sql = 'select * from `group` where groupName=?';
        db.query(sql, [req.body.buildgroupName], function (err, results) {
            tempgroupID = results[0].groupID;
            // console.log("tempgroupID"+ " " + tempgroupID);

            req.session.tempgroupID = tempgroupID;
            // res.locals.tempgroupID = req.session.tempgroupID;
            console.log("mGroup"+req.session.tempgroupID);

            var sql = 'insert into `groupmember` (groupID,memberID,groupAdmin) values (?,38,1)';
            db.query(sql, [tempgroupID], function (err, results) {
                // console.log(results);
                res.redirect('/mNewGroup');
            })
        })
    })
    // var sql = 'SELECT a.groupID,a.memberID,a.groupAdmin,b.groupName FROM `groupmember` a inner join `group` b on a.groupID=b.groupID where groupName=?';
    // db.query(sql, [req.body.buildgroupName], function (err, results) {
    //     console.log(results);
    // })
})



module.exports = router;