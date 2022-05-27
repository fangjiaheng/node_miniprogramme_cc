const emojiRegex = require('emoji-regex')

// 将emoji表情转化为字符串
const encodeEmoji = str => {
    const regex = emojiRegex()
    return str.replace(regex, p => `emoji(${p.codePointAt(0)})`)
  }

// 将字符串转化为emoji表情
const deCodeEmoji = str => {
    const emojiDecodeRegex = /emoji\(\d+\)/g
    return str.replace(emojiDecodeRegex, p => {
        const filterP = p.replace(/[^\d]/g, '')
        return String.fromCodePoint(filterP)
    })
}

//test
// const str = 'hello world 🤣💯!🙌'
// const str1 = encodeEmoji(str)
// console.log(str1)
// console.log(deCodeEmoji(str1))

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

// 格式化时间 YYYY-mm-dd
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
    formatTime,
    encodeEmoji, deCodeEmoji
}