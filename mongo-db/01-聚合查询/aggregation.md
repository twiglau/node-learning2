# 什么是 MongoDB 聚合框架

- MongoDB 聚合框架（Aggregation Framework) 是一个计算框架，它可以：

1. 作用在一个或几个集合上；
2. 对集合中的数据进行的一系列运算；
3. 将这些数据转化为期望的形式；

- 从效果而言，聚合框架相当于 SQL 查询中的：

1. GROUP BY
2. LEFT OUTER JOIN
3. AS 等

## 管道（Pipeline) 和步骤（Stage)

- 整个聚合运算过程称为管道(Pipeline), 它是由多个步骤(Stage)组成的，每个管道：

1. 接受一系列文档（原始数据）；
2. 每个步骤对这些文档进行一系列运算；
3. 结果文档输出给下一个步骤；

```lua
步骤               作用                   SQL等价运算符
$match             过滤                      WHERE
$project           投影                       AS
$sort              排序                      ORDER BY
$group             分组                      GROUP BY
$skip/$limit       结果限制                  SKIP/LIMIT
$lookup            左外连接                  LEFT OUTER JOIN
$unwind            展开数组                  N/A
$graphLookup       图搜索                    N/A
$facet/$bucket     分面搜索                  N/A
```

## 聚合运算的使用场景

- 聚合查询可以用于 OLAP 和 OLTP 场景。例如：

1.  OLTP: 计算
2.  OLAP:
    > 分析一段时间内的销售总额，均值
    > 计算一段时间内的净利润
    > 分析购买人的年龄分布
    > 统计员工绩效

## MQL 与 SQL 对比

```sql
SELECT DEPARTMENT,
  COUNT(NULL) AS EMP_QTY
FROM Users
WHERE GENDER = '女'
GROUP BY DEPARTMENT HAVING
COUNT(*) < 10
```

```js
db.users.aggregate([
  { $match: { gender: "女" } },
  {
    $group: {
      _id: "$DEPARTMENT",
      emp_qty: { $sum: 1 },
    },
  },
  { $match: { emp_qty: { $lt: 10 } } },
]);
```

## MQL 特有步骤 $unwind

```js
db.students.findOne()
{
  name: '张三',
  score: [
    {subject: '语文', score: 84},
    {subject: '数学', score: 90},
    {subject: '外语', score: 69},
  ]
}
```

```js
db.students.aggregate([{ $unwind: "$score" }]);

{name: '张三', score:{subject:'语文',score:84}}
{name: '张三', score:{subject:'数学',score:90}}
{name: '张三', score:{subject:'外语',score:69}}
```

## MQL 特有步骤 $bucket

```lua
         [0,10] -> 120条
         [10,20] -> 20条
price    [20,30] -> 30条
         [30,40] -> 500条
         [40,+~] => 10条
```

```js
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 10, 20, 30, 40],
      default: "Other",
      output: { count: { $sum: 1 } },
    },
  },
]);
```

## 聚合实验一： 总销量

- 计算到目前为止的所有订单的总销售额

```js
db.orders.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$total" },
    },
  },
]);
```

## 表字段

- id
- street
- city
- state
- country
- zip
- phone
- orderDate
- status: created/shipping/cancelled/completed/fulfilled
- shippingFee
- userId
- orderLines: Array [product: 产品名称， sku， qty: 数量， price: 价格, cost: 成本花费]
- total: 总金额
- name： 名称
