# RESTful API 是什么？

## REST 全称：Representational state transfer.

- Representational: 数据的表现形式 （JSON, XML...)
- state: 当前状态或者数据
- transfer: 数据传输

它描述了 一个系统如何与另一个交流。 比如一个产品的状态（名字，详情）表现为 XML,JSON 或者普通文本。

## REST 有六个约束：

- 客户-服务器（Client-Server)
  关注点分离。服务端专注数据存储，提升了简单性，前端专注用户界面，提升了可移植性。
- 无状态（Stateless)
  所有用户会话信息都保存在客户端。每次请求必须包括所有信息，不能依赖上下文信息。 服务端不用保存会话信息，提升了简单性，可靠性，可见性。
- 统一接口（Uniform Interface)
  接口设计尽可能统一，通用，提升了简单性，可见性。接口与实现解耦，使前后端可以独立开发迭代。
- 分层系统（Layered System)
- 按需代码（Code On-Demand)

## 设计最佳实践总结：

### 请求设计规范

- URI 使用名词，尽量使用复数，如 /users
- URI 使用 嵌套 表示 关联关系， 如 /users/123/repos/234
- 使用 正确的 HTTP 方法， 如 GET/POST/PUT/DELETE

### 响应设计规范

- 查询
- 分页
- 字段过滤

### 如果记录数据很多，服务器不可能都将它们返回给用户。API 应该提供参数， 过滤返回结果。下面是一些常见的参数

```lua
?limit=10: 指定返回记录的数量
?offset=10: 指定返回记录的开始位置
?page=2&per_page=100: 指定第几页，以及每页的记录数
?sortby=name&order=asc: 指定返回结果按照哪个属性排序，以及排序顺序
?animal_type_id=1: 指定筛选条件
```

- 状态码
- 错误处理
  > 就像 HTML 的出错页面访问者展示了有用的错误消息一样，API 也应该用之前清晰易读的格式来提供有用的错误消息。
  > 比如对于常见的提交表单，当遇到如下错误信息时：
  ```json
  {
    "error": "Invalid payload.",
    "detail": {
      "username": "This field is required."
    }
  }
  ```

## 安全

- HTTPS
- 鉴权
  RESTful API 应该是无状态。 这意味着对请求的认证不应该基于 cookie 或者 session. 相反， 每个请求应该带有一些认证凭证。
- 限流
  为了避免请求泛滥，给 API 设置 速度限制 很重要，为此 RFC 6585 引入了 HTTP 状态码 429 (too many requests). 加入速度设置之后，应该给予用户提示。
