---
name: skill-gui
title: SKILL GUI 文档可视化框架
tags: [GUI, 文档管理, React, TypeScript, Vite, 语义搜索, 实时更新, 可视化]
---

# SKILL GUI

> 版本：1.0.0
> 更新日期：2026-02-05

> **快速开始**
>
> - **Windows**：双击 `start-gui.bat` 或 `start-gui.bat 3000`（指定端口）
> - **Mac/Linux**：运行 `./start-gui.sh` 或 `./start-gui.sh 3000`

## 项目概述

基于 SKILL.md 规范的通用项目文档可视化框架。

- **项目目标**：为任何遵循 SKILL.md 规范的项目提供可视化文档管理界面
- **核心功能**：项目概览、模块浏览、API 文档、语义搜索、实时更新
- **目标用户**：开发者、技术文档维护者、AI 辅助开发工具

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS + shadcn/ui
- **状态管理**：Zustand
- **路由**：React Router 6
- **图标库**：Lucide React

## 功能特性

### 核心功能

| 功能 | 说明 |
|------|------|
| 项目介绍 | 展示根目录 SKILL.md，包含架构、技术栈、规范等 |
| 模块浏览 | 树形结构导航，模块详情展示 |
| API 文档 | API 列表、参数详情、代码示例 |
| 智能搜索 | 基于语义标签的精准搜索 |
| 实时更新 | 监听索引文件变化，自动刷新 |

### 运行模式

- **开发模式**：`npm run dev`，支持热更新
- **静态模式**：`npm run build` 后直接打开 `dist/index.html`
- **预览模式**：`npm run preview`，预览构建结果

## 快速开始

### 方式一：一键启动（推荐）

```bash
# Windows - 默认端口 5173
start-gui.bat

# Windows - 指定端口
start-gui.bat 3000

# Mac/Linux - 默认端口
chmod +x start-gui.sh
./start-gui.sh

# Mac/Linux - 指定端口
./start-gui.sh 3000
```

### 方式二：手动启动

```bash
# 1. 进入 GUI 目录
cd .GUI

# 2. 安装依赖（首次）
npm install

# 3. 生成索引（如果不存在）
cd .. && node build-index-auto.js && cd .GUI

# 4. 启动开发服务器
npm run dev

# 或指定端口
npx vite --port 3000
```

### 方式三：静态部署

```bash
# 构建静态文件
cd .GUI
npm run build

# 直接打开 dist/index.html
# 或部署到任意静态服务器
```

## 目录结构

```
.GUI/
├── src/
│   ├── components/     # 通用组件
│   │   ├── ui/        # 基础 UI 组件
│   │   ├── Layout.tsx # 布局组件
│   │   └── ...
│   ├── pages/         # 页面组件
│   │   ├── ProjectOverview.tsx  # 概览页
│   │   ├── ProjectHome.tsx      # 项目介绍页
│   │   ├── ModuleBrowser.tsx    # 模块浏览页
│   │   ├── APIDocCenter.tsx     # API 文档页
│   │   ├── SmartSearch.tsx      # 搜索页
│   │   └── AdminPanel.tsx       # 管理面板
│   ├── hooks/         # 自定义 Hooks
│   ├── store/         # Zustand 状态管理
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript 类型定义
│   └── App.tsx        # 应用入口
├── dist/              # 构建输出（静态模式）
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 界面说明

### 概览页 (/)

显示项目统计信息、模块列表、热门标签等。

### 项目介绍页 (/project)

展示根目录 SKILL.md 的完整内容，包括：
- 项目架构图
- 技术栈
- 开发规范
- 快速开始指南
- 目录结构

### 模块浏览页 (/modules)

- 左侧：模块树形导航
- 右侧：模块详情、API 列表、代码示例

### API 文档页 (/api)

- API 分类列表
- 参数说明
- 返回值说明
- 代码示例（语法高亮）

### 搜索页 (/search)

- 标签搜索
- 模糊搜索
- 搜索历史
- 结果高亮

### 管理面板 (/admin)

- 索引状态检查
- 缓存管理
- 配置导出

## 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  base: './',           // 静态模式使用相对路径
  server: {
    port: 5173,         // 默认端口
    host: true,         // 允许外部访问
  }
})
```

### 主题配置

支持三种主题模式：
- `light` - 浅色主题
- `dark` - 深色主题
- `system` - 跟随系统

## 开发指南

### 添加新页面

```typescript
// 1. 创建页面组件
// src/pages/NewPage.tsx
export function NewPage() {
  return <div>新页面</div>
}

// 2. 添加路由
// src/App.tsx
<Route path="/new" element={<NewPage />} />

// 3. 添加导航
// src/components/Layout.tsx
const navigation = [
  // ...
  { name: '新页面', href: '/new', icon: SomeIcon },
]
```

### 使用 Store

```typescript
import { useAppStore } from '../store'

function MyComponent() {
  const { index, loading, refreshIndex } = useAppStore()

  // 使用数据...
}
```

### 加载文件内容

```typescript
import { loadFileContent } from '../utils/api'

const content = await loadFileContent('src/modules/auth/SKILL.md')
```

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + K` | 聚焦搜索框 |
| `Ctrl/Cmd + B` | 切换侧边栏 |
| `ESC` | 取消搜索焦点 |

## 常见问题

### 1. 索引文件不存在？

运行索引生成工具：
```bash
node build-index-auto.js
```

### 2. 端口被占用？

指定其他端口：
```bash
# Windows
start-gui.bat 3001

# Mac/Linux
./start-gui.sh 3001
```

### 3. 静态模式无法加载数据？

确保已运行 `npm run build`，构建过程会自动复制数据文件到 `dist/data/` 目录。

### 4. 模块未显示？

检查 SKILL.md 文件是否包含 YAML 头部：
```markdown
---
name: module-name
tags: [标签1, 标签2]
---
```

## 依赖关系

### 生产依赖

- `react` / `react-dom` - UI 框架
- `react-router-dom` - 路由
- `zustand` - 状态管理
- `lucide-react` - 图标
- `react-markdown` / `remark-gfm` - Markdown 渲染
- `@radix-ui/*` - 无障碍 UI 组件
- `tailwind-merge` / `clsx` - 样式工具

### 开发依赖

- `vite` - 构建工具
- `typescript` - 类型系统
- `tailwindcss` - CSS 框架
- `eslint` - 代码检查

## 版本历史

### v1.0.0 (2026-02-05)

- 初始版本
- 项目概览、模块浏览、API 文档、搜索功能
- 支持开发模式和静态模式
- 跨平台启动脚本（Windows/Mac/Linux）
- 端口自定义支持
