# docker 使用

## Linux 容器

- 由于虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers,缩写为 LXC).
- Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离，或者说，在正常进程的外面套了一个保护层。对于容器里面的进程来说，
  它接触到的各种资源都是虚拟的，从而实现与底层系统的隔离；
  - 启动快
  - 资源占用少
  - 体积小

## Docker 是什么

- Docker 属于 Linux 容器的一种封装，提供简单易用的容器，使用接口。它是目前最流行的 Linux 容器解决方案。
- Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实
  的物理机上运行一样

## Docker 和 KVM(虚拟机)

- 启动时间

  - Docker 秒级启动
  - KVM 分钟级启动

- 轻量级 容器镜像通常以 M 为单位，虚拟机以 G 为单位，容器资源占用小，要比虚拟机部署更快速

  - 容器共享主机内核，系统级虚拟化，占用资源少，容器性能基本接近物理机
  - 虚拟机需要虚拟化一些设备，具有完整的 OS,虚拟机开销大，因而降低性能，没有容器性能好

- 安全性

  - 由于共享宿主机内核，只是进程隔离，因此隔离性和稳定性不如虚拟机，容器具有一定权限访问宿主机内核，存在一定的安全隐患。

- 使用要求
  - KVM 基于硬件的完全虚拟化，需要硬件 CPU 虚拟技术支持
  - 容器共享宿主机内核，可运行在主机的 Linux 的发行版，不用考虑 CPU 是否支持虚拟化技术

## Docker 体系结构

- containerd 是一个守护进程，使用 runC 管理容器，向 Docker Engine 提供接口
- shim 只负责管理一个容器
- runC 是一个轻量级工具，只用来运行容器

```lua
                   Docker Client
                         |
                   Docker Engine  - >  Image Repository
                         |
                      Containerd
                         |
          |             |            |
         shim          shim         shim
         runC          runC         runC



 |   Client      |         | DOCKER_HOST                     |           | Registry               |
 | docker build  | - - >   | - - - - - - - - - - - -  - - - -|           |  转换                   |
 | docker pull   |         |    Docker daemon                |           |               NGINX     |
 | docker run    |         | - - - - -  - - - - - - - -  - - |
                           | Containers【容器】 Images【镜像】 |  < -
                           |    A                  转换       |
                           |    B                  转换1      |
                           |    C                             |
                           |    D                             |
```

## Docker 内部组件

- namespace: 命名空间，Linux 内核提供的以一种对进程资源隔离的机制，例如进程，网络，挂载等资源
- cgroups: 控制组，linux 内核提供的一种限制进程资源的机制，例如 CPU,内存等资源
- unonFS: 联合文件系统，支持将不同位置的目录，挂载到同一虚拟文件系统，形成一种分层的模型

## 核心概念解析

- Client: Docker 客户端（docker)是许多 Docker 用户与 Docker 交互的主要方式。当使用诸如之类的命令
  时 docker run, 客户端会将这些命令发送到 dockerd, 以执行这些命令。该 docker 命令使用 Docker API.
  Docker 客户端可以与多个守护程序通信。

- 守护程序：Docker 守护程序(dockerd),侦听 Docker API 请求并管理 Docker 对象，例如图像，容器，网络和卷。
  守护程序还可以与其他守护程序通信以管理 Docker 服务。

- Docker 对象

  - 镜像：是创建容器的模版。里面会有一些基础的环境，比如 ubuntu/alpine 等；
  - 容器：是运行的镜像，提供统一且一致的运行环境。默认情况下，容器与其他容器及其主机之间的隔离度相对较高，您
    可以控制容器的网络，存储或其他层子系统与其他容器或与主机的隔离程度。

- 仓库： Docker 仓库存储 Docker 映像。Docker Hub 是任何人都可以使用的公共仓库，并且默认情况下，Docker 已配置为
  在 Docker Hub 上查找映像。您甚至可以运行自己的私人仓库，比如：harbor.

## 底层技术

Docker 用 Go 编程语言编写，并利用 Linux 内核的多种功能来交付其功能。Docker 使用一种称为 namespace 技术，提供称为
容器的隔离工作区。运行容器时，Docker 会为该容器创建一组名称空间。
这些名称空间提供了一层隔离。容器的每个方面都在单独的名称空间中运行，并且对其的访问限制在改名称空间。

## image 镜像

- Docker 把应用程序及其依赖，打包在 image 文件里面，只有通过这个文件，才能生成 Docker 容器
- image 文件可以看作是容器的模版
- Docker 根据 image 文件生成容器的实例
- 同一个 image 文件，可以生成多个同时运行的容器实例
- 镜像不是一个单一的文件，而是有多层
- 容器其实就是在镜像的最上面加了一层读写层，在运行容器里做的任何文件改动，都会写到这个读写层里，如果容器删除了，
  最上面的读写也就删除，改动也就丢失了。
- 我们可以通过 docker history <ID/NAME>,查看镜像中各层内容及大小，每层对应着 Dockerfile 中的一条指令

```sh
> docker images #列出镜像
> docker image pull centos:6 # 拉取,版本6的centos
> docker image pull ubuntu # 拉取，ubuntu
> docker image rmi hello-world
> docker image tag centos twiglau/centos
> docker login # 登录
> docker push twiglau/centos6
```

## 容器

- `docker run` 命令会从 `image` 文件，生成一个正在运行的容器实例。
- `docker container run` 命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取。
- 输出提示以后，hello world 就会停止运行，容器自动终止。
- 有些容器不会自动终止。
- image 文件生成的容器实例，本身也是一个文件，称为容器文件。
- 容器生成，就会同时存在两个文件：image 文件和容器文件。
- 关闭容器并不会删除容器文件，只是容器停止运行。

```sh
 docker container ps -a
```

```lua
命令                含义                              案例
run                 从镜像运行一个容器                 docker run ubuntu /bin/echo "hello-world"
ls                  列出容器                          docker container ls
inspect             显示一个或多个容器详细信息          docker inspect
attach              要attach上去的容器必须正在         docker attach
                    运行，可以同时连接上通一个container
                    来共享屏幕
stats               显示容器资源使用统计
```

### 启动容器

Docker 以 ubuntu 镜像创建一个新容器，然后在容器里执行 `bin/echo "Hello world"`,然后输出结果

```sh
docker run ubuntu /bin/echo "Hello world"
```

- docker: Docker 的二进制执行文件。
- run: 与前面的 docker 组合来运行一个容器。
- ubuntu 指定要运行的镜像，Docker 首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库
  Docker Hub 下载公共镜像。
- /bin/echo "Hello world" ： 在启动的容器里执行的命令

```lua
参数                    含义
"-i --interactive"     交互式
"-t --tty"             分配一个伪终端
"-d --detach"          运行容器到后台
"-a --attach list"     附加到运行的容器
"-e --env list"        设置环境变量
"-p --publish list"    发布容器端口到主机
"-P"                   "--publish-all"
"--mount mount"        挂载宿主机分区到容器
"-v --volumn list"     挂载宿主分区到容器
```

## 运行步骤

`docker run` 命令
以下命令运行一个 ubuntu 容器，以交互方式附加到本地命令行会话，然后运行 `/bin/bash`

```sh
> docker run -i -t ubuntu /bin/bash
```

当运行此命令时：

1. 如果在 ubuntu 本地没有该映像，则 Docker 会将其从 Hub 仓库(默认)中下载，如果已经下载(docker pull ubuntu)，则会跳过；
2. Docker 会创建一个新容器；
3. Docker 将一个读写文件系统分配给容器，作为其最后一层。这允许运行中的容器在其本地文件系统中创建或修改文件和目录；
4. Docker 创建了一个网络接口，默认没有指定任何网络选项时，将容器连接到默认网络，包括为容器分配新网段的 IP 地址。默认
   情况下，容器可以使用主机的网络连接到外部网络；
5. Docker 启动容器并执行 `/bin/bash`. 由于容器时交互式运行的，并且已附加的终端(由于 -i 和 -t 标志),可以在输出记录到
   终端时使用键盘提供输入；
6. 当键入 exit 以终止 `/bin/bash` 命令时，容器将停止但不会被删除，可以重新启动(docker start) 或删除它(docker rm)

## Docker-compose

是一款旨在帮助定义和共享多容器应用程序的工具，使用 Compose,可以通过创建一个 YAML 文件来定义容器服务，并且可以类似于 Docker 的命令将所有内容进行管理(比如， 启动，停止，重新部署等)
