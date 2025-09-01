# mongodb

## 连接参数

1. Standalone: 单机模式， 是 MongoDB 最基本部署方式。在这种模式下，MongoDB 运行在一个单一的服务器上，适合用于开发，测试或小型应用。由于它不具备可用性和可扩展性，因此不适用于大型生产环境或需要高可靠性的场景。
2. Shared Cluster: 分片集群，是 MongoDB 提供的一种用于横向扩展存储和计算能力的分布式部署模式。通过分片，可以将数据集 分割多个部分，并分布到集群中的不同节点上。每个节点存储数据的一个子集，从而提高了数据的访问效率和系统的可扩展性。
3. Replica Set: 副本集，是 MongoDB 提供的一种高可用性和数据冗余的部署模式。 它由一组 MongoDB 实例组成，这些实例之间通过复制和故障转移来保持数据的一致性和可用性。

## 查看信息

```sh
show dbs; # 查看所有数据库
use admin; # 使用 admin 数据库
db # 当前数据库

use myTest; #使用myTest数据库，如果没有，则创建

db
db.cc.insert({x:1,y:2}); # 表 cc 中，插入数据。如果没有cc,则创建cc
show collections # 查看所有的表

db.ff.insert({name: 'list', age: 12 })
show collections
db.ff.drop(); # 删除 ff 表
show collections
```
