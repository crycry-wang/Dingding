var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */

const storeID = 1;
const storeSelect = 'select * from `store` where storeID=';
const store = storeSelect + storeID;
// 評價
const commentSelect = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID=';
const comment = commentSelect + storeID;
const commentJoinMemberSelect='SELECT a.commentID,a.commentScore,b.memberName,b.memberPhoto,a.commentContent,a.commentTime FROM `comment` a join member b on a.memberID=b.memberID WHERE a.storeID=';
const commentJoinMember=commentJoinMemberSelect+storeID;


// 訂單完成數
// 訂單總筆數
const orderSelect = 'SELECT orderStatus FROM `order` WHERE storeId=';
const order = orderSelect + storeID;
// 訂單總筆數



const getStoreData = (req) => {
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