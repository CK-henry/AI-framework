import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store'
import { useKeyboardShortcuts, useTheme } from '../hooks'
import { cn } from '../lib/utils'
import {
  Home,
  FolderTree,
  BookOpen,
  Search,
  Settings,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Command,
  FileText,
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: '概览', href: '/', icon: Home },
  { name: '项目介绍', href: '/project', icon: FileText },
  { name: '模块', href: '/modules', icon: FolderTree },
  { name: 'API', href: '/api', icon: BookOpen },
  { name: '搜索', href: '/search', icon: Search },
  { name: '设置', href: '/admin', icon: Settings },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { index, refreshIndex } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useKeyboardShortcuts()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshIndex()
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
    <div className="min-h-screen bg-background">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/3 to-accent/3 rounded-full blur-[150px]" />
      </div>

      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg tracking-tight">SKILL GUI</h1>
                <p className="text-xs text-muted-foreground">文档管理系统</p>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-2">
              {/* 快捷键提示 */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 mr-2">
                <Command className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">K</span>
              </div>

              {/* 刷新 */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-icon"
                title="刷新索引"
              >
                <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
              </button>

              {/* 主题切换 */}
              <button
                onClick={() => {
                  const themes = ['light', 'dark', 'system'] as const
                  const currentIndex = themes.indexOf(theme)
                  setTheme(themes[(currentIndex + 1) % themes.length])
                }}
                className="btn-icon"
                title="切换主题"
              >
                <ThemeIcon className="w-4 h-4" />
              </button>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-icon md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <nav className="max-w-[1800px] mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* 主内容区域 */}
      <main className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 底部状态栏 */}
      {index && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-t border-border/50">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>已连接</span>
                </div>
                <span>v{index.version}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{index.stats.totalModules} 模块</span>
                <span>{index.stats.totalSections} API</span>
                <span>{index.stats.totalTags} 标签</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
