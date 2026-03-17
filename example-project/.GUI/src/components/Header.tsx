import { useState } from 'react'
import { useAppStore } from '../store'
import { useTheme, useResponsive } from '../hooks'
import { cn } from '../lib/utils'
import {
  Menu,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  Github,
  ExternalLink,
  Sparkles,
  Command,
} from 'lucide-react'

export function Header() {
  const { toggleSidebar, index, refreshIndex } = useAppStore()
  const { theme, setTheme } = useTheme()
  const { isMobile } = useResponsive()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/parent/build-index-auto.js')
      if (response.ok) {
        console.log('索引生成工具已触发')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      await refreshIndex()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun
      case 'dark': return Moon
      default: return Monitor
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />
      </div>

      {/* 左侧 */}
      <div className="relative flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="btn-icon"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              项目文档管理
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">智能索引</span>
            </div>
          </div>
          {index && (
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{index.stats.totalModules}</span>
                <span>模块</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{index.stats.totalSections}</span>
                <span>API</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{index.stats.totalTags}</span>
                <span>标签</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧 */}
      <div className="relative flex items-center gap-2">
        {/* 快捷键提示 */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 mr-2">
          <Command className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">K 搜索</span>
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'btn-icon',
            isRefreshing && 'animate-pulse'
          )}
          title="刷新索引"
        >
          <RefreshCw className={cn(
            'w-4 h-4 transition-transform duration-500',
            isRefreshing && 'animate-spin'
          )} />
        </button>

        {/* 主题切换 */}
        <div className="relative">
          <button
            onClick={() => {
              const themes = ['light', 'dark', 'system'] as const
              const currentIndex = themes.indexOf(theme)
              const nextTheme = themes[(currentIndex + 1) % themes.length]
              setTheme(nextTheme)
            }}
            className="btn-icon group"
            title={`当前主题: ${theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}`}
          >
            <ThemeIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          </button>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* GitHub 链接 */}
        <a
          href="https://github.com/skill-gui/skill-gui"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-icon group"
          title="GitHub 仓库"
        >
          <Github className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        </a>

        {/* 外部链接 */}
        <a
          href="../"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-icon group"
          title="查看项目文件"
        >
          <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  )
}
