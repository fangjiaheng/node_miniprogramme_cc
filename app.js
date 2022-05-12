const express = require("express")
const AppConfig = require('./config')

const app = express()
let appConfig = new AppConfig(app)
appConfig.run()



app.listen(appConfig.port, ()=>{
    console.log(`Example app listening on port ${appConfig.port}!`)
})