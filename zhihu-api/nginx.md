# Nginx 实现端口转发

## 安装 Nginx

```sh
apt-get install nginx

nginx -t

vim /etc/nginx/nginx.conf

```

## 配置 Nginx, 把外网 80 端口转到内网 3000 端口

```sh
service nginx reload
```

## 使用 Postman 测试外网接口

## 使用 PM2 管理进程

1. 安装 PM2

```sh
npm i pm2 -g
```

2. 使用 PM2 启动，停止，重启，重载程序

```sh
pm2 start app/index.js
pm2 ls
pm2 stop all, app/index.js
pm2 ls
pm2 restart app
pm2 reload app
```

3. 使用 PM2 的日志， 环境变量管理功能
