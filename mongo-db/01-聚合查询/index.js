const { MongoClient } = require('mongodb')
const moment = require('moment')

const client = new MongoClient('mongodb://127.0.0.1:27017')


const clientFun = async function (tableName) {
  await client.connect()
  const db = client.db('mock')
  const ccTable = db.collection(tableName)
  return ccTable
}

const main = async () => {
  const cc_table = await clientFun('orders')
  // 1. 计算到目前为止的所有订单的总销售额
  var d = await cc_table.aggregate([
    {
      $group: {
        '_id':null,
        'total': { $sum:'$total'}
      }
    }
  ]).toArray()
  // 2. 查询2019年第一季度（1.01 ~ 3.31)已完成订单（completed)的订单总金额和订单总数
  var e = await cc_table.aggregate([
    { 
      // 2.1 匹配条件
      $match: {
        status: 'completed', 
        orderDate: {
          $gte: moment("2019-01-01").toDate(),
          $lt: moment("2019-04-01").toDate()
        }
      }
    },
    {
      // 2.2 聚合订单总金额，总运费，总数量
      $group: {
        '_id': null,
        total: { $sum: "$total"},
        shippingFee: { $sum: "$shippingFee" },
        count: { $sum: 1 } // 每条数据，+= 1 操作
      }
    },
    {
      // 2.3 计算总金额
      $project: {
        grandTotal: { $add: ["$total", "$shippingFee"] },
        count: 1, // 保持查询结果输出
        _id: 0, // 不需要输出
      }
    }
  ]).toArray();

  console.log('结果：', d,  e);
}

main().finally(() => client.close())