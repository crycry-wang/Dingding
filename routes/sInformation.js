var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var district = "";
var storeInformation ="";
let districtSql = 'SELECT * FROM `district`';
let storeInformationSql = 'SELECT * FROM `store` where storeID=1'
/* GET home page. */

// 地區
const getDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(districtSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }

const storeInformationData = (req) => {
    return new Promise((resolve, reject) => {
        db.queryAsync(storeInformationSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            })
    })
}
router.get('/', async (req, res) => {
    const a = await storeInformationData(req);
    storeInformation = JSON.stringify(a)
    const b = await getDistrictData(req);
    district = JSON.stringify(b)
    console.log(district)
    res.render('sInformation', { a: storeInformation ,b:district })
})
// router.get('/', function (req, res, next) {

//     db.query(districtSql, function (err, results, fields) {
//         if (err) console.log("ERR!!");
//         district = JSON.stringify(results);
//         res.render('sInformation', { district });
//     })

// });

module.exports = router;