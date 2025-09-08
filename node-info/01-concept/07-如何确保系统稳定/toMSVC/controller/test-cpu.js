const Controller = require('../core/controller');

class Test extends Controller {
  constructor(res, req) {
    super(res,req);
  }

  /**
   * 复杂计算, cpu密集
   */
  bad() {
    let sum=0;
    for(let i=0; i<1_000_000_000;i++) {
      sum += i;
    }

    return this.resApi(true, 'success', { sum });
  }

  /**
   * 正常请求
   */
  normal() {
    return this.resApi(true, 'good', 'hello world')
  }
}

module.exports = Test;