# 抢票系统

适合做这种通用的高并发服务，正好可以解决并发抢票的问题

## 系统的核心特点

1. 抢票活动可配定制化
2. 抢票并发较大
3. 物品有限，一定不能超出
4. 安全性重要，避免一些非法获利。
5. 抢票结果可导出分析

```lua

                      抢票活动前端

                          Nginx

                       Node.js 核心服务 - - - - - - - - - - - - - -
                        1.PM2监控日志
                        2.压制安全过载

                          读写缓存

   配置文件 - - - >        Redis <- 主动更新 -   Node.js 辅助服务   |
     |                        - - - - - - - - -  ^
     V                       |
   导入脚本  - - - - >    Mongodb  <- - - - - - - -                |
```

## 数据库设计

1. 本地服务器缓存
2. Redis 缓存
3. MongoDB 存储

### MongoDB 存储

1. 用户表（id,nickname,username,password)
2. 活动表（id,name,desc,image,start_time,end_time)
3. 票表 (id,act_id,name,desc,start_time,end_time)
4. 券码表 (id, ticket_id, code)
5. 用户票列表（id,user_id,code_id,time)

### Redis 存储

1. 活动详情是访问最大量的请求
2. 票详情基本都是一致的
3. 针对券码列表
4. 针对获取票结果
5. 个人的票列表

## 接口设计

1. 活动列表：显示当前可以参与的抢票活动列表
2. 活动详情：获取抢票活动信息，根据用户是否登录，获取用户是否已经参与过活动
3. 抢票接口：携带活动 ID,需要判断用户是否有登录权限，活动是否已经结束，用户是否已经参与过
4. 票列表： 需要显示用户抢到的票列表
5. 票详情：显示具体的票证详情，为后续提供一些认证信息。

```lua
# 活动列表

           Activity-C            Activity-S                  Activity-M        Redis
- act/list -> | - getActList ->      | - - - -  get -  - - - -   |     - - - ->  |
              |                      |                           |               |
                                     | - - - getOnlineList - - > |
                                     |                           |               |
                                     | < - - -  - - - - - - - -  |               |
                                     | - - - - - - -  setCache - - - - - - - - > |
                                     | < - - -  actInfos - - - - | < - actInfos -|
< - actInfos- | < - - - actInfos - - |
```

- 活动列表的大部分逻辑都经过 Service 层来处理
- 原因在于：我们希望将业务逻辑处理部分都转移到 Service 来处理，而在 Model 层保存
  比较单一的数据获取的逻辑。

```lua
# 抢票接口

P             Ticket-C            Activity-S          Ticket-S          Ticket-M                Redis

| -ticket/get >   |                   |                  |                  |                      |
|                 | - checkEnable - > |                  |                  |                      |
| < notEnable -   |
|                 | - - - - - - - - - can - - - - - -  > |                  |                      |
|                 |                                      | getUserActTicket>| - - - - get - - >    |
|                 | - - - - - -  - -  - -  -  - getOneTicket - - - -  - - > | - - list pop - >     |
|                 |                                                         |< - return ticket code|
|                 | < - - - - - - - return one ticket code - - - - - - - -  |
|                 |  - - - - getTicketInfo - - - - - - > |                  |                      |
|                 |                                      | getTicketByCode >| - - - -  get - - ->  |
|                 |                                      |                  | < - ticketInfo - - - |
|                 | < - - - -  ticketInfo - - - - - - -  | < - ticketInfo - |
| < - get result -|
```

```sh
http://127.0.0.1:3000/act/list
http://127.0.0.1:3000/act/detail?actId=111
http://127.0.0.1:3000/ticket/get
http://127.0.0.1:3000/ticket/detail?ticketId=111
http://127.0.0.1:3000/ticket/list
```
