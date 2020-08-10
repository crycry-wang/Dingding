var express = require('express');
var router = express.Router();
var db = require('../model/db');


/* GET home page. */
router.get('/', function(req, res, next) {
  let sql = `select * from product`;
  db.query(sql,(err, result)=>{
    if(err){
      console.log(err);
    }else{
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
      console.log(result);
      res.json(result);
    }

  })
});



module.exports = router;
