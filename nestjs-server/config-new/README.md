# ORM menus 添加到数据库

- migration

## Linux 或 Mac 端

```json
 "migration:generate": "f() { npm run typeorm migration:generate -p \"./src/migrations/$@\"; }; f",
```

## Windows 端

```json
 "migration:generate": "npm run typeorm -- migration:generate ./src/migrations/%name%",
```

```sh
# 生成数据库执行文件
# src/migrations

## Linux端
pnpm run migration:generate menus

# 执行生成的文件 -> 生成数据库 menus 表
pnpm run migration:run
```
