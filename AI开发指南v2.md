# AI 开发指南 v2.0

> 版本：2.0.0
> 更新日期：2026-01-29
> 适用对象：AI 辅助开发工具（如 Claude Code, GitHub Copilot, Cursor 等）

---

## 概述

本指南专门为 AI 辅助开发工具编写，结合**语义索引系统**，实现高效精准的代码定位和开发。

### v2.0 核心改进

| 特性 | v1.0 | v2.0 |
|------|------|------|
| 文档查找 | 层级遍历 | **语义索引 + 标签匹配** |
| 定位方式 | 手动查找 | **自动索引 + 精准定位** |
| 维护成本 | 手动维护行号 | **自动提取，零维护** |
| Token 消耗 | 约 9,500 字符 | **约 2,000 字符（节省 80%）** |
| 语言支持 | 特定语言 | **语言无关** |

### 两种工作模式

```
┌─────────────────────────────────────────────────────┐
│  用户问题                                            │
└─────────────────────────────────────────────────────┘
                         ↓
              ┌─────────────────────┐
              │  判断问题类型        │
              └─────────────────────┘
                    ↓           ↓
         ┌─────────────┐  ┌─────────────────┐
         │ 查询类问题   │  │ 新增/修改类问题  │
         └────────────��┘  └─────────────────┘
              ↓                    ↓
    ┌──────────────────┐  ┌──────────────────────────┐
    │ 语义索引快速定位  │  │ 读取完整 SKILL.md 上下文 │
    │ 2步，~2000字符   │  │ 了解规范后再开发          │
    └──────────────────┘  └──────────────────────────┘
```

---

## 核心原则

### 1. 先索引，后查找

```
❌ 错误做法：直接 Glob/Grep 全局搜索
✅ 正确做法：
   1. 读取 SKILL.index.json 语义索引
   2. 通过 tags 匹配定位目标模块/section
   3. 直接读取目标内容
```

### 2. 区分查询与开发

```
查询场景（如"怎么刷新Token？"）：
   → 使用语义索引快速定位 API 文档
   → 2 步完成，消耗最小

开发场景（如"帮我新增重置密码功能"）：
   → 先读取模块 SKILL.md 了解完整上下文
   → 理解规范、架构、依赖后再开发
```

### 3. 文档同步更新

```
❌ 错误做法：只修改代码，不更新文档
✅ 正确做法：
   1. 修改代码后立即更新 SKILL.md
   2. 运行 build-index-auto.js 重新生成索引
   3. 确保示例代码可运行
```

---

## 语义索引查询流程

### 查询类问题（推荐）

**适用场景**：查找 API 用法、了解某个功能的实现

**流程**：

```
用户问：怎么刷新 Token？

Step 1: 读取 SKILL.index.json
        → tagIndex["refreshtoken"] → auth#sub:refreshtoken
        → 得到 file: auth/SKILL.md, section: sub:refreshtoken

Step 2: 读取目标内容
        → Read auth/SKILL.md (163-189行)
        → 直接获取 refreshToken API 文档

✅ 完成（2 步，~2,000 字符，节省 80%）
```

**代码示例**：

```javascript
// Step 1: 读取索引
const index = JSON.parse(fs.readFileSync('SKILL.index.json'));

// Step 2: 通过 tags 匹配
const matches = index.tagIndex['refreshtoken'];
// → ["auth#sub:refreshtoken"]

// Step 3: 解析结果
const [module, section] = matches[0].split('#');
const moduleInfo = index.modules[module];
const sectionInfo = moduleInfo.sections[section];

// Step 4: 读取目标内容
// Read: moduleInfo.file, offset: sectionInfo.start, limit: sectionInfo.end - sectionInfo.start
```

### 开发类问题

**适用场景**：新增功能、修改功能、重构代码

**流程**：

```
用户说：帮我新增一个重置密码功能

Step 1: 读取索引，定位相关模块
        → tagIndex["密码"] → auth
        → 确定在 auth 模块开发

Step 2: 读取完整 SKILL.md
        → Read auth/SKILL.md（完整文件）
        → 了解：模块架构、设计模式、开发规范、依赖关系

Step 3: 参考现有 API
        → 查看 login、register 的实现模式
        → 保持代码风格一致

Step 4: 开发新功能
        → 按照规范编写代码
        → 更新 SKILL.md 的 API 部分

Step 5: 更新索引
        → 运行 node build-index-auto.js
```

---

## 索引系统使用指南

### 索引文件结构

```json
{
  "version": "3.0.0",
  "mode": "auto-extract",
  "modules": {
    "auth": {
      "file": "src/modules/auth/SKILL.md",
      "title": "认证模块",
      "tags": ["登录", "认证", "Token", "JWT"],
      "sections": {
        "sub:login": {
          "level": 4,
          "title": "login(dto: LoginDto): Promise<TokenPair>",
          "start": 79,
          "end": 120,
          "tags": ["login", "dto", "promise"]
        }
      }
    }
  },
  "tagIndex": {
    "登录": ["auth"],
    "login": ["auth#sub:login"],
    "Token": ["auth", "auth#sub:refreshtoken"]
  }
}
```

### 查询算法

```javascript
function queryByTags(index, queryTags) {
  const results = [];

  for (const [moduleName, module] of Object.entries(index.modules)) {
    let score = 0;

    // 模块级 tags 匹配: +10 分/tag
    for (const tag of module.tags) {
      if (queryTags.some(q => tag.toLowerCase().includes(q.toLowerCase()))) {
        score += 10;
      }
    }

    // Section 级 tags 匹配: +5 分/tag
    const matchedSections = [];
    for (const [sectionKey, section] of Object.entries(module.sections)) {
      for (const tag of section.tags || []) {
        if (queryTags.some(q => tag.toLowerCase().includes(q.toLowerCase()))) {
          score += 5;
          matchedSections.push({ key: sectionKey, ...section });
        }
      }
    }

    if (score > 0) {
      results.push({ module: moduleName, score, matchedSections });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
```

### 生成索引

```bash
# 自动扫描所有 SKILL.md，生成语义索引
node build-index-auto.js [项目目录]

# 输出示例：
# 📦 模块: auth (认证模块)
#    自动提取 21 个 sections
#    ├─ sub:login: "login(dto: LoginDto)" (79-120行)
#    │  └─ auto-tags: login, dto, promise
# ✅ 索引已生成: SKILL.index.json
```

---

## SKILL.md 编写规范

### 最小要求（v3.0 极简版）

只需要 **YAML 头部**，工具自动从标题提取 sections：

```markdown
---
name: user
tags: [用户, CRUD, 查询, 更新]
---

# User 用户模块

## 模块概述
...

## API 文档

### getById
根据ID获取用户...

### update
更新用户信息...
```

工具自动：
- 从 `##` `###` `####` 提取 sections
- 从标题文字提取 tags（中文词 + 英文词）
- 生成完整索引

### 完整格式（推荐）

```markdown
---
name: auth
title: 认证模块
tags: [登录, 认证, Token, JWT, 用户验证]
---

# Auth 认证模块

> 层级：第 3 层（子模块文档）
> 上层：[src/SKILL.md](../SKILL.md)

## 模块概述

- **职责**：处理用户认证相关的所有功能
- **位置**：src/modules/auth/
- **依赖**：core/database, core/logger

## 模块架构

```
auth/
├── SKILL.md
├── controllers/
├── services/
└── types/
```

## API 文档

### AuthService

#### login(dto: LoginDto): Promise<TokenPair>

**功能说明**：用户登录，验证凭据并返回 Token

**参数**：
- `dto` (LoginDto): 登录数据
  - `email` (string): 用户邮箱
  - `password` (string): 用户密码

**返回值**：
- (Promise<TokenPair>): Token 对象

**使用示例**：

```typescript
const tokens = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});
```

## 模块开发规范

### 错误处理

```typescript
// ✅ 正确：使用统一的 ErrorHandler
import { ErrorHandler } from '@/core/error';

try {
  const user = await this.validateCredentials(email, password);
} catch (error) {
  ErrorHandler.handle(error, { context: 'AuthService.login' });
  throw error;
}
```

### 日志记录

```typescript
// ✅ 正确：使用统一的 Logger
import { Logger } from '@/core/logger';

Logger.info('User logged in', { userId: user.id });
```

## 依赖关系

### 外部依赖
- `jsonwebtoken`: JWT 生成和验证
- `bcrypt`: 密码加密

### 内部依赖
- `@/core/database`: 数据库操作
- `@/modules/user`: 用户信息查询
```

---

## 开发工作流

### 查询 API 用法

```
1. 读取 SKILL.index.json
2. 通过 tags 匹配找到目标
3. 读取目标 section 内容
4. 返回结果给用户
```

### 新增功能

```
1. 读取索引，定位相关模块
2. 读取模块 SKILL.md（完整）
3. 理解架构、规范、依赖
4. 参考现有 API 的实现模式
5. 编写新功能代码
6. 更新 SKILL.md 的 API 部分
7. 运行 build-index-auto.js 更新索引
8. 编写测试
```

### 修改功能

```
1. 读取索引，定位目标 API
2. 读取相关 section 了解现有实现
3. 读取模块 SKILL.md 了解规范
4. 修改代码
5. 更新 SKILL.md
6. 更新索引
7. 更新测试
```

### Bug 修复

```
1. 读取索引，定位相关代码
2. 理解 Bug 原因
3. 修复 Bug
4. 如果修改了 API 行为，更新 SKILL.md
5. 添加测试防止回归
```

---

## 代码规范

### 命名规范

```javascript
// ✅ 正确的命名
const userName = 'John';              // 变量：camelCase
function getUserById(id) {}           // 函数：camelCase
class UserService {}                  // 类：PascalCase
const MAX_RETRY_COUNT = 3;           // 常量：UPPER_SNAKE_CASE
```

### 错误处理

```javascript
// ✅ 正确：使用项目的 ErrorHandler
import { ErrorHandler } from '@/core/error-handler';

try {
  const user = await getUser(id);
} catch (error) {
  ErrorHandler.handle(error, { context: 'getUserById', userId: id });
  throw error;
}

// ❌ 错误：直接使用 console.error
try {
  const user = await getUser(id);
} catch (error) {
  console.error('Error:', error);
}
```

### 日志记录

```javascript
// ✅ 正确：使用统一的 Logger
import { Logger } from '@/core/logger';

Logger.info('Operation started', { userId, action });
Logger.error('Operation failed', { error, context });

// ❌ 错误：使用 console.log
console.log('Operation started');
```

---

## 检查清单

### 查询任务

- [ ] 读取了 SKILL.index.json
- [ ] 通过 tags 匹配找到目标
- [ ] 直接读取目标内容
- [ ] 没有使用全局 Glob/Grep

### 开发任务

- [ ] 读取了相关模块的 SKILL.md
- [ ] 理解了现有代码的架构
- [ ] 代码风格与项目一致
- [ ] 使用项目已有的工具和库
- [ ] 更新了 SKILL.md
- [ ] 运行了 build-index-auto.js
- [ ] 编写了测试

### 文档更新

- [ ] API 文档已更新
- [ ] 使用示例可运行
- [ ] 索引已重新生成

---

## 效率对比

| 方案 | 步骤数 | 字符消耗 | 节省比例 |
|------|--------|---------|---------|
| 全局搜索 | 5+ | 15,938 | - |
| 层级遍历 | 3 | 9,536 | 40% |
| **语义索引** | **2** | **~2,000** | **87%** |

---

## 版本历史

### v2.0.0 (2026-01-29)
- 新增语义索引系统
- 新增自动提取 sections 功能
- 新增 tags 匹配查询算法
- 区分查询和开发两种工作模式
- 支持语言无关的通用方案
- Token 消耗降低 80%+

### v1.0.0 (2025-12-17)
- 初始版本
- 定义 AI 开发的核心原则
- 提供详细的代码规范和示例
