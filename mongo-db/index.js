const { MongoClient } = require('mongodb')

const client = new MongoClient('mongodb://127.0.0.1:27017')


const clientFun = async function (tableName) {
  await client.connect()
  const db = client.db('myTest')
  const ccTable = db.collection(tableName)
  return ccTable
}

const main = async () => {
  const cc_table = await clientFun('cc')
  var d = await cc_table.insertOne({username: 'monica', age: 60})
  var d = await cc_table.updateOne({age: {$gt: 15 }}, { $set: { username: 'list'}})

  console.log(d)
}

main().finally(() => client.close())