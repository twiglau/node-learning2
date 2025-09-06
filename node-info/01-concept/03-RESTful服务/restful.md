# RESTful 服务

## 涉及的一些技术知识点

- 什么是 RESTful 规范
- 数据库的读写处理过程
- 目前常用的 MVC 架构模式及后续应用的 MSVC 架构模式
  > Model, Service, View, Controller
  ```lua
   其他服务API     数据库      缓存
      |            V       /
      |->          M   <-      S
                               ^
                             复用模块
        V           ->         C
  ```

## 通过 MVC 和 MSVC 两种模式 分别实践

要实现的是一个获取用户发帖列表信息 API, 该 API 列表内容包含
两个部分： 一部分是从数据库获取的发帖内容，但这部分只包含用
户 ID, 另外一部分则是需要通过 ID 批量拉取用户信息
