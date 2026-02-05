# 项目文档中心

> 层级：第 2 层（模块文档）
> 上层：[根 SKILL.md](../SKILL.md)

## 文档概述

本目录包含项目的所有设计文档、开发计划和技术文档。

## 文档分类

### design/ - 设计文档

功能设计、技术方案、架构决策

- [架构设计](design/architecture.md)
- [认证模块设计](design/auth-design.md)
- [用户模块设计](design/user-design.md)

### planning/ - 开发计划

产品路线图、迭代计划、任务分解

- [产品路线图](planning/roadmap.md)
- [当前迭代](planning/sprint-1.md)

### api/ - API 文档

详细的 API 参考文档

- [REST API 概览](api/README.md)
- [认证 API](api/auth-api.md)
- [用户 API](api/user-api.md)

### guides/ - 使用指南

开发、部署、使用指南

- [快速开始](guides/getting-started.md)
- [开发指南](guides/development.md)
- [部署指南](guides/deployment.md)

### decisions/ - 技术决策记录

重要技术决策的记录和理由

- [ADR-001: 使用 TypeScript](decisions/001-use-typescript.md)
- [ADR-002: 选择 MongoDB](decisions/002-choose-mongodb.md)

## 文档维护规范

1. **开发前**：编写设计文档和开发计划
2. **开发中**：及时更新进度
3. **完成后**：同步更新文档和 API 说明
4. **重大变更**：记录技术决策 (ADR)
