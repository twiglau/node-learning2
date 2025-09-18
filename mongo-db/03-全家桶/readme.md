# MongoDB 全家桶

```lua
软件模块                           描述
mongod                            MongoDB数据库软件
mongo                             MongoDB命令行工具，管理MongoDB数据库
mongos                            MongoDB路由进程，分片环境下使用
mongodump/mongorestore            命令行数据库备份与恢复工具
mongoexport/mongoimport           CSV/JSON导入与导出，主要用于不同系统间数据迁移
Compass                           MongoDB GUI管理工具
Ops Manager(企业版)                MongoDB 集群管理软件
BI Connector(企业版)               SQL解释器、BI套接件
MongoDB Charts(企业版)            MongoDB可视化软件
Atlas(付费集免费)                  MongoDB云托管服务，包括永久免费数据库
```

## Mongodump/mongorestore

- 类似于 MySQL 的 dump/restore 工具
- 可以完成全库 dump: 不加条件
- 也可以根据条件 dump 部分数据： -q 参数
- Dump 的同时跟踪数据变更： --oplog
- Restore 是反操作，把 mongodump 的输出，导入到 mongodb

```sh
mongodump -h 127.0.0.1:27017 -d test -c test
mongorestore -h 127.0.0.1:27017 -d test -c test xxx.bson
```
