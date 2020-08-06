var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('sInformation');
});

module.exports = router;