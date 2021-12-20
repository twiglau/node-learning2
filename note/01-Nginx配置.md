# 服务端
## 删除服务端的 apache2
> sudo service apache2 stop
> update-rc.d -f apache2 remove
> sudo apt-get remove apache2
> sudo apt-get update //更新
## 安装nginx
> sudo apt-get install nginx
> nginx -v
> cd /etc/nginx/conf.d //切换到配置目录
> ls //查看里面的配置文件 - 配置文件命名方式:  域名-端口号.conf  
```
free-iblack7-3002.conf
mimi-iblack7-com-3003.conf
movie-iblack7-com-3001.conf
wechat-iblack7-com-3004.conf
```
--------------------------------------------
> 某个配置文件
```
# 负载均衡的策略
upstream ice {
    ip_hash; #通过ip hash 来对流量进行分流
    server xx.xx.xx.xx:3007;
    server 127.0.0.1:3006;
}
```
> sudo service nginx restart //重启nginx
> sudo vi /etc/nginx/nginx.conf
```
server_tokens off; #用来关闭nginx输出到前端请求接口中
```

