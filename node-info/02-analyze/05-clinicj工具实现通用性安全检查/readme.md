# 使用 clinicjs 工具实现，通用性安全检查

是一个 Node.js 的第三方工具，其核心的目的是帮助诊断和查明 Node.js 性能问题的工具。

```sh
npm install -g clinic
clinic --help
```

- CPU 异常问题
- 事件循环延迟问题
- 内存泄漏问题
- 句柄泄漏问题

```sh
# 对服务的 local-cache/no 进行性能全局分析
clinic doctor --on-port "wrk http://127.0.0.1:3000/local-cache/no" --node app.js
```

- 当全局分析出现事件延迟或者高 CPU 占用时，就需要使用该工具进行具体深入分析
