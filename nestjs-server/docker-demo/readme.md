# docker 命令

## docker-compose up

- 该命令十分强大，它将尝试自动完成包括 构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。
- 链接的服务都将会被自动启动，除非已经处于运行状态。
- `-d` 将会在【后台启动并运行】所有的容器。一般推荐生产环境下使用该选项。

1. 默认情况，如果服务容器已经存在， `docker-compose up` 将会尝试停止容器，然后重新创建（保持使用 volumes-from 挂载的卷），以保证新启动的服务匹配 docker-compose.yml 文件的最新内容。

```sh
> docker-compose up -d
> docker ps
```

```sh
# 停止服务 service
> docker-compose stop db
> docker-compose stop adminer

# 删除服务 service
> docker-compose rm db
> docker-compose rm adminer
```

## 错误 [php_network_getaddresses: getaddrinfo failed: Try again]

- 解决：配置 DNS
  "dns": [
  "8.8.8.8",
  "114.114.114.114"
  ]
