
const Model = require('../core/model');

class UserModel extends Model {
  constructor(ctx) {
    super(ctx);
    this.collectionName = 'user';
  }
}

module.exports = UserModel;