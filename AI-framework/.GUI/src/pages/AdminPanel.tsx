import { useState } from 'react'
import { useAppStore } from '../store'
import { getProjectStats, checkIndexFile } from '../utils/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import {
  Settings,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Trash2,
  Info,
} from 'lucide-react'
import { cn } from '../lib/utils'

export function AdminPanel() {
  const { index, loading, refreshIndex, fileCache } = useAppStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [_indexStatus, setIndexStatus] = useState<'checking' | 'exists' | 'missing'>('checking')

  // 检查索引文件状态
  const checkStatus = async () => {
    setIndexStatus('checking')
    const exists = await checkIndexFile()
    setIndexStatus(exists ? 'exists' : 'missing')
  }

  // 手动刷新索引
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshIndex()
    setIsRefreshing(false)
  }

  // 导出配置
  const exportConfig = () => {
    if (!index) return

    const config = {
      version: index.version,
      exported: new Date().toISOString(),
      stats: index.stats,
      modules: Object.keys(index.modules),
      tags: Object.keys(index.tagIndex),
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skill-gui-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 清除缓存
  const clearCache = () => {
    // 清除文件缓存
    Object.keys(fileCache).forEach(key => {
      delete fileCache[key]
    })

    // 清除本地存储
    localStorage.removeItem('skill-gui-search-history')

    alert('缓存已清除')
  }

  const stats = index ? getProjectStats(index) : null

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">管理面板</h1>
        <p className="text-muted-foreground">
          系统状态监控、配置管理和维护工具
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 系统状态 */}
        <div className="module-card">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold">系统状态</h2>
          </div>

          <div className="space-y-4">
            {/* ��引状态 */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center">
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : index ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                )}
                <div>
                  <div className="font-medium">索引状态</div>
                  <div className="text-sm text-muted-foreground">
                    {loading ? '加载中...' : index ? '正常' : '未加载'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
              >
                <RefreshCw className={cn('w-4 h-4 mr-1', isRefreshing && 'animate-spin')} />
                刷新
              </button>
            </div>

            {/* 文件状态 */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                <div>
                  <div className="font-medium">索引文件</div>
                  <div className="text-sm text-muted-foreground">
                    SKILL.index.json
                  </div>
                </div>
              </div>
              <button
                onClick={checkStatus}
                className="flex items-center px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
              >
                检查
              </button>
            </div>

            {/* 缓存状态 */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-yellow-500" />
                <div>
                  <div className="font-medium">文件缓存</div>
                  <div className="text-sm text-muted-foreground">
                    {Object.keys(fileCache).length} 个文件已缓存
                  </div>
                </div>
              </div>
              <button
                onClick={clearCache}
                className="flex items-center px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清除
              </button>
            </div>
          </div>
        </div>

        {/* 项目信息 */}
        {stats && (
          <div className="module-card">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">项目信息</h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalModules}</div>
                  <div className="text-sm text-muted-foreground">模块</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalSections}</div>
                  <div className="text-sm text-muted-foreground">API</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalTags}</div>
                  <div className="text-sm text-muted-foreground">标签</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">文件</div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">最后更新</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">热门标签</div>
                <div className="flex flex-wrap gap-1">
                  {stats.popularTags.slice(0, 8).map(({ tag, count }) => (
                    <span key={tag} className="tag text-xs">
                      {tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 管理工具 */}
      <div className="module-card">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">管理工具</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportConfig}
            disabled={!index}
            className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="w-5 h-5 mr-2" />
            导出配置
          </button>

          <button
            onClick={() => window.open('../', '_blank')}
            className="flex items-center justify-center px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          >
            <FileText className="w-5 h-5 mr-2" />
            查看项目文件
          </button>

          <button
            onClick={() => window.open('../build-index-auto.js', '_blank')}
            className="flex items-center justify-center px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          >
            <Upload className="w-5 h-5 mr-2" />
            索引生成工具
          </button>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="module-card">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">使用说明</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">自动更新</h3>
            <p className="text-muted-foreground">
              系统会每 30 秒自动检查索引文件更新。当 SKILL.index.json 文件发生变化时，界面会自动刷新。
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">手动刷新</h3>
            <p className="text-muted-foreground">
              如果发现数据不同步，可以点击"刷新"按钮手动更新索引。建议在修改 SKILL.md 文件后运行 build-index-auto.js 重新生成索引。
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">缓存管理</h3>
            <p className="text-muted-foreground">
              系统会缓存已读取的文件内容以提高性能。如果文件内容有更新但界面未反映，可以清除缓存。
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">键盘快捷键</h3>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li>Ctrl/Cmd + B: 切换侧边栏</li>
              <li>Ctrl/Cmd + K: 聚焦搜索框</li>
              <li>ESC: 取消搜索焦点</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}