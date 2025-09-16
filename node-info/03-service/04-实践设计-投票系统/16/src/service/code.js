

const Service = require('../core/service');
const load = require('../core/load');

const cache = load.loadLib('cache');

const ACT_USER_JOIN_RESULT = 'activity_join_{actId}_user_id_{userId}';
const CODE_TICKET_MAPPING = 'code_{code}_with_ticket';
const CACHE_TIME_SEC = 0;

class CodeService extends Service {
  async import(actId,ticketId,ticketCodes) {
    const codeModel = load.loadModel(this.ctx, 'code');
    const ticketModel = load.loadModel(this.ctx, 'ticket');
    const actModel = load.loadModel(this.ctx, 'act');

    if(!actModel.getOneById(actId)) {
      this.log('error', 'wrong act id', { actId, ticketId, ticketCodes });
      return false;
    }
    if(!ticketModel.getOneById(ticketId)) {
      this.log('error', 'wrong ticket id', { actId, ticketId, ticketCodes });
      return false;
    }
    if(!ticketCodes || ticketCodes.length < 1) {
      this.log('error', 'ticket codes is not right', { actId, ticketId, ticketCodes });
      return false;
    }

    let filterList = [];
    let rowList = [];
    for(const ticketCode of ticketCodes) {
      if(!ticketCode || ticketCode.length < 5) {
        continue;
      }
      let codeInfo = await codeModel.getInfoByCodeAndTicket(ticketCode, ticketId);
      if(codeInfo) {
        continue;
      }
      filterList.push(ticketCode);
      rowList.push({
        'ticket_id': ticketId,
        'code': ticketCode
      });
    }

    if(!filterList || filterList.length < 1) {
      this.log('error', 'has already import', { actId, ticketCodes, filterList });
      return false;
    }
    const successList = await codeModel.lpushCodes(actId, filterList);
    if(!successList || successList.length < 1) {
      this.log('error', 'lpush redis error', { actId, filterList });
      return false;
    }
    rowList = rowList.filter(rowInfo => {
      return successList.includes(rowInfo['code']);
    });

    if(rowList.length < 1) {
      return true;
    }
    const mongoRet = await codeModel.insertMany(rowList);
    if(!mongoRet) {
      this.log('error', 'insert mngodb error, pls retry later', { mongoRet, rowList });
    }
    const ticketService = load.loadService(this.ctx, 'ticket');
    rowList.forEach(async rowInfo => {
      let setRet = await cache.get(CODE_TICKET_MAPPING.replace('{code}', rowInfo['code']), rowInfo['ticket_id'], CACHE_TIME_SEC);
      if(!setRet) {
        this.log('error', 'set cache error', { CODE_TICKET_MAPPING, rowInfo });
      }
      let ticketCacheRet = await ticketService.cacheDetailById(rowInfo['ticket_id']);
      if(!ticketCacheRet) {
        this.log('error', 'set cache ticketInfo error', { rowInfo });
      }
    })

    return true;
  }
}


module.exports = CodeService;