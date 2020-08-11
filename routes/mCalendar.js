var express = require('express');
var router = express.Router();
var db = require('../model/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('mCalendar',{active: 'mCalendar'});
});

module.exports = router;
