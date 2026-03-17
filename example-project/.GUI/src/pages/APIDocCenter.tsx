import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '../store'
import { loadFileContent } from '../utils/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { cn } from '../lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BookOpen,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Hash,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react'

export function APIDocCenter() {
  const { moduleId, sectionId } = useParams()
  const { index, loading } = useAppStore()
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(moduleId || null)
  const [selectedSection, setSelectedSection] = useState<string | null>(sectionId || null)
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const currentModule = selectedModuleId ? index?.modules[selectedModuleId] : null
  const currentSection = selectedSection && currentModule ? currentModule.sections[selectedSection] : null

  const toggleModuleCollapse = (modId: string) => {
    setCollapsedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(modId)) {
        newSet.delete(modId)
      } else {
        newSet.add(modId)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (currentModule && currentSection) {
      setLoadingContent(true)
      loadFileContent(currentModule.file)
        .then((content) => setFileContent(content))
        .catch((error) => {
          console.error('加载文件内容失败:', error)
          setFileContent(null)
        })
        .finally(() => setLoadingContent(false))
    }
  }, [currentModule, currentSection])

  const getSectionContent = () => {
    if (!fileContent || !currentSection) return ''
    const lines = fileContent.split('\n')
    const startLine = Math.max(0, currentSection.start - 1)
    const endLine = Math.min(lines.length, currentSection.end)
    return lines.slice(startLine, endLine).join('\n')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold">加载 API 文档</p>
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

  const allSections = Object.entries(index.modules).flatMap(([modId, module]) =>
    Object.entries(module.sections).map(([secId, section]) => ({
      moduleId: modId,
      sectionId: secId,
      module,
      section,
    }))
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API 文档中心</h1>
        <p className="text-sm text-muted-foreground mt-1">
          共 {allSections.length} 个接口文档
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API 列表 */}
        <div className="lg:col-span-3">
          <div className="glass-card p-4 sticky top-20">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">API 列表</span>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
              {Object.entries(index.modules).map(([modId, module]) => {
                const isCollapsed = collapsedModules.has(modId)
                const apiCount = Object.values(module.sections).filter(s => s.level >= 3).length

                return (
                  <div key={modId}>
                    <button
                      onClick={() => toggleModuleCollapse(modId)}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm truncate">{module.title}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{apiCount}</span>
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="ml-2 space-y-0.5">
                        {Object.entries(module.sections)
                          .filter(([_, section]) => section.level >= 3)
                          .map(([secId, section]) => (
                            <button
                              key={`${modId}-${secId}`}
                              onClick={() => {
                                setSelectedModuleId(modId)
                                setSelectedSection(secId)
                                window.history.pushState({}, '', `/api/${modId}/${secId}`)
                              }}
                              className={cn(
                                'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                                selectedSection === secId && selectedModuleId === modId
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'w-5 h-5 rounded text-xs font-medium flex items-center justify-center flex-shrink-0',
                                  selectedSection === secId && selectedModuleId === modId
                                    ? 'bg-primary-foreground/20'
                                    : section.level === 3
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                )}>
                                  {section.level}
                                </span>
                                <span className="truncate">{section.title}</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* API 详情 */}
        <div className="lg:col-span-9">
          {currentModule && currentSection ? (
            <div className="space-y-4">
              {/* API 头部 */}
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                        currentSection.level === 3
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      )}>
                        H{currentSection.level}
                      </span>
                      <h2 className="text-xl font-bold">{currentSection.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentModule.title} • 行 {currentSection.start}-{currentSection.end}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(getSectionContent())}
                      className={cn(
                        'btn-secondary text-sm',
                        copied && 'text-emerald-600 border-emerald-500/30'
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1.5" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1.5" />
                          复制
                        </>
                      )}
                    </button>
                    <a
                      href={`../${currentModule.file}#L${currentSection.start}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" />
                      源文件
                    </a>
                  </div>
                </div>

                {currentSection.tags && currentSection.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1.5">
                      {currentSection.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-muted/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* API 内容 */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">文档内容</span>
                </div>

                {loadingContent ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground">加载内容中...</p>
                  </div>
                ) : (
                  <div className="prose prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getSectionContent()}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* 导航 */}
              <div className="flex justify-between">
                <button
                  className="btn-secondary text-sm"
                  disabled={allSections.findIndex(s => s.sectionId === selectedSection && s.moduleId === selectedModuleId) === 0}
                  onClick={() => {
                    const currentIndex = allSections.findIndex(s => s.sectionId === selectedSection && s.moduleId === selectedModuleId)
                    if (currentIndex > 0) {
                      const prev = allSections[currentIndex - 1]
                      setSelectedModuleId(prev.moduleId)
                      setSelectedSection(prev.sectionId)
                      window.history.pushState({}, '', `/api/${prev.moduleId}/${prev.sectionId}`)
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  上一个
                </button>
                <button
                  className="btn-secondary text-sm"
                  disabled={allSections.findIndex(s => s.sectionId === selectedSection && s.moduleId === selectedModuleId) === allSections.length - 1}
                  onClick={() => {
                    const currentIndex = allSections.findIndex(s => s.sectionId === selectedSection && s.moduleId === selectedModuleId)
                    if (currentIndex < allSections.length - 1) {
                      const next = allSections[currentIndex + 1]
                      setSelectedModuleId(next.moduleId)
                      setSelectedSection(next.sectionId)
                      window.history.pushState({}, '', `/api/${next.moduleId}/${next.sectionId}`)
                    }
                  }}
                >
                  下一个
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">选择一个 API</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  从左侧列表中选择 API 查看文档
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {allSections.slice(0, 4).map(({ moduleId: mId, sectionId: sId, section }) => (
                    <button
                      key={`${mId}-${sId}`}
                      onClick={() => {
                        setSelectedModuleId(mId)
                        setSelectedSection(sId)
                        window.history.pushState({}, '', `/api/${mId}/${sId}`)
                      }}
                      className="btn-secondary text-sm"
                    >
                      {section.title}
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
