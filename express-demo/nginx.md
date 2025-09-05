# [Linux 上安装 Nginx](https://blog.csdn.net/qq_39420519/article/details/126322909)

## 安装 GCC

```sh
./configure --prefix=/usr/local/webserver/nginx --with-http_stub_status_module --with-http_ssl_module

# --prefix=/usr/local/webserver/nginx 安装到指定目录
# --with-http_stub_status_module --with-http_ssl_module 是安装 ssl 证书的两个模块。
```

## 设置软链

```sh
ln -s /usr/local/webserver/nginx/sbin/nginx /usr/bin/
# 设置软链后，可以尝试在其他目录使用以下命令看是否成功
nginx -v
```

## 检查配置，启动，测试

```sh
# 检查配置
nginx -t #（检查nginx.conf配置是否正确）
nginx -s reload #（重新载入配置文件，通常配合-t使用，在修改了nginx.conf且检查无误之后）


# 其他的一些常用命令
nginx -s stop #（停止 Nginx）
nginx -s reopen #（重启 Nginx）
systemctl status nginx.service #（查看nginx服务状态，通常配合-t使用）

```

## 启动 nginx 出现 Failed to start nginx.service:unit not found

https://blog.csdn.net/a18827547638/article/details/101362702

## 错误:Failed to start SYSV: Nginx is an HTTP(S) server, HTTP(S) reverse

这里其实没什么什么问题,只是很多时候我们都先用/usr/local/nginx/sbin/nginx 来启动了 nginx

只要找到这个进程 kill 掉以后,再执行/etc/rc.d/init.d/nginx start 就一切正常了

```sh
killall -9 nginx
/etc/rc.d/init.d/nginx start
然后就可已用service nginx restart|start|stop.....来启动nginx服务了!!!
```

## 查看端口状态

```sh
sudo netstat -tupln | grep 80  # 查看端口状态
nginx -s stop # 停止
nginx -s quit # 退出
```

## Nginx 配置选项

```conf
Main # 全局配置区， Nginx 核心功能配置

events {
  # events 事件区， 子进程核心配置
}

http {
  # http 服务器配置区
  server {
    # 不同服务配置区
    location {
      # location 不同请求路径配置区

      # 具体配置选项
    }
  }
}

mail {
  # 邮件代理配置区
  server {
    # 邮件服务配置区

    # 具体配置选项
  }
}
```
