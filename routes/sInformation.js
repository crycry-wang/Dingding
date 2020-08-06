var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (err) console.log("ERR!!");
    db.query('SELECT * FROM `district`',function(err, results, fields){
        district = JSON.stringify(results);
        res.render('sInformation',{district});
    })
    
});

module.exports = router;