/**
 * 硬币相关api
 */
const express = require('express');
const router = express.Router();
// 导入数据库操作模块
const db = require('../db.js')

// 获取用户硬币数
router.get("/usercoins",(req, res)=>{
    // console.log('查看是否拿的到用户信息', req.auth.openid)
    // console.log(req.query)
    // 参数校验 是否存在 userid
    db.query(`select coins from wxuser where user_id='${req.auth.openid}'`, (err, result) => {
        console.log('result coins', result)
        res.send({
            coins: result[0].coins,
            status: 200,
            messages: '查询成功'
        })
    })
})

module.exports = router