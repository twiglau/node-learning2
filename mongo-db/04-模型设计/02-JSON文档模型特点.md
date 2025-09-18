# 模型特点

## MongoDB 文档模型设计的三个误区

1. 不需要模型设计
2. MongoDB 应该用一个超级大文档来组织所有数据
3. MongoDB 不支持关联或者事务

## JSON 文档模型设计

- 文档模型设计处于是 物理模型设计阶段 (PDM)
- JSON 文档模型通过内嵌数组，或引用字段来表示关系
- 文档模型设计不遵从第三范式， 允许冗余。

## 为什么都说 MongoDB 是无模式？

严格来说，MongoDB 同样需要概念、逻辑建模

- 文档模型设计的物理层结构可以和逻辑层类似
- MongoDB 无模式由来：
  > 可以省略物理建模的具体过程。

```lua
# 逻辑模型
              Contact
    name
    gender
    Phones[]
    groups[]
    Addresses[]
    - - - - - - - -
    getName()
    getPhones()
    getAddresses()
    getGender()
    getGroups()
```

```json
{
  "name": "TJ Tang",
  "gender": "M",
  "created": "2019-01-01",
  "groups": ["Friends", "Kitesurfers", "Classmate"],
  "addresses": [
    {
      "type": "home",
      "province": "关东",
      "city": "深圳"
    },
    {
      "type": "work",
      "province": "广东",
      "city": "深圳"
    }
  ]
}
```

## 文档模型的设计原则： 性能（Performance）和易用（Ease of Development）
