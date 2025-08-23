const express = require('express')
const db = require('./db')

const app = express()
app.use(express.urlencoded())
app.use(express.json())

app.get('/', async function(req,res) {
  try {
    const data = await db.getDb()
    res.send(data)
  } catch (error) {
    res.status(500).json({error})
  }
})

app.post('/', async (req, res) => {
    let body = req.body
    if(!body) {
      res.status(403).json({
        message: '缺少用户信息'
      })
    }
    const jsonObj = await db.getDb()
    body.id = new Date().valueOf()
    jsonObj.users.push(body)
    try {
      const w = await db.serveDb(jsonObj)
      if(!w) {
        res.send({code: 200, message: '保存成功'})
      }

    } catch (error) {
      res.status(500).json({
        error
      })
    }

})

app.put('/:id', async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  try {
    let data = await db.getDb()
    let users = data.users
    let userId = Number.parseInt(req.params.id)
    let dbUser = users.find(ele => ele.id === userId)
    if(!dbUser) {
      res.status(403).json({
        message: '用户不存在'
      })
    }

    const body = req.body
    if(!body) {
      res.status(403).json({
        message: '参数为空'
      })
    }

    dbUser.username = body.username ? body.username : dbUser.username
    dbUser.age = body.age ? body.age : dbUser.age

    data.users = data.users.map(ele => ({
      ...ele,
      username: ele.id === dbUser.id ? dbUser.username : ele.username,
      age: ele.id === dbUser.id ? dbUser.age : ele.age
    }))

    let w = await db.serveDb(data)
    if(!w) {
      res.send({
        message: '更新成功'
      })
    }
  } catch (error) {
    res.status(500).json({error})
  }
})

app.listen(3000, () => {
  console.log(`Run http://127.0.0.1:3000`)
})