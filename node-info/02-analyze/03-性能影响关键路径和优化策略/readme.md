# 哪些因素能影响 Node.js 的性能

- 在实际开发过程中，应该如何去定位影响性能的关键因素呢？
- 定位到性能问题后，又该如何去优化这部分功能呢？

## 工具介绍

- 压测所使用到的 WRK (Windows Research Kernel)
- 性能分析所使用到的 Chrome 分析工具 JavaScript Profile

1. WRK 的安装及参数

   > 在压测工具上可选择的比较多，比如 Apache-ab 压测工具，Siege 及本地所应用的 WRK.
   > 为了能够更好地利用多核的多线程，并发测试。这里选择使用 WRK 来作为压测工具。

   - Mac 上 `brew install wrk`
   - Linux 上
     > 如果 Linux 上没有安装 GCC, Make 或者 Git, 则需要先安装这几个工具。

   ```sh
   # 下载命令
   git clone https://github.com/wg/wrk.git
   # 切换路径到 wrk 目录下
   cd wrk
   # 使用 make 命令编译环境
   make
   ```

- 参数

```sh
# -t 代表的是启动 4 个 线程
# -c 代表的是并发数，300个并发请求
# -d 代表的是持续时长，20s就是20秒
wrk -t4 -c300 -d20s https://www.baidu.com/
```

## 实践分析

- 在分析任何数据前，首先必须有一个标准的数据进行比较，如果用的是 Express,Eggjs 等框架。需做一个完全空转的数据。
  作为标准分析数据，本讲由于没有用任何框架，所以需要设计一个完全空转的 HTTP 服务来作为标准的分析数据。
