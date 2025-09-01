const path = require('path')

exports.resolve = function(pathname) {
  return path.join(__dirname, '..', pathname)
}

exports.formatResultData = (status, data, message = '服务端离家出走') => {
  return {
    status,
    data,
    message
  }
}