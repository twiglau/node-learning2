/**
 * @description 封装 mongodb api
 */
const uri = "mongodb+srv://twiglau:aaaaaaaa@test01.7pd1lem.mongodb.net/?retryWrites=true&w=majority&appName=test01"
const MongoClient = require('mongodb').MongoClient

let baseMongodb;

class BaseMongodb {
    constructor() {
        this.mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
        this.mongoClient.connect(err => {
            if(err){
                console.log('connect db error', err);
                return;
            }
            this.client = this.mongoClient;
        });
    }

    async getClient() {
        if(!this.client) {
            this.client = await this.mongoClient.connect();  
        }
        return this.client;
    }
}

 module.exports = () => {
     if(!baseMongodb){
        baseMongodb = new BaseMongodb();
     }
     return baseMongodb;
 }