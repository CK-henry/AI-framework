import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store'
import { cn } from '../lib/utils'
import {
  FolderTree,
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Hash,
  BookOpen,
} from 'lucide-react'

export function ModuleBrowser() {
  const { moduleId } = useParams()
  const { index, loading } = useAppStore()
  const [selectedModule, setSelectedModule] = useState<string | null>(moduleId || null)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <FolderTree className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="font-semibold">加载模块信息</p>
          <p className="text-sm text-muted-foreground">正在获取数据...</p>
        </div>
      </div>
    )
  }

  if (!index) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">未找到项目索引</h2>
          <p className="text-muted-foreground">请确保项目根目录存在 SKILL.index.json 文件</p>
        </div>
      </div>
    )
  }

  const modules = Object.entries(index.modules)
  const currentModule = selectedModule ? index.modules[selectedModule] : null

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">模块浏览器</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {modules.length} 个模块
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 模块列表 - 更窄 */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="glass-card p-4 sticky top-20">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <FolderTree className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">项目模块</span>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
              {modules.map(([id, module]) => (
                <button
                  key={id}
                  onClick={() => setSelectedModule(id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200',
                    selectedModule === id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/70'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{module.title}</span>
                    <ChevronRight className={cn(
                      'w-4 h-4 flex-shrink-0 transition-transform',
                      selectedModule === id && 'translate-x-0.5'
                    )} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'text-xs',
                      selectedModule === id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {Object.keys(module.sections).length} 个 API
                    </span>
                    <span className={cn(
                      'text-xs',
                      selectedModule === id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      •
                    </span>
                    <span className={cn(
                      'text-xs',
                      selectedModule === id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {module.tags.length} 标签
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 模块详情 - 更宽 */}
        <div className="lg:col-span-8 xl:col-span-9">
          {currentModule ? (
            <div className="space-y-6">
              {/* 模块头部 - 简洁版 */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{currentModule.title}</h2>
                    <p className="text-sm text-muted-foreground font-mono">{selectedModule}</p>
                  </div>
                  <a
                    href={`../${currentModule.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    源文件
                  </a>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {currentModule.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                    >
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* API 列表 */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-semibold">API 文档</span>
                    <span className="text-xs text-muted-foreground">
                      ({Object.keys(currentModule.sections).length})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(currentModule.sections).map(([sectionId, section]) => (
                    <Link
                      key={sectionId}
                      to={`/api/${selectedModule}/${sectionId}`}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={cn(
                          'flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold',
                          section.level === 2 && 'bg-primary/10 text-primary',
                          section.level === 3 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                          section.level === 4 && 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        )}>
                          H{section.level}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {section.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            行 {section.start}-{section.end}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <FolderTree className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">选择一个模块</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  从左侧列表中选择模块查看详情
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {modules.slice(0, 3).map(([id, module]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedModule(id)}
                      className="btn-secondary text-sm"
                    >
                      {module.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
