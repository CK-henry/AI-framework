import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { loadFileContent } from '../utils/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Layers,
  Code2,
  Database,
  Server,
  GitBranch,
  FileText,
  Rocket,
  Users,
  Shield,
  Zap,
  BookOpen,
  FolderTree,
  Terminal,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export function ProjectHome() {
  const { index, loading: indexLoading } = useAppStore()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取根目录 SKILL.md 模块
  const rootModule = index?.modules['test-framework']

  useEffect(() => {
    if (rootModule?.file) {
      setLoading(true)
      loadFileContent(rootModule.file)
        .then(setContent)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [rootModule?.file])

  if (indexLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!rootModule) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">未找到项目文档</h2>
        <p className="text-muted-foreground">请确保根目录存在 SKILL.md 文件</p>
      </div>
    )
  }

  // 解析技术栈
  const techStack = [
    { name: 'TypeScript', icon: Code2, color: 'text-blue-500' },
    { name: 'Node.js', icon: Server, color: 'text-green-500' },
    { name: 'Express.js', icon: Zap, color: 'text-yellow-500' },
    { name: 'MongoDB', icon: Database, color: 'text-emerald-500' },
    { name: 'Jest', icon: CheckCircle2, color: 'text-red-500' },
  ]

  // 核心功能
  const features = [
    { name: '用户认证', icon: Shield, desc: '登录、注册、Token 管理' },
    { name: '用户管理', icon: Users, desc: '用户信息查询、更新、删除' },
  ]

  // 快速链接
  const quickLinks = [
    { name: '模块浏览', href: '/modules', icon: FolderTree },
    { name: 'API 文档', href: '/api', icon: BookOpen },
    { name: '搜索', href: '/search', icon: Terminal },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Rocket className="w-4 h-4" />
                v1.0.0
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {rootModule.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                验证分层 SKILL 文档体系的可行性，提供用户认证和用户管理功能
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {rootModule.tags.slice(0, 6).map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted/50 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20">
                <Layers className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map(link => (
          <Link
            key={link.name}
            to={link.href}
            className="group flex items-center justify-between p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <link.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">{link.name}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Architecture & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 架构图 */}
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            项目架构
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">API Layer</div>
                    <div className="text-sm text-muted-foreground">Controllers / Routes</div>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 h-4 w-px bg-border" />
            </div>
            <div className="relative">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="font-medium">Service Layer</div>
                    <div className="text-sm text-muted-foreground">Business Logic</div>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 h-4 w-px bg-border" />
            </div>
            <div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium">Data Layer</div>
                    <div className="text-sm text-muted-foreground">Models / Repositories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 技术栈 */}
        <div className="rounded-2xl bg-card border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            技术栈
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {techStack.map(tech => (
              <div
                key={tech.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <tech.icon className={`w-5 h-5 ${tech.color}`} />
                <span className="font-medium">{tech.name}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            核心功能
          </h3>
          <div className="space-y-3">
            {features.map(feature => (
              <div
                key={feature.name}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
              >
                <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 开发规范 */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          开发规范
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/30">
            <h3 className="font-medium mb-2">代码规范</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ESLint + Prettier</li>
              <li>• camelCase 变量命名</li>
              <li>• TSDoc 注释</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <h3 className="font-medium mb-2">架构规范</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 模块化设计</li>
              <li>• 依赖注入</li>
              <li>• 统一错误处理</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <h3 className="font-medium mb-2">Git 规范</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• feature/xxx 分支</li>
              <li>• feat: 提交前缀</li>
              <li>• PR 代码审查</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <h3 className="font-medium mb-2">测试规范</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 覆盖率 &gt; 80%</li>
              <li>• 集成测试必须</li>
              <li>• Jest 框架</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          快速开始
        </h2>
        <div className="bg-[#1e1e2e] rounded-xl p-5 font-mono text-sm overflow-x-auto">
          <div className="space-y-2">
            <div className="text-muted-foreground"># 1. 克隆仓库</div>
            <div className="text-emerald-400">git clone [repo-url]</div>
            <div className="text-muted-foreground mt-4"># 2. 安装依赖</div>
            <div className="text-emerald-400">npm install</div>
            <div className="text-muted-foreground mt-4"># 3. 配置环境</div>
            <div className="text-emerald-400">cp .env.example .env</div>
            <div className="text-muted-foreground mt-4"># 4. 启动开发服务器</div>
            <div className="text-emerald-400">npm run dev</div>
          </div>
        </div>
      </div>

      {/* 目录结构 */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-primary" />
          目录结构
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/modules"
            className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-primary">src/</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground">源代码目录，包含所有业务逻辑</p>
          </Link>
          <div className="p-4 rounded-xl bg-muted/30">
            <span className="font-medium text-amber-500">docs/</span>
            <p className="text-sm text-muted-foreground mt-2">项目文档中心</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <span className="font-medium text-emerald-500">tests/</span>
            <p className="text-sm text-muted-foreground mt-2">测试代码目录</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <span className="font-medium text-blue-500">config/</span>
            <p className="text-sm text-muted-foreground mt-2">配置文件目录</p>
          </div>
        </div>
      </div>

      {/* 重要文档 */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          重要文档索引
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: '架构设计', path: 'docs/design/architecture.md' },
            { name: '开发计划', path: 'docs/planning/roadmap.md' },
            { name: 'API 文档', path: 'docs/api/README.md' },
            { name: '开发指南', path: 'docs/guides/development.md' },
          ].map(doc => (
            <div
              key={doc.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">{doc.path}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
