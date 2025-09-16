

const Controller = require('../core/controller');
const load = require('../core/load');

class Ticket extends Controller {

  /**
   * @description 抢票核心代码实现
   * @params { string } actId 具体的活动 id
   */
  async get() {
    let actId = this.getParams('actId');
    if(!actId) {
      return this.resApi(false, 'params error');
    }

    // 校验是否参加过，以及参数是否正确
    const actService = load.loadService(this.ctx, 'act');
    const checkRet = await actService.checkCanJoin(actId);
    if(checkRet == -1) {
      return this.resApi(false, 'params error');
    }
    if(checkRet !== 0) {
      return this.resApi(false, 'you have already join', { 'errCode': 1001, checkRet });
    }

    // 抢票核心流程
    const codeService = load.loadService(this.ctx, 'code');
    const ticketCode = await codeService.getOneCode(actId);
    if(ticketCode == 1) {
      return this.resApi(false, 'no more ticket code', { 'errCode': 2001 });
    }
    if(ticketCode == -1) {
      return this.resApi(false, 'server error, pls retry later', { 'errCode': 3001 });
    }

    // 获取票相关通用信息
    let ticketInfo = {};
    const ticketId = await codeService.getTicketIdByCode(ticketCode);
    if(!ticketId) {
      this.log('error', 'get code ticket mapping error', { ticketCode });
    } else {
      const ticketService = load.loadService(this.ctx, 'ticket');
      ticketInfo = await ticketService.getTicketInfo(ticketId);
    }

    // 异步记录历史数据
    // 避免抢票后，无法查看个人票信息，此处为异步，为了性能考虑，不分丢失数据可以后续再补充
    const historyService = load.loadService(this.ctx, 'history');
    historyService.insertHistory(actId, ticketCode).then(ret => {
      // 无需处理，已经在 historyService 中处理，并告警提示
    });

    return this.resApi(true, 'success', {
      ...ticketInfo,
      code: ticketCode
    });
  }
}

module.exports = Ticket;