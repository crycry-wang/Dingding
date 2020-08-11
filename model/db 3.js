var mysql = require('mysql');
const bluebird = require('bluebird');

// Window
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'dingding',
//     dateStrings:true
// });

// MAC專用
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dingding',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    dateStrings : true
 });
 

db.connect(function(err) {
    if (err) { console.log("connERR!!!") };
    console.log("Connected!");
})

bluebird.promisifyAll(db);
module.exports = db;