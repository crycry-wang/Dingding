var express = require('express');
var router = express.Router();

const mysql = require('mysql');

// 建立連線物件
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dingding',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

db.on('error', ex=>{
    console.log(ex);
});
db.connect();

module.exports = db;
/* GET home page. */
router.get('/', function(req, res, next) {
  let sql = `select * from product`;
  db.query(sql,(err, result)=>{
    if(err){
      console.log(err);
    }else{
      // JSON.stringify(res);
      // JSON.parse(res);
      // console.log(11111);
      console.log(result);
    }

  })
  res.render('mNewOrder');
});

router.get('/json', function(req, res, next) {
  let sql = `select * from product`;
  db.query(sql,(err, result)=>{
    if(err){
      console.log(err);
    }else{
      // JSON.stringify(res);
      // JSON.parse(res);
      // console.log(11111);
      console.log(result);
      res.json(result);
    }

  })
});



module.exports = router;
