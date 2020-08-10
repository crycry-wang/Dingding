var express = require('express');
var router = express.Router();
var db = require('../model/db');

//進到首頁的店家照片+店名
let storeIndexSql = 'SELECT storeID,storeName,storeBanner FROM `store`';
//地區
let districtSql = 'SELECT * FROM `district`';
// 點擊店家後連結店家資訊
let storeSql = 'SELECT a.storeID,a.storeName,a.storeBanner,a.storeIntroduction,a.storePhone,a.storeAddress,a.storeClose,a.storeOpen,a.storeNotice,b.productID,b.productName,b.categoryID,b.productPhoto,b.productInformation,b.productPrice,c.commentID,c.memberID,c.commentContent,c.commentScore,c.commentTime,d.categoryName,e.districtID,f.districtName,f.country,g.memberName FROM `store` a JOIN `product` b on a.storeID=b.storeID JOIN `comment` c on a.storeID=c.storeID JOIN `category` d on b.categoryID=d.categoryID JOIN `delivery` e on a.storeID=e.storeID JOIN `district` f on e.districtID=f.districtID JOIN `member` g on c.memberID=g.memberID where a.storeID=1;';
//首頁店家評分
let commentSql = 'SELECT storeID,count(commentID) count,round(AVG(commentScore),1) star FROM `comment` group by storeID';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// router.post('/',(req,res)=>{
//   const rSql = 'insert into `member`(`eMail`, `password`, `memberName`,`memberPhone`) VALUES (?,?,?,?)'
//   db.queryAsync(rSql, [
//     req.body.registeredEmail,
//     req.body.registeredPassword,
//     req.body.registeredName,
//     req.body.registeredPhone,
// ])
// .then(results=>{
//   res.json(results);
// })
// .catch(ex=>{
//   console.log('ex:', ex);
// })
// })

router.post('/',(req,res)=>{
  db.query('SELECT eMail FROM `member` WHERE eMail=?',[req.body.registeredEmail],(error,results) => {
    console.log(req.body.registeredEmail)
    console.log(results)
    if(error){
      console.log(error);
    }
    else if(results.length > 0){
      console.log("123456456")
      return res.send('/',{message:'信箱已被使用'});
    }else{
      
    }
  })

  const rSql = 'insert into `member`(`eMail`, `password`, `memberName`,`memberPhone`) VALUES (?,?,?,?)'
  db.queryAsync(rSql, [
    req.body.registeredEmail,
    req.body.registeredPassword,
    req.body.registeredName,
    req.body.registeredPhone,
],(error,results) => {
  if(error){
    console.log(error)
  } else {
    console.log(results)
    return res.send('/',{message:'您已成功註冊'});
  }
})
})


// router.get('/', function (req, res, next) {
  
//   db.query(districtSql, function (err, results, fields) {
//     if (err) console.log("ERR!!");
//     district = JSON.stringify(results);
//     // console.log(district)
//     return district;

//   });
//   db.query(storeSql, function (err, results, fields) {
//     if (err) console.log("ERR!!");
//     store = JSON.stringify(results);
//     console.log(store)
//     return store;

//   });


//   res.render('index', { a: district, b: store });
// });

module.exports = router;
