var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dingding'
})

db.connect(function(err){
    if(err){console.log("connectERR!!!")};
    console.log("Connected!!");
})

module.exports = db;