var express = require('express');
var router = express.Router();
var db = require('../model/db');
var district = ""
/* GET home page. */
router.get('/', function (req, res, next) {

    db.query('SELECT * FROM `district`', function (err, results, fields) {
        if (err) console.log("ERR!!");
        district = JSON.stringify(results);
        res.render('sInformation', { district });
    })

});

module.exports = router;