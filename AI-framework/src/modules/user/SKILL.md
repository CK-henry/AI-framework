---
name: user
title: 用户模块
tags: [用户, 信息, 查询, 更新, 删除, 邮箱, 用户管理, 个人资料]
---

# User 用户模块

> 层级：第 3 层（子模块文档）
> 上层：[src/SKILL.md](../SKILL.md)

<!-- @index
| key | tags | desc |
|-----|------|------|
| overview | 概述,架构 | 模块概述 |
| api:getById | 查询,ID,获取 | 根据ID获取用户 |
| api:getByEmail | 查询,邮箱,获取 | 根据邮箱获取用户 |
| api:update | 更新,修改,编辑 | 更新用户信息 |
| api:delete | 删除,移除 | 删除用户 |
| deps | 依赖,引用 | 依赖关系 |
-->

<!-- @key:overview -->
## 模块概述

- **职责**：用户信息的增删改查
- **位置**：src/modules/user/
- **依赖**：core/database, core/logger, core/error

## 模块架构

```
user/
├── SKILL.md              # 本文档
├── index.ts              # 模块入口
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.service.ts
├── models/
│   └── user.model.ts
├── types/
│   ├── user.dto.ts
│   └── update-user.dto.ts
└── __tests__/
    └── user.service.test.ts
```
<!-- @/key:overview -->

## API 文档

### UserService

<!-- @key:api:getById -->
#### getById(id: string): Promise<User>

**功能说明**：根据 ID 获取用户信息

**参数**：
- `id` (string): 用户 ID

**返回值**：
- (Promise<User>): 用户对象

**抛出异常**：
- `NotFoundError`: 当用户不存在时

**使用示例**：

```typescript
import { UserService } from '@/modules/user';

const userService = new UserService();
const user = await userService.getById('user-id-123');
```
<!-- @/key:api:getById -->

---

<!-- @key:api:getByEmail -->
#### getByEmail(email: string): Promise<User | null>

**功能说明**：根据邮箱获取用户信息

**参数**：
- `email` (string): 用户邮箱

**返回值**：
- (Promise<User | null>): 用户对象，不存在时返回 null

**使用示例**：

```typescript
import { UserService } from '@/modules/user';

const userService = new UserService();
const user = await userService.getByEmail('user@example.com');

if (user) {
  console.log(user.name);
}
```
<!-- @/key:api:getByEmail -->

---

<!-- @key:api:update -->
#### update(id: string, dto: UpdateUserDto): Promise<User>

**功能说明**：更新用户信息

**参数**：
- `id` (string): 用户 ID
- `dto` (UpdateUserDto): 更新数据
  - `name` (string, 可选): 用户名称
  - `avatar` (string, 可选): 头像 URL

**返回值**：
- (Promise<User>): 更新后的用户对象

**抛出异常**：
- `NotFoundError`: 当用户不存在时
- `ValidationError`: 当参数验证失败时

**使用示例**：

```typescript
import { UserService } from '@/modules/user';

const userService = new UserService();
const user = await userService.update('user-id-123', {
  name: 'New Name',
});
```
<!-- @/key:api:update -->

---

<!-- @key:api:delete -->
#### delete(id: string): Promise<void>

**功能说明**：删除用户（软删除）

**参数**：
- `id` (string): 用户 ID

**返回值**：
- (Promise<void>)

**抛出异常**：
- `NotFoundError`: 当用户不存在时
<!-- @/key:api:delete -->

<!-- @key:deps -->
## 依赖关系

### 内部依赖

- `@/core/database`: 数据库操作
- `@/core/logger`: 日志记录
- `@/core/error`: 错误处理

## 相关文档

- [用户模块设计](../../../docs/design/user-design.md)
- [API 文档](../../../docs/api/user-api.md)
<!-- @/key:deps -->
