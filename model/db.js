var mysql = require('mysql');
const bluebird = require('bluebird');

<<<<<<< HEAD
// Window
=======
// Windown
>>>>>>> 9213941662484860b5a3464418a09f45fe91de25
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dingding',
<<<<<<< HEAD
    dateStrings: true
=======
    dateStrings:true
>>>>>>> 9213941662484860b5a3464418a09f45fe91de25
});

// MAC專用
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'dingding',
//     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
//     dateStrings : true
//  });
<<<<<<< HEAD

=======
 
>>>>>>> 9213941662484860b5a3464418a09f45fe91de25

db.connect(function(err) {
    if (err) { console.log("connERR!!!") };
    console.log("Connected!");
})

bluebird.promisifyAll(db);
module.exports = db;