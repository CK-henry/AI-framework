import { useState, useEffect } from 'react'
import { useSearch } from '../hooks'
import { useAppStore } from '../store'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { highlightSearchTerms } from '../utils/api'
import { cn } from '../lib/utils'
import { Link } from 'react-router-dom'
import {
  Search,
  Clock,
  FileText,
  Package,
  ExternalLink,
  X,
  Hash,
  ArrowRight,
} from 'lucide-react'

export function SmartSearch() {
  const { index, loading } = useAppStore()
  const { query, results, history, search, setQuery, clearHistory } = useSearch()
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    await search(searchQuery)
    setIsSearching(false)
  }

  const handleInputChange = (value: string) => {
    setSearchInput(value)
    setQuery(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchInput)
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    setQuery('')
  }

  const getPopularTags = () => {
    if (!index) return []
    return Object.entries(index.tagIndex)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 12)
      .map(([tag]) => tag)
  }

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold">加载搜索索引</p>
          <p className="text-sm text-muted-foreground">正在准备数据...</p>
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

  const popularTags = getPopularTags()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">智能搜索</h1>
        <p className="text-sm text-muted-foreground mt-1">
          基于语义标签的精准搜索
        </p>
      </div>

      {/* 搜索框 */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索 API、模块或标签..."
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-28 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            data-search-input
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchInput && (
              <button
                onClick={clearSearch}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => handleSearch(searchInput)}
              disabled={!searchInput.trim() || isSearching}
              className="btn-primary px-4 py-1.5 text-sm"
            >
              {isSearching ? <LoadingSpinner size="sm" /> : '搜索'}
            </button>
          </div>
        </div>

        {/* 热门标签 */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">热门:</span>
          {popularTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchInput(tag)
                handleSearch(tag)
              }}
              className="text-xs px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 侧边栏 */}
        <div className="lg:col-span-3 space-y-4">
          {/* 搜索历史 */}
          {history.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">搜索历史</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  清除
                </button>
              </div>
              <div className="space-y-1">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchInput(item)
                      handleSearch(item)
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left hover:bg-muted/50 transition-colors"
                  >
                    <Search className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 所有标签 */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">热门标签</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchInput(tag)
                    handleSearch(tag)
                  }}
                  className="text-xs px-2 py-1 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="lg:col-span-9">
          {query ? (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="font-semibold">搜索结果</span>
                  <span className="text-xs text-muted-foreground">
                    ({results.length})
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-muted/50">
                  "{query}"
                </span>
              </div>

              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="group p-4 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center',
                              result.type === 'module'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            )}>
                              {result.type === 'module' ? (
                                <Package className="w-3.5 h-3.5" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerms(
                                    result.title,
                                    query.split(/[,\s]+/).filter(Boolean)
                                  )
                                }}
                              />
                            </h4>
                            <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                              {result.score.toFixed(1)}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground mb-2 ml-8">
                            {result.file}
                            {result.start && result.end && (
                              <span> • 行 {result.start}-{result.end}</span>
                            )}
                          </p>

                          {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 ml-8">
                              {result.tags.slice(0, 5).map((tag) => (
                                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: highlightSearchTerms(
                                        tag,
                                        query.split(/[,\s]+/).filter(Boolean)
                                      )
                                    }}
                                  />
                                </span>
                              ))}
                              {result.tags.length > 5 && (
                                <span className="text-xs text-muted-foreground">
                                  +{result.tags.length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {result.type === 'section' && result.sectionId ? (
                            <Link
                              to={`/api/${result.moduleId}/${result.sectionId}`}
                              className="btn-primary text-xs px-3 py-1.5"
                            >
                              查看
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          ) : (
                            <Link
                              to={`/modules/${result.moduleId}`}
                              className="btn-primary text-xs px-3 py-1.5"
                            >
                              查看
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          )}
                          <a
                            href={`../${result.file}${result.start ? `#L${result.start}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                            title="查看源文件"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold mb-1">未找到结果</h4>
                  <p className="text-sm text-muted-foreground">
                    尝试使用不同的关键词
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">开始搜索</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  输入关键词查找 API 和模块
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularTags.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchInput(tag)
                        handleSearch(tag)
                      }}
                      className="text-sm px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {tag}
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
