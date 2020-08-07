var express = require('express');
var router = express.Router();
var db = require('../model/db');
var district = ''
/* GET home page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM `district`', function (err, results, fields) {
    if (err) console.log("ERR!!");
    district = JSON.stringify(results);
    // console.log(district)
    return district;
    
  });
  db.query('SELECT * FROM `delivery`', function (err, results, fields) {
    if (err) console.log("ERR!!");
    delivery = JSON.stringify(results);
    // console.log(district)
    return delivery;
    
  });

  res.render('index', { a: district , b: delivery });
});

module.exports = router;
