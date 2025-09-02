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
