/**
 * 签到相关api  
 * 改进: 前端传过来的今日日期 在后端生成会不会相对好一点
 * MySQL查询当天当月数据 https://www.cnblogs.com/javasuperman/p/8955711.html
 */
const express = require('express');
const router = express.Router();
// 导入数据库操作模块
const db = require('../db.js')

// 查询当天是否已经签到
router.get("/signedin",(req, res)=>{
    db.query(`SELECT lastsigndate FROM wxuser WHERE user_id = '${req.auth.openid}';`, (err, result) => {
        let lastsigndate = result[0].lastsigndate || '1970-01-01'
        // 判断当天是否已经签到
        // console.log(lastsigndate, Date.now(), Date.parse(lastsigndate), (Date.now() - Date.parse(lastsigndate)) > 86400000)
        let signin = (Date.now() - Date.parse(lastsigndate)) < 86400000
        res.send({
            status: 200,
            signin,
            messages: '查询成功'
        })
    })
})

// 签到
router.post("/signin",(req, res)=>{
    // console.log('参数', req.body)
    // console.log('查看是否拿的到用户信息', req.auth.openid)
    // 1.用户表更新最新签到日期和硬币数量
    db.query(`update wxuser set coins=coins+20, lastsigndate='${ req.body.date }' where user_id = '${req.auth.openid}'`, (err, result) => {
        res.send({
            status: 200,
            messages: '签到成功'
        })
    })
    // 2.向签到表添加一条签到数据
    db.query(`insert into signin(user_id,time) values('${req.auth.openid}', '${ req.body.date }')`, (err, result) => {
        console.log('向签到表添加一条签到数据', result)
    })
})

// 查询某个月签到了哪几天
router.get("/signdates",(req, res)=>{
    // console.log('参数', req.query)
    // console.log('查看是否拿的到用户信息', req.auth.openid)
    db.query(`SELECT time FROM signin WHERE DATE_FORMAT( time, '%Y%m' ) = ${req.query.month} and user_id = '${req.auth.openid}';`, (err, result) => {
        // console.log(result)
        let list = []
        result.forEach(item => {
            list.push(item.time)
        })
        // console.log(list)
        res.send({
            status: 200,
            list,
            messages: '查询成功'
        })
    })
})

module.exports = router