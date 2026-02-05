# 源代码模块

> 层级：第 2 层（模块文档）
> 上层：[根 SKILL.md](../SKILL.md)

## 模块概述

本目录包含项目的所有源代码，按功能模块组织。

## 模块架构

```
src/
├── modules/           # 功能模块
│   ├── auth/         # 认证模块
│   └── user/         # 用户模块
├── core/             # 核心模块
│   ├── database/     # 数据库连接
│   ├── logger/       # 日志服务
│   └── error/        # 错误处理
├── shared/           # 共享代码
│   ├── utils/        # 工具函数
│   └── types/        # 类型定义
└── index.ts          # 入口文件
```

## 目录结构

### modules/ - 功能模块

业务功能模块，每个模块独立负责一个业务领域。

#### auth/ - 认证模块

用户登录、注册、Token 管理等认证相关功能。

- **详见**：[modules/auth/SKILL.md](modules/auth/SKILL.md)

#### user/ - 用户模块

用户信息管理、用户查询等功能。

- **详见**：[modules/user/SKILL.md](modules/user/SKILL.md)

### core/ - 核心模块

框架级别的核心功能，被所有业务模块依赖。

- **database/** - 数据库连接和操作封装
- **logger/** - 统一日志服务
- **error/** - 错误处理和自定义错误类型

### shared/ - 共享代码

跨模块共享的工具和类型定义。

- **utils/** - 通用工具函数
- **types/** - TypeScript 类型定义

## 模块开发规范

### 模块结构标准

每个功能模块应遵循以下结构：

```
module-name/
├── SKILL.md              # 模块文档
├── index.ts              # 模块入口，导出公共 API
├── controllers/          # 控制器层
├── services/             # 服务层
├── models/               # 数据模型
├── types/                # 类型定义
└── __tests__/            # 测试文件
```

### 导入规范

```typescript
// ✅ 正确：使用模块入口导入
import { AuthService, LoginDto } from '@/modules/auth';

// ❌ 错误：直接导入内部文件
import { AuthService } from '@/modules/auth/services/auth.service';
```

### 错误处理

```typescript
// ✅ 正确：使用统一的错误类型
import { ValidationError, NotFoundError } from '@/core/error';

throw new ValidationError('Invalid email format');

// ❌ 错误：使用通用 Error
throw new Error('Invalid email format');
```

## 依赖关系

```
modules/auth ──────┐
                   ├──> core/database
modules/user ──────┤
                   ├──> core/logger
                   └──> core/error
```

## 相关文档

- [架构设计](../docs/design/architecture.md)
- [API 文档](../docs/api/README.md)
