/**
 * 硬币相关api
 */
const express = require('express');
const router = express.Router();
// 导入数据库操作模块
const db = require('../db.js')
const { formatTime, deCodeEmoji } = require('../utils/common')

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

// 获取用户最近一周获得的硬币情况 coinsrecord
router.get("/coinsrecord",(req, res)=>{
    let sql1 = `select group_concat(task_name) as 'task_name', time from task_complete where user_id ='${req.auth.openid}' and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date('${formatTime(new Date())}') group by time;`
    // console.log('sql', sql1)
    db.query(sql1, (err, result) => {
        console.log('result coinsrecord', result)
        result.forEach(item => item.task_name = deCodeEmoji(item.task_name))
        let res1 = result

        let sql2 = `select time from signin where user_id ='${req.auth.openid}' and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date('${formatTime(new Date())}')`
        // console.log('sql', sql2)
        db.query(sql2, (err, result) => {
            console.log('result coinsrecord2', result)
            let res2 = result
            
            let list = []
            for(let i=0;i< 7;i++) {
                let d = formatTime(new Date(Date.now() - 3600 * 1000 * 24 * i))
                let listItem = {
                    date: d,
                    taskNames: [],
                    signin: false
                }
                if(res1.length > 0) {
                    res1.forEach(item => {
                        if(item.time === d ) {
                            listItem.taskNames = item.task_name.split(',')
                        }
                    })
                }
                if(res2.length > 0) {
                    res2.forEach(item => {
                        if(item.time === d ) {
                            listItem.signin = true
                        }
                    })
                }
                list.push(listItem)
            }
            console.log('list', list)
            res.send({
                status: 200,
                list,
                messages: '查询成功'
            })
        })
    })

  
})

module.exports = router