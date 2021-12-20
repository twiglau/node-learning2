# Mac 系统
> brew install mongodb
> 查看是否安装成功: cat /var/log/mongodb/mongod.log
> 安装失败 : cd /etc/apt/sources.list.d/  
> 以上更改源地址
> sudo vi /etc/mongod.conf
> 在配置文件中 更改 端口号  绑定的IP
```
# network interfaces
net: 
  port: 19999
  bindIp: 127.0.0.1

# 只能以账号和密码形式登录
security:
  authorization: 'enabled'
```
> 查看防火墙里面的配置
> sudo vi /etc/iptables.up.rules
```
# mongodb connect

```