# Redis

## windows 端使用

1. redis 配置文件： redis.windows.conf, redis.windows.service.confg

   redis 绑定地址以及默认端口配置都可在这两个文件中找到。

2. 启动
   2.1 redis 命令行工具 redis-cli, 可以启动 redis 命令行， 执行 redis 命令;
   2.2 启动服务： redis-server.exe redis.windows.conf
   2.3 环境变量配置: redis 的解压路径 path 路径下添加
   2.4 添加到服务：

   > 在 redis 安装目录下执行：

   ```sh
    redis-server.exe --service-install redis.windows.conf --loglevel verbose
    redis-server.exe --service-install redis.windows.conf --loglevel verbose
   ```

   2.5 添加到服务后操作

   > redis 服务添加后， 以下为常用操作命令（ redis 安装目录下执行）
   > 卸载服务： redis-server.exe --service-uninstall
   > 开启服务： redis-server.exe --service-start
   > 停止服务: redis-server.exe --service-stop

3. 验证与连接 Redis

   3.1 验证

   > 打开 cmd, 进入 redis 安装目录，执行

   ```sh
   redis-cli -v
   # redis-cli 5.0.14.1 (git:ec77f72d)
   # 出现以上信息，说明 环境变量配置好了
   ```

   3.2 连接

   > 在上述 redis 服务启动成功且没有关闭的情况下，启动一个新的 cmd 窗口。
   > 输入：
   > redis-cli

   3.3 测试

   > 设置一个 key 为 key-test, value 为 test-value

   ```sh
   set key_test "this is ce-shi"
   ```

4. 查看信息

   ```sh
   info server
   ```

## Redis 数据类型

1. String: 字符串，其他数据类型的基础类型。
2. Hash: 散列，是由与值相关联的字段组成的内容。字段和值都是字符串。
3. List: 列表，根据插入顺序排序的字符串元素的组合。
4. Set: 未排序的字符串元素组合，集合中数据时不重复的。
5. ZSet: 与 Set 类似，但每个字符串元素都与一个数值的相关联。且按数值大小进行排序。

## 操作指令

1. Redis 数据类型
2. 字符串操作指令

```sh
set s1 lishi
get s1

set s2 2

MSET s3 3 s4 4

keys *

GETSET s1 66

get s1

MGET s1 s2 s3

STRLEN s1

type s1
```

3. 哈希操作指令

```sh
HSET hash h1 1 h2 2 h3 3
HKEYS hash
HLEN hash
HGET hash h2
HMGET hash h2 h3
HGETALL hash
HDEL hash h2

HGETALL hash

DEL hash
```

4. 列表操作指令

```sh
LPUSH l1 11 22 33 44
LRANGE l1 1 3
LRANGE l1 0 3

LINSERT l1 before  22 00
LRANGE l1 0 6
```

5. 集合操作指令

```sh
SADD s1 11 22 33
SMEMBERS s1
SCARD s1

SRANDMEMBER s1
“11”
SRANDMEMBER s1 2
“33”
“11”

SREM s1 11
(integer) 1

SPOP s1

```

6. 有序集合操作指令

```sh
ZADD z1 5 u1 6 u2 66 u3 44 u4 55 u5

ZRANGE z1 3 99
ZRANGE z1 0 99
"u1"
"u2"
"u3"
"u5"
ZREVRANGE z1 0 99

ZRANK z1 u2
1

ZRANK z1 u1
0

ZREVRANK z1 u4
2

ZCARD z1

ZINCRBY z1 1 u2
"7"

ZINCRBY z1 3 u2
"10"

ZREM z1 u2
```

## 配置修改

```sh
CONFIG GET requirepass
CoNFIG SET requirepass root

# 密码登录
redis-cli -h 127.0.0.1 -p 6379 -a myRedis
# 查看密码
config get requirepass
# 修改密码
config set requirepass my_redis
```
