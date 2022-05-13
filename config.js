const express = require("express");

// 解析post请求参数
const bodyParser = require('body-parser')

// 解析token
const { jwtSecretKey } = require('./keys')
const { expressjwt } = require('express-jwt')

// 路由
const userRouter = require('./routes/user')
const coinsRouter = require('./routes/coins')
const signinRouter = require('./routes/signin')
const taskRouter = require('./routes/task')
const mallRouter = require('./routes/mall')
const { errorHandler } = require('./utils/common')
const PORT = 4001

class AppConfig {
    constructor(app) {
        this.app = app
        this.port = PORT
    }

    run() {
        // 获取post请求参数
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        // 设置静态资源根目录
        this.app.use(express.static("public"));

        // 验证token
        this.app.use(
            expressjwt({
                secret: jwtSecretKey,
                algorithms: ['HS256'], // 使用何种加密算法解析
            })
            .unless({ path: ['/wxuser'] }) // 登录页无需校验
        )

        // 设置路由
        this.app.use(userRouter)
        this.app.use(coinsRouter)
        this.app.use(signinRouter)
        this.app.use(taskRouter)
        this.app.use(mallRouter)

        // 报错处理
        this.app.use(errorHandler)
    }
}


module.exports = AppConfig