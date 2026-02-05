import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { getProjectStats, getPopularTags } from '../utils/api'
import { cn } from '../lib/utils'
import {
  Package,
  FileText,
  Hash,
  ArrowRight,
  Search,
  BookOpen,
  FolderTree,
  Settings,
} from 'lucide-react'

export function ProjectOverview() {
  const { index, loading } = useAppStore()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1">加载中</h2>
          <p className="text-sm text-muted-foreground">正在获取项目数据...</p>
        </div>
      </div>
    )
  }

  if (!index) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1">未找到项目索引</h2>
          <p className="text-sm text-muted-foreground">请确保项目根目录存在 SKILL.index.json 文件</p>
        </div>
      </div>
    )
  }

  const stats = getProjectStats(index)
  const popularTags = getPopularTags(index, 15)
  const modules = Object.entries(index.modules)

  return (
    <div className="space-y-6 pb-16">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">项目概览</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SKILL 文档管理系统 v{index.version}
          </p>
        </div>
        <Link to="/search" className="btn-primary">
          <Search className="w-4 h-4 mr-2" />
          开始搜索
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">模块</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalModules}</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">API</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalSections}</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs text-muted-foreground">标签</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalTags}</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-xs text-muted-foreground">文件</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalFiles}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快速导航 */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">快速导航</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/search"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">搜索</span>
            </Link>
            <Link
              to="/modules"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <FolderTree className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">模块</span>
            </Link>
            <Link
              to="/api"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">API</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">设置</span>
            </Link>
          </div>
        </div>

        {/* 热门标签 */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">热门标签</span>
            </div>
            <Link to="/search" className="text-xs text-primary hover:underline">
              查看全部
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(({ tag, count }, idx) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  idx < 3
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-foreground'
                )}
              >
                {tag}
                <span className={cn(
                  'text-xs',
                  idx < 3 ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 模块列表 */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">项目模块</span>
            <span className="text-xs text-muted-foreground">({modules.length})</span>
          </div>
          <Link to="/modules" className="text-xs text-primary hover:underline flex items-center gap-1">
            查看全部
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {modules.slice(0, 8).map(([moduleId, module]) => (
            <Link
              key={moduleId}
              to={`/modules/${moduleId}`}
              className="group p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {module.title}
                </h4>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{Object.keys(module.sections).length} API</span>
                <span>{module.tags.length} 标签</span>
              </div>
            </Link>
          ))}
        </div>

        {modules.length > 8 && (
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <Link to="/modules" className="btn-secondary text-sm">
              查看全部 {modules.length} 个模块
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* 层级分布 */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">层级分布</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.modulesByLevel).map(([level, count]) => {
            const percentage = Math.round((count / stats.totalSections) * 100) || 0
            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">H{level} 标题</span>
                  <span className="text-muted-foreground">{count} ({percentage}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
