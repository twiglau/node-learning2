const moment = require('moment')

module.exports = {
  createAt: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
  },
  updateAt: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
  }
}