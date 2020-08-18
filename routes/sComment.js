var express = require('express');
var router = express.Router();
var db = require('../model/db');
var session = require('express-session');

/* GET home page. */

let storeID;

let store;
// 評價
let commentSelect;
let comment;
let commentJoinMemberSelect;
let commentJoinMember;


// 訂單完成數
// 訂單總筆數
let order;
// 訂單總筆數



router.get('/', function (req, res, next) {
    storeID = req.session.storeID;
    store ='select a.`storeID`,a.`storeName`,\
    a.`storePhoto`,count(b.`noticeStatus`) as\
     noticeCount from `store` as a,`notice` as\
      b where a.`storeID`=b.`toWhoID` and b.`toWhoType`=1\
       and b.`noticeStatus`=1 and storeID=' + storeID;
       comment = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID=' + storeID;
       commentJoinMember='SELECT a.commentID,a.commentScore,b.memberName,b.memberPhoto,a.commentContent,a.commentTime FROM `comment` a join member b on a.memberID=b.memberID WHERE a.storeID='+storeID;
       order = 'SELECT orderStatus FROM `order` WHERE storeId='+ storeID;

    next();

});





// 店家左側
let getStoreData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(store)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
// 店家評論
const getcomment = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(comment)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
// 店家接單率
const getOrder = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(order)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            });
    })
};
// 評論會員
const getCommentJoinMember = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(commentJoinMember)
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
    newsJSON = JSON.stringify(await getStoreData(req));
    newsJSON1 = JSON.stringify(await getcomment(req));
    newsJSON2 = JSON.stringify(await getOrder(req));
    newsJSON3 = JSON.stringify(await getCommentJoinMember(req));

    res.render('sComment', {
        storeData: newsJSON,
        commentData: newsJSON1,
        orderData: newsJSON2,
        CommentJMData: newsJSON3,
        active: 'sComment'
    });
});


module.exports = router;