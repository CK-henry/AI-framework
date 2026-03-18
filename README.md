# AI 协作开发文档体系 / AI Collaboration Documentation System

> 让 AI 深度参与大型项目开发的工程化解决方案
>
> Engineering solution for deep AI participation in large-scale projects

[中文](#中文) | [English](#english)

---

<a name="中文"></a>
## 中文版

### 这是什么

一套专为 AI 辅助开发工具（Claude Code、GitHub Copilot、Cursor 等）设计的**项目文档规范和工具集**。

通过语义索引系统，让 AI 能够：
- 精准定位代码（2 步完成，Token 消耗降低 87%）
- 理解项目结构和模块边界
- 遵循开发规范，减少误改
- 持续参与大型项目开发

## 核心价值

| 问题 | 解决方案 |
|------|---------|
| AI 在大型项目中迷路 | 语义索引 + 分层文档导航 |
| Token 消耗过高 | 从 15,000 字符降至 2,000 字符 |
| 文档与代码脱节 | 自动索引生成 + 同步更新机制 |
| 缺乏协作规范 | 完整的建系流程和开发指南 |

## 快速导航

### 📖 根据你的需求选择

**我想了解这套体系**
- 先看：[项目文档规范标准v2.md](项目文档规范标准v2.md) - 了解技术规范和索引系统

**我要开始新项目**
- 先看：[AI协作文档建系指南.md](AI协作文档建系指南.md) - 从 0 到 1 建立文档体系

**我要改造旧项目**
- 先看：[AI协作旧项目迁移指南.md](AI协作旧项目迁移指南.md) - 逐步迁移现有项目

**我是 AI，要参与开发**
- 先看：[AI开发指南v2.md](AI开发指南v2.md) - 如何使用语义索引和开发规范

**我想看完整示例**
- 查看：[example-project/](example-project/) - 包含完整实现的示例项目

## 核心组件

```
AI开发指南/
├── 项目文档规范标准v2.md      # 技术规范（SKILL.md + 语义索引）
├── AI开发指南v2.md            # AI 使用手册
├── AI协作文档建系指南.md       # 新项目实施流程
├── AI协作旧项目迁移指南.md     # 旧项目改造流程
└── example-project/           # 示例项目
    ├── SKILL.md              # 示例文档
    ├── SKILL.index.json      # 生成的索引
    ├── build-index-auto.js   # 索引生成工具
    └── .GUI/                 # 可视化界面（可选）
```

## 快速开始

### 1. 在你的项目中使用

```bash
# 复制核心文件到你的项目
cp example-project/build-index-auto.js your-project/

# 创建根文档（参考模板）
# 编辑 your-project/SKILL.md

# 生成索引
cd your-project
node build-index-auto.js

# 现在 AI 可以通过 SKILL.index.json 快速定位代码了
```

### 2. 查看示例项目

```bash
# 进入示例项目
cd example-project

# 生成索引
node build-index-auto.js

# （可选）启动可视化界面
# Windows: start-gui.bat
# Mac/Linux: ./start-gui.sh
```

## 核心特性

### 语义索引系统

通过 `SKILL.index.json` 实现精准定位：

```
用户问题 → 读取索引 → 标签匹配 → 定位文件+行号 → 直接读取
```

**效率对比**：
- 传统搜索：5+ 步，15,938 字符
- **语义索引：2 步，~2,000 字符（节省 87%）**

### SKILL.md 文档规范

```markdown
---
name: module-name
tags: [标签1, 标签2, 标签3]
---

# 模块名称

## 模块概述
...

## API 文档
...
```

工具自动提取标题、生成索引，零维护成本。

## 适用场景

- ✅ 中大型项目，模块较多
- ✅ 需要 AI 长期参与开发
- ✅ 团队协作，需要统一规范
- ✅ 文档与代码容易脱节
- ✅ AI 经常在项目中迷路

## 版本历史

### v2.0.0 (2026-01-29)
- 语义索引系统，Token 消耗降低 80%+
- 自动提取 sections，零维护成本
- 支持语言无关的通用方案
- 新增建系指南和迁移指南

## 贡献与反馈

欢迎提交 Issue 和 PR，帮助改进这套体系。

**联系方式**：
- 微信：`dorado_henry`
- GitHub Issues: [提交问题](../../issues)

## 许可证

MIT License

---

<a name="english"></a>
## English Version

### What is this

A **documentation specification and toolset** designed for AI-assisted development tools (Claude Code, GitHub Copilot, Cursor, etc.).

Through semantic indexing, AI can:
- Precisely locate code (2 steps, 87% token reduction)
- Understand project structure and module boundaries
- Follow development standards, reduce errors
- Continuously participate in large project development

### Core Value

| Problem | Solution |
|---------|----------|
| AI gets lost in large projects | Semantic indexing + hierarchical documentation |
| High token consumption | From 15,000 to 2,000 characters |
| Documentation-code mismatch | Auto-generated index + sync mechanism |
| Lack of collaboration standards | Complete setup and development guides |

### Quick Navigation

**Learn about the system**
- See: [Project Documentation Standard v2](Project-Documentation-Standard-v2-EN.md) - Technical specs and indexing system

**Start a new project**
- See: [Documentation Setup Guide](AI-Collaboration-Setup-Guide-EN.md) - Build from scratch

**Migrate existing project**
- See: [Migration Guide](AI-Collaboration-Migration-Guide-EN.md) - Gradual migration

**AI developer guide**
- See: [AI Development Guide v2](AI-Development-Guide-v2-EN.md) - How to use semantic indexing

**View complete example**
- Check: [example-project/](example-project/) - Full implementation example

### Project Structure

```
AI-Collaboration-Docs/
├── 项目文档规范标准v2.md                    # Technical specs (Chinese)
├── Project-Documentation-Standard-v2-EN.md  # Technical specs (English)
├── AI开发指南v2.md                          # AI user manual (Chinese)
├── AI-Development-Guide-v2-EN.md            # AI user manual (English)
├── AI协作文档建系指南.md                     # Setup guide (Chinese)
├── AI-Collaboration-Setup-Guide-EN.md       # Setup guide (English)
├── AI协作旧项目迁移指南.md                   # Migration guide (Chinese)
├── AI-Collaboration-Migration-Guide-EN.md   # Migration guide (English)
└── example-project/                         # Example project
    ├── SKILL.md                            # Example documentation
    ├── SKILL.index.json                    # Generated index
    ├── build-index-auto.js                 # Index generator
    └── .GUI/                               # Visualization UI (optional)
        └── README-EN.md                    # GUI documentation (English)
```

### Quick Start

#### 1. Use in your project

```bash
# Copy core files to your project
cp example-project/build-index-auto.js your-project/

# Create root documentation (refer to template)
# Edit your-project/SKILL.md

# Generate index
cd your-project
node build-index-auto.js

# Now AI can quickly locate code via SKILL.index.json
```

#### 2. View example project

```bash
# Enter example project
cd example-project

# Generate index
node build-index-auto.js

# (Optional) Start visualization UI
# Windows: start-gui.bat
# Mac/Linux: ./start-gui.sh
```

### Core Features

#### Semantic Indexing System

Precise location via `SKILL.index.json`:

```
User query → Read index → Tag matching → Locate file+line → Direct read
```

**Efficiency comparison**:
- Traditional search: 5+ steps, 15,938 characters
- **Semantic indexing: 2 steps, ~2,000 characters (87% savings)**

#### SKILL.md Documentation Format

```markdown
---
name: module-name
tags: [tag1, tag2, tag3]
---

# Module Name

## Overview
...

## API Documentation
...
```

Auto-extract titles, generate index, zero maintenance cost.

### Use Cases

- ✅ Medium to large projects with multiple modules
- ✅ Long-term AI participation in development
- ✅ Team collaboration requiring unified standards
- ✅ Documentation-code synchronization issues
- ✅ AI frequently gets lost in projects

### Version History

#### v2.0.0 (2026-01-29)
- Semantic indexing system, 80%+ token reduction
- Auto-extract sections, zero maintenance
- Language-agnostic solution
- Added setup and migration guides

### Contributing

Issues and PRs are welcome to help improve this system.

**Contact**:
- WeChat: `dorado_henry`
- GitHub Issues: [Submit Issue](../../issues)

### License

MIT License
