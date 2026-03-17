---
name: auth
title: 认证模块
tags: [登录, 认证, Token, JWT, 用户验证, 密码, 注册, 登出, 身份验证, Session]
---

# Auth 认证模块

> 层级：第 3 层（子模块文档）
> 上层：[src/SKILL.md](../SKILL.md)

<!-- @index
| key | tags | desc |
|-----|------|------|
| api:login | 登录,Token,认证 | 用户登录接口 |
| api:register | 注册,用户,创建 | 用户注册接口 |
| api:refreshToken | Token,刷新,续期 | Token刷新接口 |
| api:logout | 登出,退出,Session | 用户登出接口 |
-->

<!-- NAV_START
## 文档导航 (总 270 行)

| 章节 | 行号 | 说明 |
|------|------|------|
| 模块概述 | 20-55 | 职责、架构、设计模式 |
| API:login | 60-97 | 登录接口 |
| API:register | 99-138 | 注册接口 |
| API:refreshToken | 140-163 | Token刷新接口 |
| API:logout | 165-185 | 登出接口 |
| 开发规范 | 187-228 | 错误处理、日志、验证 |
| 测试要求 | 230-240 | 测试覆盖率要求 |
| 依赖关系 | 242-255 | 内外部依赖 |
| 常见问题 | 260-270 | FAQ |

NAV_END -->

## 模块概述

- **职责**：处理用户认证相关的所有功能
- **位置**：src/modules/auth/
- **依赖**：core/database, core/logger, core/error

## 模块架构

```
auth/
├── SKILL.md              # 本文档
├── index.ts              # 模块入口
├── controllers/
│   └── auth.controller.ts
├── services/
│   └── auth.service.ts
├── models/
│   └── token.model.ts
├── types/
│   ├── login.dto.ts
│   └── register.dto.ts
└── __tests__/
    └── auth.service.test.ts
```

### 设计模式

- **Service 模式**：业务逻辑封装在 AuthService 中
- **DTO 模式**：使用 Data Transfer Object 进行数据验证

### 关键概念

- **JWT Token**：使用 JSON Web Token 进行身份验证
- **Refresh Token**：支持 Token 刷新机制
- **Password Hash**：使用 bcrypt 进行密码加密

## API 文档

### AuthService

<!-- API:login START -->
#### login(dto: LoginDto): Promise<TokenPair>

**功能说明**：用户登录，验证凭据并返回 Token

**参数**：
- `dto` (LoginDto): 登录数据传输对象
  - `email` (string): 用户邮箱
  - `password` (string): 用户密码

**返回值**：
- (Promise<TokenPair>): Token 对象
  - `accessToken` (string): 访问令牌
  - `refreshToken` (string): 刷新令牌

**抛出异常**：
- `ValidationError`: 当参数验证失败时
- `UnauthorizedError`: 当凭据无效时

**使用示例**：

```typescript
import { AuthService } from '@/modules/auth';

const authService = new AuthService();

const tokens = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

console.log(tokens.accessToken);
```

**注意事项**：
- 密码错误超过 5 次会锁定账户 15 分钟
- accessToken 有效期为 15 分钟
- refreshToken 有效期为 7 天
<!-- API:login END -->

---

<!-- API:register START -->
#### register(dto: RegisterDto): Promise<User>

**功能说明**：用户注册，创建新用户账户

**参数**：
- `dto` (RegisterDto): 注册数据传输对象
  - `email` (string): 用户邮箱
  - `password` (string): 用户密码（至少 8 位）
  - `name` (string): 用户名称

**返回值**：
- (Promise<User>): 创建的用户对象

**抛出异常**：
- `ValidationError`: 当参数验证失败时
- `ConflictError`: 当邮箱已被注册时

**使用示例**：

```typescript
import { AuthService } from '@/modules/auth';

const authService = new AuthService();

const user = await authService.register({
  email: 'newuser@example.com',
  password: 'securePassword123',
  name: 'New User',
});

console.log(user.id);
```

**注意事项**：
- 邮箱必须唯一
- 密码会自动进行 bcrypt 加密
- 注册成功后会发送验证邮件
<!-- API:register END -->

---

<!-- API:refreshToken START -->
#### refreshToken(token: string): Promise<TokenPair>

**功能说明**：使用 Refresh Token 获取新的 Token 对

**参数**：
- `token` (string): 有效的 Refresh Token

**返回值**：
- (Promise<TokenPair>): 新的 Token 对

**抛出异常**：
- `UnauthorizedError`: 当 Token 无效或已过期时

**使用示例**：

```typescript
import { AuthService } from '@/modules/auth';

const authService = new AuthService();

const newTokens = await authService.refreshToken(oldRefreshToken);
```
<!-- API:refreshToken END -->

---

<!-- API:logout START -->
#### logout(userId: string): Promise<void>

**功能说明**：用户登出，使当前 Token 失效

**参数**：
- `userId` (string): 用户 ID

**返回值**：
- (Promise<void>)

**使用示例**：

```typescript
import { AuthService } from '@/modules/auth';

const authService = new AuthService();

await authService.logout('user-id-123');
```
<!-- API:logout END -->

## 模块开发规范

### 错误处理

```typescript
// ✅ 正确：使用统一的 ErrorHandler
import { ErrorHandler } from '@/core/error';
import { Logger } from '@/core/logger';

try {
  const user = await this.validateCredentials(email, password);
} catch (error) {
  Logger.error('Login failed', { email, error: error.message });
  ErrorHandler.handle(error, { context: 'AuthService.login' });
  throw error;
}
```

### 日志记录

```typescript
// ✅ 正确：使用统一的 Logger
import { Logger } from '@/core/logger';

Logger.info('User logged in', { userId: user.id });
Logger.warn('Login attempt failed', { email, reason: 'invalid password' });
Logger.error('Authentication error', { error, context });
```

### 数据验证

```typescript
// ✅ 正确：使用 Zod 进行验证
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
```

## 测试要求

- 单元测试覆盖率：> 80%
- 测试文件位置：`__tests__/`
- 必须测试的场景：
  - 正常登录流程
  - 密码错误处理
  - Token 刷新
  - 账户锁定机制

## 依赖关系

### 外部依赖

- `jsonwebtoken`: JWT 生成和验证
- `bcrypt`: 密码加密
- `zod`: 数据验证

### 内部依赖

- `@/core/database`: 数据库操作
- `@/core/logger`: 日志记录
- `@/core/error`: 错误处理
- `@/modules/user`: 用户信息查询

## 相关文档

- [认证设计文档](../../../docs/design/auth-design.md)
- [API 文档](../../../docs/api/auth-api.md)

## 常见问题

1. **Token 过期后如何处理？**
   使用 refreshToken 方法获取新的 Token 对。

2. **如何实现"记住我"功能？**
   延长 refreshToken 的有效期至 30 天。

3. **密码重置流程是什么？**
   调用 forgotPassword 发送重置邮件，用户点击链接后调用 resetPassword。
