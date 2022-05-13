var mysql = require("mysql")
var pool = mysql.createPool({
    host:"sh-cynosdbmysql-grp-oliz6c36.sql.tencentcdb.com",
    port: 21070,
    user:"fjh",
    password:"yDLdNLyx22fk0y",
    database:"cc"
})

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows)
            connection.release()
        })
    })
}//对数据库进行增删改查操作的基础


exports.query = query