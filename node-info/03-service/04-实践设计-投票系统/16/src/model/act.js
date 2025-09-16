
const Model = require('../core/model');

class ActModel extends Model {
  constructor(ctx) {
    super(ctx);
    this.collectionName = 'act';
  }
}

module.exports = ActModel;