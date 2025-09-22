# 基本信息

## 工程目录

```lua
- src
  - core
    - middleware
    - interceptors
    - guards
  - user
      - interceptors (scoped interceptors)
    - user.controller.ts
    - user.model.ts
  - store
    - store.controller.ts
    - store.model.ts
```

- 可以使用 monorepo 的方法 -- 在一个repo中创建两个项目，并在它们之间共享共同的东西，如 库、包。
- 没有模块目录，按照功能进行拆分。
- 把通用/核心的东西归为单独的目录：common, 比如：拦截器/守卫/管道；

## 命令

```sh
nextjs-demo> nest g module user # 添加 user 模块
nextjs-demo> nest g controller user --no-spec
nextjs-demo> nest g service user --no-spec
```

## 提高开发效能

1. (webpack 热更新)[https://docs.nestjs.com/recipes/hot-reload]

```sh
npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
pnpm i -D @types/webpack-env
```

- eslint.config.mjs 修改

```js
{
  ignores: ['eslint.config.mjs', 'webpack-hmr.config.js'];
}
```

## 开发编程思想？

### 什么是 OOP? FP? FRP 编程？

- 这些概念其实是 不同的编程范式，范式 - 即写代码的方式&风格。

*

FP - Functional Programming 函数式编程；
OOP - Object Oriented Programming 面向对象式编程；
AOP - Aspect Oriented Programming 面向切面编程;

1. 扩展功能方便，不影响业务之间的逻辑
2. 逻辑集中管理
3. 更有利于代码复用

- AOP 能在不破坏封装功能的前提下，额外增加功能。

## IoC 与 DI 的那点事

IoC是一种思想&设计模式，DI是IoC的具体实现

1. Inversion Of Control 控制反转

- 控制反转(Inversion Of Control) 是一种面向对象编程中的一种设计原则，用来减低计算机代码之间的耦合度。 其基本思想是： 借助于 “第三方” 实现具有依赖关系的对象之间的解耦；

2. Dependency Injection 依赖注入

- 依赖注入(Dependency Injection) 是一种用于实现IoC的设计模式，它允许在类外创建
  依赖对象，并通过不同的方式将这些对象提供给类；

3. 第三方库 `reflect-metadata`
