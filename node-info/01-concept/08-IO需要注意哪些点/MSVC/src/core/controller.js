

const baseFun = require('../lib/baseFun');

class Controller {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @description 设置响应数据
   * @param {*} ret boolean
   * @param {*} message string
   * @param {*} dataInfo object
   * @param {*} httpStatus int
   * @returns 
   */
  resApi(ret,message, dataInfo, httpStatus=200) {
    return baseFun.setResInfo(this.ctx, ret, message, dataInfo, httpStatus)
  }
}

module.exports = Controller;