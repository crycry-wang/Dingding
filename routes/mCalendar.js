var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET users listing. */

// 會員
const memberId = 38;
const memberSelect = 'select * from `member` where memberID=';
const member = memberSelect + memberId;

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


//傳資料到表單裡
router.get('/', async(req, res) => {
    newsJSON = JSON.stringify(await getMemberData(req));
    res.render('mCalendar', {
        mMemberData: newsJSON,
        active: 'mCalendar'
    });
});

router.post('/matterList', function(req, res, next) {
    var sql = 'select a.storeID, a.groupID, a.orderDeadline, a.memberID, a.orderID, b.storeName, b.storePhoto, c.groupName, d.memberName from `order` a inner join  `store` b on a.storeID=b.storeID inner join `group` c on a.groupID=c.groupID inner join `member` d on a.memberID=d.memberID where orderDeadline between ? and ? and d.memberID = 38';
    db.query(sql, [req.body.sqlDate, req.body.furDate], function(err, results) {
        if (err) console.log(err);
        if (results != 0) {
            OrderList = JSON.stringify(results);
            checkorderList = JSON.parse(OrderList);
            checkorder = checkorderList.map(item => item.orderID);
        } else {
            OrderList = "false";
            checkorder = "";
        }


        db.query('SELECT * FROM `orderdetail` WHERE memberID=38 and orderID= ?', [checkorder], function(err, results) {
            if (err) console.log(err);
            if (results != 0) {
                fake = [{ orderDetailID: "true" }];
                RealOrder = JSON.stringify(fake);
            } else {
                fake = [{ orderDetailID: "false" }];
                RealOrder = JSON.stringify(fake);
            }

            var sql = 'select * from `vote` a inner join `group` b on a.groupID = b.groupID inner join `member` c on a.memberID = c.memberID where voteDeadLine between ? and ? and c.memberID = 38';
            db.query(sql, [req.body.sqlDate, req.body.furDate], function(err, results) {
                if (err) console.log(err);
                console.log(results);
                if (results != 0) {
                    VoteList = JSON.stringify(results);
                    checkvoteList = JSON.parse(VoteList);
                    checkvote = checkvoteList.map(item => item.voteID);
                } else {
                    VoteList = "false";
                    checkvote = "";
                }

                db.query('SELECT * FROM `voterecord` where memberID=38 and voteID= ?', [checkvote], function(err, results) {
                    if (err) console.log(err);
                    if (results != 0) {
                        fake = [{ voteRecordID: "true" }];
                        RealVote = JSON.stringify(fake);
                    } else {
                        fake = [{ voteRecordID: "false" }];
                        RealVote = JSON.stringify(fake);
                    }

                    res.json({ OrderList, RealOrder, VoteList, RealVote });
                })
            })
        })
    })
})


module.exports = router;