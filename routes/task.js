/**
 * 任务相关api
 */
const express = require('express');
const router = express.Router();
// 导入数据库操作模块
const db = require('../db.js')
const { formatTime, encodeEmoji } = require('../utils/common')

// 获取任务列表
// router.get("/tasklist",(req, res)=>{
//     db.query(`select coins from wxuser where user_id='${req.auth.openid}'`, (err, result) => {
//         console.log('result coins', result)
//         res.send({
//             coins: result[0].coins,
//             status: 200,
//             messages: '查询成功'
//         })
//     })
// })

// 获取已经完成的任务列表
router.get("/finishedlist",(req, res)=>{
    let sql = `select * from task_complete where user_id='${req.auth.openid}' and time='${formatTime(new Date())}'`
    // console.log('sql', sql)
    db.query(sql, (err, result) => {
        // console.log('result finishedlist', result)
        let list = []
        result.forEach(item => list.push(item.task_id))
        res.send({
            list,
            status: 200,
            messages: '查询成功'
        })
    })
})

// 完成任务
router.post("/finishtask",(req, res)=>{
    // console.log(req.body, req.body.reward)
    // 如果插入的字段存在emoji表情,则先转码
    let taskName = encodeEmoji(req.body.taskname)
    // 向任务表添加一条完成的记录
    //let sql = `insert into task_complete(user_id,task_id,time) values('${req.auth.openid}', ${req.body.taskid}, '${formatTime(new Date())}')`
    let sql = `insert into task_complete(user_id,task_id,task_name,time) values('${req.auth.openid}', ${req.body.taskid}, '${taskName}', '${formatTime(new Date())}')`
    db.query(sql, (err, result) => {
        // 更新硬币数量
        db.query(`update wxuser set coins=coins+${req.body.reward} where user_id = '${req.auth.openid}'`, (err, result) => {
            res.send({
                status: 200,
                messages: '操作成功'
            })
        })
    })
})

module.exports = router