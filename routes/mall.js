/**
 * 兑换奖励相关api
 */
const express = require('express');
const router = express.Router();
// 导入数据库操作模块
const db = require('../db.js')
const { formatTime, encodeEmoji, deCodeEmoji } = require('../utils/common')

// 获取商城列表
// router.get("/malllist",(req, res)=>{
//     db.query(`select coins from wxuser where user_id='${req.auth.openid}'`, (err, result) => {
//         console.log('result coins', result)
//         res.send({
//             coins: result[0].coins,
//             status: 200,
//             messages: '查询成功'
//         })
//     })
// })
 
// 兑换奖励
router.post("/exchangegoods",(req, res)=>{
    console.log(req.body)
    let { goodsid, goodsname, consume } = req.body
    let goodsName = encodeEmoji(goodsname)
    // 查询硬币数量是否够
    db.query(`select coins from wxuser where user_id='${req.auth.openid}'`, (err, result) => {
        // console.log('result coins', result[0].coins)
        let lefCoins = result[0].coins
        if(lefCoins > consume) {
            // 向兑换记录表添加一条兑换的记录
            db.query(`insert into exchange_record(user_id,goods_id,goods_name,time) values('${req.auth.openid}', ${goodsid}, '${goodsName}', '${formatTime(new Date())}')`, (err, result) => {
                console.log(result)
            })
            // 消耗硬币数量
            db.query(`update wxuser set coins=coins-${consume} where user_id = '${req.auth.openid}'`, (err, result) => {
                res.send({
                    status: 200,
                    messages: '操作成功'
                })
            })
        } else {
            // 硬币数量不够
            res.send({
                status: 500,
                messages: '所需硬币数量不够'
            })
        }
    })
})

// 获取用户礼物兑换情况
router.get("/exchangerecord",(req, res)=>{
    let sql = `select goods_id, goods_name, time from exchange_record where user_id ='${req.auth.openid}'`
    db.query(sql, (err, result) => {
        console.log('result exchangerecord', result)
        result.forEach(item => item.goods_name = deCodeEmoji(item.goods_name))
        res.send({
            status: 200,
            list: result,
            messages: '查询成功'
        })
    })
})

module.exports = router