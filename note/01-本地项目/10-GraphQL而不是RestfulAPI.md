# RESTful API
> API http://xxoo.com/gardens
>> 需求  
>> - 花圃总数  
>> - 花圃列表  
>>> - 花圃序号  
>>> - 花圃名字  
>>> - 花圃园丁  
```
{
    total: 10,
    success: true,
    data: [
        {
            id: 1,
            name: 'ox-1',
            gardener: '七哥'
        }
    ]
}
```

------------------------


> 增加需求1 根据 RESTful API规范 增加 API `http://xxoo.com/garden/1`  
>> - 花圃序号  
>> - 花圃名字  
>> - 花圃园丁  
```
{
    success: true,
    data: {
        id: 1,
        name: 'ox-1',
        gardener: '七哥'
    }
}
```

-------------------------
> 增加需求2  `http://xxoo.com/gardeners`  
>> - 园丁总数
>> - 园丁列表
>>> - 园丁序号
>>> - 园丁名字
>>> - 园丁电话
```
{
    success: true,
    data: [
        {
            id: 1,
            name: '七哥',
            phone: '15xxx'
        }
    ]
}
```
---------------------------
> 增加需求3 -需要同时查看 园丁, 苗圃, 只能同时调用 两个接口


# GraphQL 
> facebook 开源一种API查询语言
> 通过查询规则,而不是查询地址
> 查询对象为数据源