var express = require('express');
var router = express.Router();
var db = require('../model/db');

var jsonStr = "";
var jsonPar = "";

router.get('/', function(req, res, next){
    
    db.query('select * from `district`', function(err, results, fields){
        if(err) console.log("ERR!!");

        jsonStr = JSON.stringify(results);
        console.log(jsonStr);

        jsonPar = JSON.parse(jsonStr);
        console.log(jsonPar);

        res.render('MemberGroup', {jsonStr:jsonStr, jsonPar:jsonPar});
    })

})

module.exports = router;