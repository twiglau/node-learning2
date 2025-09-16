
const Model = require('../core/model');

class HistoryModel extends Model {
  constructor(ctx) {
    super(ctx);
    this.collectionName = 'ticket_history';
  }
}

module.exports = HistoryModel;