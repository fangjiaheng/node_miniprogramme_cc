const express = require('express');
const router = express.Router();

// 导入requset包
const request = require('request')
// 导入数据库操作模块
const db = require('../db.js')
// 导入生成token的包
const jwt = require('jsonwebtoken')

const { jwtSecretKey } = require('../keys')

router.post("/wxuser",(req, res)=>{
    let params = req.body // 接收小程序端传过来的所有数据
    let code = params.code;//获取小程序传来的code

    // let userInfo = JSON.parse(params.userInfo) //获取个人信息
    let appid = "wx48b918518ae077a7"; //自己小程序后台管理的appid，https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=778938231&lang=zh_CN
    let secret = "11b387b0e6e25e398f4171b71b77cd7a"; //小程序后台管理的secret
    let grant_type = "authorization_code";// 授权（必填）默认值

    //请求获取openid
    let url = "https://api.weixin.qq.com/sns/jscode2session?grant_type="+grant_type+"&appid="+appid+"&secret="+secret+"&js_code="+code;
    request(url, (err, response, body) => {
        // console.log('response code', response.statusCode)
        if (!err && response.statusCode == 200) {
            // 服务器返回的openid、sessionKey
            let _data = JSON.parse(body)
            _data.code = code
            _data.session_key = ''
            // 对用户信息进行加密生成字符串
            const wxToken = jwt.sign(_data, jwtSecretKey, { expiresIn: '8640h' })
            // 定义sql 语句，查询当前用户是否存在（openid）
            db.query(`select * from wxuser where user_id='${_data.openid}'`, (err, result) => {
                if (err) return res.send(err)
                // 如果没有该用户信息, 则将该用户信息存入
                if (result.length === 0) {
                    db.query(`insert into wxuser(user_id) values('${_data.openid}')`, (err, result) => {
                        if (err) return res.send(err)
                        if (result.affectedRows !== 1) return res.send('授权失败，请重试')
                    })
                }
                res.send({
                    token: 'Bearer ' + wxToken,
                    status: 200,
                    messages: 'WX1 授权成功'
                })
            })
        } else {
            res.send('请求openid失败')
        }
    })
})

router.post("/updateuserinfo",(req, res)=>{
    let userInfo = JSON.parse(req.body.userInfo)
    db.query(`update wxuser set nickName='${userInfo.nickName}', avatar='${userInfo.avatarUrl}', gender='${userInfo.gender}' where user_id = '${req.auth.openid}'`, (err, result) => {
        if (err) return res.send(err)
        res.send({
            userInfo: {
                nickName: userInfo.nickName,
                avatar: userInfo.avatarUrl,
                gender: userInfo.gender
            },
            status: 200,
            messages: '获取用户信息成功'
        })
    })
})

module.exports = router
