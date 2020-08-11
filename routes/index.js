var express = require('express');
var router = express.Router();
var db = require('../model/db');
// var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  test = req.session.userName;
  res.render('index',{ userName : req.session.userName});
});

module.exports = router;
