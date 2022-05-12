// 定义错误中间件
function errorHandler(err, req, res, next) {
    console.log(err, err.name);
    let code = 500;
    let message = '服务器出错';
    // token解析的错误
    if (err.name === 'UnauthorizedError') {
      code = 401
      message = '用户未登录'
    }
    res.statusCode = code;
    res.send({
      status: code,
      message,
    })
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
  
    return `${[year, month, day].map(formatNumber).join('-')}` 
  }

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

module.exports = {
    errorHandler,
    formatTime
}