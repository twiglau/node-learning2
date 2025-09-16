

const fs = require('fs');
const moment = require('moment');

const Controller = require('../core/controller');
const load = require('../core/load');

class Tools extends Controller {
  async test() {
    try {
      const cache = load.loadLib('cache');
      const ret = await cache.set('test_key', 1);
      const value = await cache.get('test_key');
      if(!ret || value != 1) {
        return this.resApi(false, 'connect redis error');
      }
    } catch (error) {
      console.log(error);
      this.log('error', 'connect redis error', { error });
      return this.resApi(false, 'connect redis error');
    }
    
    try {
      const baseMongo = require('../lib/baseMongodb')();
      const client = await baseMongo.getClient();
      client.db('nodejs_column').collection('test');
    } catch (error) {
      console.log(error);
      this.log('error', 'connect mongodb error', { error });
      return this.resApi(false, 'connect mongodb error');
    }

    return this.resApi(true, 'mongodb and redis connect success');
  }
}

module.exports = Tools;