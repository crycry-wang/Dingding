var express = require('express');
var router = express.Router();
var db = require('../model/db');
const { resolve, reject } = require('bluebird');
var northDistrict = "";
var storeInformation ="";
var centralDistrict ="";
var storeProduct="";
let storeID = 1;
let northDistrictSql = "SELECT * FROM `district` where area='北部'";
let centralDistrictSql = "SELECT * FROM `district` where area='中部'";
let storeInformationSql = 'SELECT * FROM `store` where storeID='+ storeID ;
let storeProductSql = 'SELECT a.storeID,a.productID,a.productName,a.categoryID,a.productPhoto,a.productinformation,a.productPrice,b.categoryName FROM `product` a LEFT JOIN `category` b on a.categoryID=b.categoryID WHERE a.storeID='+ storeID;
let commentSql = 'SELECT * FROM `comment` where storeID='+ storeID ;
let commentScoreSql = 'SELECT count(commentID) count,round(AVG(commentScore),1) star FROM `comment` WHERE storeID='+ storeID ;
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
//店家菜單
const storeProductData = (req) => {
    return new Promise((resolve,reject) => {
        db.queryAsync(storeProductSql)
            .then(results => {
                resolve(results);
            })
            .catch(ex => {
                reject(ex);
            })
    })
}
//店家評分
const commentScoreData = (req) => {
  return new Promise((resolve,reject) => {
    db.queryAsync(commentScoreSql)
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
    const b = await getNorthDistrictData(req);
    const c = await getCentralDistrictData(req);
    const d = await storeProductData(req);
    const e = await commentScoreData(req);
    storeInformation = JSON.stringify(a)
    northDistrict = JSON.stringify(b)
    centralDistrict = JSON.stringify(c)
    storeProduct = JSON.stringify(d)
    storeProduct = JSON.stringify(e)
    // console.log(northDistrict)
    res.render('sInformation', { a: storeInformation ,b:northDistrict,c:centralDistrict,d:storeProduct,e:storeProduct })
})


module.exports = router;