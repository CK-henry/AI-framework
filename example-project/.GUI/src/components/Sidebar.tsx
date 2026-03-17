import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store'
import { useResponsive } from '../hooks'
import { cn } from '../lib/utils'
import {
  Home,
  FolderTree,
  BookOpen,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'

const navigation = [
  { name: '项目概览', href: '/', icon: Home, color: 'from-blue-500 to-cyan-500' },
  { name: '模块浏览', href: '/modules', icon: FolderTree, color: 'from-violet-500 to-purple-500' },
  { name: 'API 文档', href: '/api', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
  { name: '智能搜索', href: '/search', icon: Search, color: 'from-amber-500 to-orange-500' },
  { name: '管理面板', href: '/admin', icon: Settings, color: 'from-rose-500 to-pink-500' },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, index } = useAppStore()
  const { isMobile } = useResponsive()

  const isCollapsed = isMobile ? false : sidebarCollapsed

  return (
    <>
      {/* 侧边栏 */}
      <div className={cn(
        'fixed left-0 top-0 z-50 h-full',
        'bg-card/95 backdrop-blur-xl',
        'border-r border-border/50',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'w-20' : 'w-72',
        isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      )}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        {/* 头部 */}
        <div className={cn(
          'relative flex items-center p-5 border-b border-border/50',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">SKILL GUI</h1>
                <p className="text-xs text-muted-foreground">文档管理系统</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                'btn-icon w-8 h-8',
                isCollapsed && 'absolute -right-4 top-1/2 -translate-y-1/2 bg-card border border-border shadow-md'
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* 项目信息 */}
        {!isCollapsed && index && (
          <div className="relative p-5 border-b border-border/50">
            <div className="glass-card p-4 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                当前项目
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold gradient-text">{index.stats.totalModules}</span>
                    <span className="text-xs text-muted-foreground">模块</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold gradient-text">{index.stats.totalSections}</span>
                    <span className="text-xs text-muted-foreground">API</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 导航菜单 */}
        <nav className="relative flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-4 px-4 py-3.5 rounded-xl',
                  'transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  isCollapsed && 'justify-center px-0'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {/* 活跃指示器 */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}

                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-white/20'
                    : 'bg-muted group-hover:bg-primary/10'
                )}>
                  <item.icon className={cn(
                    'w-5 h-5 transition-transform duration-300',
                    'group-hover:scale-110',
                    isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary'
                  )} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1">
                    <span className={cn(
                      'font-semibold text-sm',
                      isActive ? 'text-white' : ''
                    )}>
                      {item.name}
                    </span>
                  </div>
                )}

                {/* 悬停效果 */}
                {!isActive && !isCollapsed && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-primary to-accent" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* 底部信息 */}
        {!isCollapsed && index && (
          <div className="relative p-5 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>v{index.version}</span>
              </div>
              <span>{new Date(index.updated).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
