var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var northDistrict = "";
var storeInformation ="";
var centralDistrict ="";
let northDistrictSql = 'SELECT * FROM `district` where area=1';
let centralDistrictSql = 'SELECT * FROM `district` where area=2';
let storeInformationSql = 'SELECT * FROM `store` where storeID=1';
let commentSql = 'SELECT * FROM `comment` where storeID=1';
/* GET home page. */



// 地區
// 北部
const getNorthDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(northDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
//中部
const getCentralDistrictData = (req)=>{
    return new Promise((resolve,reject)=>{
      db.queryAsync(centralDistrictSql)
        .then(results=>{
          resolve(results);
        })
        .catch(ex=>{
          reject(ex);
        })
    })
  }
//店家資訊
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
    const b = await getNorthDistrictData(req);
    northDistrict = JSON.stringify(b)
    const c = await getCentralDistrictData(req);
    centralDistrict = JSON.stringify(c)
    // console.log(northDistrict)
    res.render('sInformation', { a: storeInformation ,b:northDistrict,c:centralDistrict })
})


module.exports = router;