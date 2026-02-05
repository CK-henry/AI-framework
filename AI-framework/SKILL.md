---
name: test-framework
title: Test Framework 测试框架
tags: [测试框架, 项目概述, TypeScript, Express, MongoDB, 用户认证, 用户管理, 分层架构, Node.js]
---

# Test Framework

> 版本：1.0.0
> 更新日期：2025-01-29

> **重要提示**
>
> - **开发者**：请先阅读 [开发指南](docs/guides/development.md)
> - **AI 协助开发**：必须遵循 [AI 开发规范](../../AI开发指南.md)

## 项目概述

这是一个用于验证项目文档规范的测试框架。

- **项目目标**：验证分层 SKILL 文档体系的可行性
- **核心功能**：用户认证、用户管理
- **目标用户**：开发者、AI 辅助工具

## 技术栈

- **编程语言**：TypeScript
- **运行环境**：Node.js 18+
- **主要框架**：Express.js
- **数据库**：MongoDB
- **测试框架**：Jest

## 项目架构

```
┌─────────────────────────────────────────┐
│              API Layer                   │
│         (Controllers/Routes)             │
├─────────────────────────────────────────┤
│            Service Layer                 │
│          (Business Logic)                │
├─────────────────────────────────────────┤
│             Data Layer                   │
│        (Models/Repositories)             │
└─────────────────────────────────────────┘
```

### 架构设计理念

- **分层架构**：API → Service → Data
- **依赖注入**：避免硬编码依赖
- **单一职责**：每个模块职责明确

## 开发规范概要

### 代码规范

- **编码风格**：遵循 ESLint + Prettier 配置
- **命名规范**：
  - 变量/函数：camelCase
  - 类/组件：PascalCase
  - 常量：UPPER_SNAKE_CASE
  - 文件名：kebab-case.ts
- **注释规范**：公共 API 必须有 TSDoc 注释

### 架构规范

- **模块化**：每个模块职责单一
- **依赖注入**：避免硬编码依赖
- **错误处理**：统一使用 ErrorHandler
- **日志记录**：统一使用 Logger

### Git 规范

- **分支命名**：feature/xxx, bugfix/xxx, hotfix/xxx
- **提交信息**：`<type>: <description>`
  - type: feat, fix, docs, style, refactor, test, chore

### 测试规范

- **单元测试**：核心逻辑覆盖率 > 80%
- **集成测试**：关键流程必须有集成测试

### 文档规范

- **代码变更**：必须同步更新 SKILL.md
- **API 变更**：必须更新 API 文档和示例
- **重大变更**：必须记录 ADR

## 目录结构

### src/

源代码目录，包含所有业务逻辑和功能实现

- 详见：[src/SKILL.md](src/SKILL.md)

### docs/

项目文档中心，包含设计文档、开发计划等

- 详见：[docs/SKILL.md](docs/SKILL.md)

### tests/

测试代码目录

### config/

配置文件目录

## 快速开始

```bash
# 1. 克隆仓库
git clone [repo-url]

# 2. 安装依赖
npm install

# 3. 配置环境
cp .env.example .env

# 4. 启动开发服务器
npm run dev
```

## 重要文档索引

- [架构设计](docs/design/architecture.md)
- [开发计划](docs/planning/roadmap.md)
- [API 文档](docs/api/README.md)
- [开发指南](docs/guides/development.md)

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/xxx`
3. 提交变更：`git commit -m "feat: xxx"`
4. 推送分支：`git push origin feature/xxx`
5. 创建 Pull Request
