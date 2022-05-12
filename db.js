var mysql = require("mysql")
var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"qazwsx321",
    database:"cc"
})//数据库连接配置

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows)
            connection.release()
        })
    })
}//对数据库进行增删改查操作的基础


exports.query = query