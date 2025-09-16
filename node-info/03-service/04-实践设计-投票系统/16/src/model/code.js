
const Model = require('../core/model');

class CodeModel extends Model {
  constructor(ctx) {
    super(ctx);
    this.collectionName = 'ticket_code';
  }
}

module.exports = CodeModel;